import sqlite3
p = r"c:\Users\Dani\OneDrive\Documents\uis\micro\cocinas_industriales_IoT\Backend_cocina\db.sqlite3"
conn = sqlite3.connect(p)
c = conn.cursor()
# seleccionar últimas lecturas
c.execute("SELECT id, temperatura, nivel_gas, presion, llama_detectada, timestamp FROM cocina_lectura ORDER BY timestamp DESC LIMIT 5")
rows = c.fetchall()
for r in rows:
    print(r)
conn.close()
