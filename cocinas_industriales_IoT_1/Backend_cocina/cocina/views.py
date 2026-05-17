from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import Lectura, Dispositivo
from .serializers import (
    LecturaSerializer, AlertaSerializer,
    DispositivoResumenSerializer,
    LoginSerializer, UsuarioSerializer,
)


# ── Auth ──────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login con username/password. Devuelve tokens JWT."""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if not user:
        return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'usuario': UsuarioSerializer(user).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Invalida el refresh token."""
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
    except Exception:
        pass
    return Response({'mensaje': 'Sesion cerrada'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_view(request):
    """Devuelve datos del usuario autenticado y sus dispositivos."""
    return Response(UsuarioSerializer(request.user).data)


# ── Dispositivos ──────────────────────────────────────────────────────────────

class DispositivoViewSet(viewsets.ReadOnlyModelViewSet):
    """Lista y detalle de dispositivos a los que el usuario tiene acceso."""
    permission_classes = [IsAuthenticated]
    serializer_class = DispositivoResumenSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Dispositivo.objects.all()
        return user.dispositivos.filter(activo=True)

    @action(detail=True, methods=['get'])
    def lecturas(self, request, pk=None):
        """Ultimas N lecturas de un dispositivo especifico."""
        dispositivo = self.get_object()
        limit = int(request.query_params.get('limit', 100))
        lecturas = dispositivo.lecturas.all()[:limit]
        serializer = LecturaSerializer(lecturas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def ultima(self, request, pk=None):
        """Ultima lectura de un dispositivo especifico."""
        dispositivo = self.get_object()
        try:
            lectura = dispositivo.lecturas.latest('timestamp')
            return Response(LecturaSerializer(lectura).data)
        except Lectura.DoesNotExist:
            return Response({'detalle': 'Sin lecturas aun'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def alertas(self, request, pk=None):
        """Alertas de un dispositivo especifico."""
        dispositivo = self.get_object()
        alertas = dispositivo.lecturas.filter(~Q(estado_sistema='NORMAL'))
        tipo = request.query_params.get('tipo')
        if tipo:
            alertas = alertas.filter(estado_sistema=tipo)
        return Response(AlertaSerializer(alertas, many=True).data)

    @action(detail=True, methods=['get'])
    def resumen(self, request, pk=None):
        """Resumen estadistico de un dispositivo."""
        dispositivo = self.get_object()
        try:
            ultima = dispositivo.lecturas.latest('timestamp')
            return Response({
                'dispositivo': DispositivoResumenSerializer(dispositivo).data,
                'estado_actual': ultima.estado_sistema,
                'temperatura': ultima.temperatura,
                'nivel_gas': ultima.nivel_gas,
                'presion': float(ultima.presion),
                'llama_detectada': ultima.llama_detectada,
                'ventiladores': {
                    'extraccion': ultima.ventilador_extraccion,
                    'inyeccion_1': ultima.ventilador_inyeccion_1,
                    'inyeccion_2': ultima.ventilador_inyeccion_2,
                },
                'timestamp': ultima.timestamp,
                'total_lecturas': dispositivo.lecturas.count(),
                'total_alertas': dispositivo.lecturas.filter(~Q(estado_sistema='NORMAL')).count(),
            })
        except Lectura.DoesNotExist:
            return Response({'detalle': 'Sin datos disponibles'}, status=status.HTTP_404_NOT_FOUND)


# ── Ingesta desde ESP32 ───────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def ingestar_lectura(request):
    """Endpoint exclusivo para el ESP32.
    Autenticacion por X-API-Key en el header."""
    api_key = request.headers.get('X-API-Key', '')
    if not api_key:
        return Response({'error': 'Header X-API-Key requerido'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        dispositivo = Dispositivo.objects.get(api_key=api_key, activo=True)
    except Dispositivo.DoesNotExist:
        return Response({'error': 'API key invalida o dispositivo inactivo'}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data.copy()
    data['dispositivo'] = dispositivo.id

    serializer = LecturaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
