from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import User
from .models import Lectura, Dispositivo


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UsuarioSerializer(serializers.ModelSerializer):
    dispositivos = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'dispositivos']

    def get_dispositivos(self, obj):
        return DispositivoResumenSerializer(obj.dispositivos.filter(activo=True), many=True).data


# ── Dispositivo ───────────────────────────────────────────────────────────────

class DispositivoResumenSerializer(serializers.ModelSerializer):
    """Vista compacta para listas y selectores."""
    ultima_lectura = serializers.SerializerMethodField()

    class Meta:
        model = Dispositivo
        fields = ['id', 'nombre', 'codigo', 'ubicacion', 'activo', 'fecha_registro', 'ultima_lectura']

    def get_ultima_lectura(self, obj):
        lectura = obj.lecturas.first()
        if lectura:
            return {
                'timestamp': lectura.timestamp,
                'estado_sistema': lectura.estado_sistema,
                'temperatura': lectura.temperatura,
            }
        return None


class DispositivoDetalleSerializer(serializers.ModelSerializer):
    """Vista completa incluyendo api_key (solo para admins)."""
    class Meta:
        model = Dispositivo
        fields = ['id', 'nombre', 'codigo', 'api_key', 'ubicacion', 'activo', 'fecha_registro']


# ── Lectura ───────────────────────────────────────────────────────────────────

class LecturaSerializer(serializers.ModelSerializer):
    es_alerta = serializers.SerializerMethodField()
    dispositivo_codigo = serializers.CharField(source='dispositivo.codigo', read_only=True)

    class Meta:
        model = Lectura
        fields = [
            'id',
            'dispositivo',
            'dispositivo_codigo',
            'temperatura',
            'nivel_gas',
            'presion',
            'llama_detectada',
            'ventilador_extraccion',
            'ventilador_inyeccion_1',
            'ventilador_inyeccion_2',
            'aspersion_activa',
            'valvulas_cerradas',
            'evacuacion_activa',
            'estado_sistema',
            'timestamp',
            'es_alerta',
        ]
        read_only_fields = ['id', 'timestamp', 'es_alerta', 'dispositivo_codigo']

    def validate_temperatura(self, value):
        if not (-10 <= value <= 100):
            raise serializers.ValidationError(
                f"Temperatura debe estar entre -10 y 100°C, recibido: {value}"
            )
        return value

    def validate_nivel_gas(self, value):
        if value == -1:
            value = 0
        if not (0 <= value <= 1023):
            raise serializers.ValidationError(
                f"nivel_gas debe estar entre 0 y 1023, recibido: {value}"
            )
        return value

    def validate_presion(self, value):
        if value is None:
            return 0
        # Solo rechazar valores claramente fuera de rango físico
        if value != 0 and (value < 800 or value > 1200):
            raise serializers.ValidationError(
                f"Presión debe estar entre 800 y 1200 hPa, recibido: {value}"
            )
        return value

    def validate(self, data):
        if 'estado_sistema' not in data or not data['estado_sistema']:
            data['estado_sistema'] = self._determinar_estado(data)
        return data

    def _determinar_estado(self, data):
        temperatura = data.get('temperatura', 0)
        nivel_gas = data.get('nivel_gas', 0)
        llama_detectada = data.get('llama_detectada', False)

        umbral_temp = getattr(settings, 'UMBRAL_TEMPERATURA', 60)
        umbral_gas = getattr(settings, 'UMBRAL_GAS', 500)

        if llama_detectada:
            return 'LLAMA_DETECTADA'
        if temperatura > umbral_temp:
            return 'TEMPERATURA_ALTA'
        if nivel_gas > umbral_gas:
            return 'GAS_DETECTADO'
        return 'NORMAL'

    def get_es_alerta(self, obj):
        return obj.es_alerta()


class AlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lectura
        fields = ['id', 'dispositivo', 'temperatura', 'nivel_gas', 'llama_detectada', 'estado_sistema', 'timestamp']
        read_only_fields = ['id', 'timestamp']

