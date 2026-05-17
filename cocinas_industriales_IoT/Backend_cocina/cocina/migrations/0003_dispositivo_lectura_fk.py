from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cocina', '0002_lectura_presion'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # 1. Crear el modelo Dispositivo
        migrations.CreateModel(
            name='Dispositivo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(help_text="Nombre descriptivo, ej: 'Cocina Planta 1'", max_length=100)),
                ('codigo', models.CharField(help_text="Identificador único del ESP32, ej: 'ESP32-A1'", max_length=50, unique=True)),
                ('api_key', models.CharField(help_text='Clave secreta que usa el ESP32 para autenticarse', max_length=64, unique=True)),
                ('ubicacion', models.CharField(blank=True, help_text='Descripción física de dónde está instalado', max_length=200)),
                ('activo', models.BooleanField(default=True, help_text='Si está en False, el dispositivo no puede enviar datos')),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('usuarios', models.ManyToManyField(
                    blank=True,
                    help_text='Usuarios con acceso a ver este dispositivo',
                    related_name='dispositivos',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'verbose_name': 'Dispositivo ESP32',
                'verbose_name_plural': 'Dispositivos ESP32',
                'ordering': ['nombre'],
            },
        ),

        # 2. Crear un dispositivo por defecto para las lecturas existentes (NULL temporal)
        migrations.AddField(
            model_name='lectura',
            name='dispositivo',
            field=models.ForeignKey(
                null=True,
                blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='lecturas',
                to='cocina.dispositivo',
                help_text='ESP32 que originó esta lectura',
            ),
        ),

        # 3. Agregar índice compuesto dispositivo + timestamp
        migrations.AddIndex(
            model_name='lectura',
            index=models.Index(fields=['dispositivo', '-timestamp'], name='idx_dispositivo_timestamp'),
        ),
    ]
