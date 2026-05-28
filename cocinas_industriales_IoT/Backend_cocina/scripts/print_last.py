import os
# Asegurar que estamos en la raíz del proyecto para importar settings
os.chdir(os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from cocina.models import Lectura

# Obtener última lectura
l = Lectura.objects.order_by('-timestamp').first()
if not l:
    print('No hay lecturas almacenadas')
else:
    print('temperatura=', l.temperatura)
    print('nivel_gas=', l.nivel_gas)
    print('presion=', float(l.presion))
    print('timestamp=', l.timestamp)
