import sqlite3
p = r"c:\Users\Dani\OneDrive\Documents\uis\micro\cocinas_industriales_IoT\Backend_cocina\db.sqlite3"
conn = sqlite3.connect(p)
c = conn.cursor()
c.execute("SELECT id, temperatura, nivel_gas, presion, llama_detectada, timestamp FROM cocina_lectura WHERE id=?", (1925,))
print(c.fetchone())
conn.close()
