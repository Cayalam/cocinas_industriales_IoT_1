import sqlite3
p = r"c:\Users\Dani\OneDrive\Documents\uis\micro\cocinas_industriales_IoT\Backend_cocina\db.sqlite3"
conn = sqlite3.connect(p)
c = conn.cursor()
c.execute("SELECT id, codigo, api_key, activo FROM cocina_dispositivo")
for r in c.fetchall():
    print(r)
conn.close()
