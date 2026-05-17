from django.contrib import admin
from .models import Dispositivo, Lectura


@admin.register(Dispositivo)
class DispositivoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'codigo', 'ubicacion', 'activo', 'fecha_registro']
    list_filter = ['activo']
    search_fields = ['nombre', 'codigo']
    filter_horizontal = ['usuarios']
    readonly_fields = ['fecha_registro']


@admin.register(Lectura)
class LecturaAdmin(admin.ModelAdmin):
    list_display = ['dispositivo', 'temperatura', 'nivel_gas', 'estado_sistema', 'timestamp']
    list_filter = ['estado_sistema', 'dispositivo']
    search_fields = ['dispositivo__codigo', 'dispositivo__nombre']
    readonly_fields = ['timestamp']
