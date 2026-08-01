from database import get_connection
conn=get_connection()
cursor=conn.cursor()
cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'")
row=cursor.fetchall()
conn.commit()
conn.close()
print("Role column added")
