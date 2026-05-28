import sqlite3
p = r"c:\Users\Dani\OneDrive\Documents\uis\micro\cocinas_industriales_IoT\Backend_cocina\db.sqlite3"
conn = sqlite3.connect(p)
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
print('tables=', c.fetchall())
conn.close()
