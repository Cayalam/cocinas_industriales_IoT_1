from django.db import models
from django.contrib.auth.models import User


class Dispositivo(models.Model):
    """Representa un ESP32 registrado en el sistema.
    Diseñado para escalar a múltiples dispositivos."""

    nombre = models.CharField(max_length=100, help_text="Nombre descriptivo, ej: 'Cocina Planta 1'")
    codigo = models.CharField(max_length=50, unique=True, help_text="Identificador único del ESP32, ej: 'ESP32-A1'")
    api_key = models.CharField(max_length=64, unique=True, help_text="Clave secreta que usa el ESP32 para autenticarse")
    ubicacion = models.CharField(max_length=200, blank=True, help_text="Descripción física de dónde está instalado")
    activo = models.BooleanField(default=True, help_text="Si está en False, el dispositivo no puede enviar datos")
    fecha_registro = models.DateTimeField(auto_now_add=True)
    usuarios = models.ManyToManyField(
        User,
        related_name='dispositivos',
        blank=True,
        help_text="Usuarios con acceso a ver este dispositivo"
    )

    class Meta:
        ordering = ['nombre']
        verbose_name = "Dispositivo ESP32"
        verbose_name_plural = "Dispositivos ESP32"

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"


class Lectura(models.Model):
    """Lectura de sensores enviada por un ESP32.
    Siempre vinculada a un Dispositivo específico."""

    ESTADO_CHOICES = [
        ('NORMAL', 'Normal'),
        ('GAS_DETECTADO', 'Gas Detectado'),
        ('TEMPERATURA_ALTA', 'Temperatura Alta'),
        ('LLAMA_DETECTADA', 'Llama Detectada'),
        ('EMERGENCIA', 'Emergencia'),
    ]

    # Relación con el dispositivo que envió esta lectura
    dispositivo = models.ForeignKey(
        Dispositivo,
        on_delete=models.CASCADE,
        related_name='lecturas',
        help_text="ESP32 que originó esta lectura"
    )

    # Datos de sensores
    temperatura = models.FloatField(help_text="Temperatura en °C")
    nivel_gas = models.IntegerField(help_text="Nivel de gas (0-1023)")
    presion = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Presión en hPa")
    llama_detectada = models.BooleanField(default=False)

    # Estados de ventiladores
    ventilador_extraccion = models.BooleanField(default=False)
    ventilador_inyeccion_1 = models.BooleanField(default=False)
    ventilador_inyeccion_2 = models.BooleanField(default=False)

    # Actuadores de emergencia
    aspersion_activa = models.BooleanField(default=False, help_text="Sistema de aspersión activo")
    valvulas_cerradas = models.BooleanField(default=False, help_text="Válvulas de gas cerradas")
    evacuacion_activa = models.BooleanField(default=False, help_text="Protocolo de evacuación activo")

    # Estado calculado del sistema
    estado_sistema = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='NORMAL')

    # Timestamp indexado para queries rápidas
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Lecturas"
        indexes = [
            models.Index(fields=['dispositivo', '-timestamp'], name='idx_dispositivo_timestamp'),
        ]

    def __str__(self):
        return f"[{self.dispositivo.codigo}] {self.timestamp} - {self.estado_sistema}"

    def es_alerta(self):
        return self.estado_sistema != 'NORMAL'
