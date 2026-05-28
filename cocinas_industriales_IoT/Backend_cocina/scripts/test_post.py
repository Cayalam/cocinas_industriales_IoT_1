import json, urllib.request
url = 'http://127.0.0.1:8000/api/ingesta/'
data = {
    'temperatura': 30.5,
    'nivel_gas': 500,
    'presion': 1013.25,
    'llama_detectada': False,
    'ventilador_extraccion': True,
    'ventilador_inyeccion_1': False,
    'ventilador_inyeccion_2': False,
    'estado_sistema': 'NORMAL'
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type':'application/json','X-API-Key':'clave-esp32-cocina-001'})
try:
    with urllib.request.urlopen(req) as resp:
        print('status', resp.getcode())
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('status', e.code)
    print(e.read().decode())
