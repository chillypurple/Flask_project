cursor.execute("""CREATE TABLE IF NOT EXISTS contacts_new 
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL, name TEXT NOT NULL,phone TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id))""")

cursor.execute("INSERT INTO contacts_new(user_id,name,phone) SELECT 1,name,phone FROM contacts")
     
     cursor.execute("DROP TABLE contacts")
     cursor.execute("ALTER TABLE contacts_new RENAME TO contacts")