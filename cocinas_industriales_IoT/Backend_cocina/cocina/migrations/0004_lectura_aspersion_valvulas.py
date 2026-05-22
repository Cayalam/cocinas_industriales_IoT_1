from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('cocina', '0003_dispositivo_lectura_fk'),
    ]

    operations = [
        migrations.AddField(
            model_name='lectura',
            name='aspersion_activa',
            field=models.BooleanField(default=False, help_text='Sistema de aspersión activo'),
        ),
        migrations.AddField(
            model_name='lectura',
            name='valvulas_cerradas',
            field=models.BooleanField(default=False, help_text='Válvulas de gas cerradas'),
        ),
        migrations.AddField(
            model_name='lectura',
            name='evacuacion_activa',
            field=models.BooleanField(default=False, help_text='Protocolo de evacuación activo'),
        ),
    ]
