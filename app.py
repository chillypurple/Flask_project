
import os
import sys
from flask import Flask,request,session
from flask import Flask,jsonify,render_template,redirect,url_for
import sqlite3
from database import get_connection
from werkzeug.security import generate_password_hash,check_password_hash
from flask import flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

def validate_password(password):
     if len(password)<8:
          return False,"Password must be at least 8 characters."
     if not any(ch.isdigit()
                for ch in password):
              return False,"Password must contain at least one number"    
     special_char="?_-*&^%$#@!+=~;"
     if not any(ch in special_char
                for ch in password):
              return False,"Password must contain at least one special characters"
     if not any(ch.isupper()
                for ch in password):
              return False,"Password must contain at least one uppercase letter" 
     return True,""
app =Flask(__name__)
BASE_DIR=os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///"+os.path.join(BASE_DIR,"app.db")
db=SQLAlchemy(app)

class User(db.Model):
     __tablename__="users"
     id=db.Column(db.Integer,primary_key=True)
     username=db.Column(db.String(100),nullable=False,unique=True)
     password=db.Column(db.String(255),nullable=False)
     phone=db.Column(db.String(20))
     role=db.Column(db.String(50),default="user")
with app.app_context():
     db.create_all()

class Contact(db.Model):
     __tablename__="contacts"
     id=db.Column(db.Integer,primary_key=True)
     name=db.Column(db.String(100),nullable=False,unique=True)
     phone=db.Column(db.String(20),nullable=False)
     user_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
with app.app_context():
     db.create_all()

app.secret_key="123456789"
def validate_username(username):
     conn=get_connection()
     cursor=conn.cursor()
     cursor.execute("SELECT * FROM users WHERE username=?",(username,))
     user_exists=cursor.fetchone()
     conn.close()
     if user_exists:     
          return  False,"Username already exists."
     return True,""                     
     


def init_db():
     conn=get_connection()
     cursor=conn.cursor()
     cursor.execute("""CREATE TABLE IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, phone TEXT)""")
     

     
     
     cursor.execute("""CREATE TABLE IF NOT EXISTS contacts 
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,phone TEXT)""")
     
     cursor.execute("""CREATE TABLE IF NOT EXISTS contacts_new 
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL, name TEXT NOT NULL,phone TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id))""")
     
     
     
     conn.commit()
     conn.close()

init_db()

@app.route("/")
def home():
     return redirect(url_for("login"))

@app.route("/test")
def test():
     contacts=Contact.query.all()
     print(type(contacts))
     print(contacts[0].name)
     print(contacts[0].user_id)
     return "ok"
     
     
     

     




@app.route("/delete",methods=["POST"])
def delete_user():
     data=request.get_json()
     user_id=data["id"]
     conn=get_connection()
     cursor=conn.cursor()
     cursor.execute("DELETE FROM contacts WHERE id=?",(user_id,))
     conn.commit()
     return jsonify({"status":"OK"})
     

@app.route("/search",methods=["POST"])
def search():
     data=request.get_json()
     user_id=session["user_id"]
     searchName=data["searchName"]
     print(searchName)
     contacts=Contact.query.filter_by(user_id=user_id,name=searchName).all()
     contacts_data=[]
     for contact in contacts:
          contacts_data.append({
               "id":contact.id,
               "name":contact.name,
               "phone":contact.phone,
               "user_id":contact.user_id
               })
     return jsonify(contacts_data)



     

     
     
@app.route("/register",methods=["POST"])
def Register():
     data=request.get_json()
     username=data["username"]
     password=data["password"]
     password_hash=generate_password_hash(password)
     phone=data["phone"]
     if not username or not password:
          return jsonify({
               "success":False,
               "message":
                    "Username and Password are required."
                    })
      
     
     User.query.filter_by(username=username).first()
     is_valid,message=validate_username(username)
     if not is_valid:
          return jsonify({"success":False,"message":message})
     
     is_valid,message =validate_password(password)
     if not is_valid:
          return jsonify({"success":False,"message":message})
     new_user=User(username=username,password=password_hash,phone=phone,role="user")
     db.session.add(new_user)
     db.session.commit()
     return jsonify({"success":True,
                     "message":"User registered successfully."
                     })



@app.route("/register")
def register():
     return render_template("register.html")


@app.route("/login",methods=["POST"])
def Login():
     username=request.form["username"]
     password=request.form["password"]
     user_exists=User.query.filter_by(username=username).first()
     
     if not user_exists:
          return "User not found"
     elif  not check_password_hash(user_exists.password,password):
          return "password is wrong"
     session["username"]=user_exists.username
     session["user_id"]=user_exists.id
     session["role"]=user_exists.role
     if session.get("role")=="admin":
          print(session)
          flash("WelCome"+username)
          return redirect(url_for("Admin"))
     else:
          return redirect(url_for("my_contact"))

          
               
                    
@app.route("/login")
def login():
     return render_template("login.html")

@app.route("/my_contact")
def my_contact():
     if not "username"in session:
          return redirect(url_for("login"))
     return render_template("my_contact.html")


@app.route("/AddContact",methods=["POST"])
def AddContact():
     data=request.get_json()
     name=data["name"]
     phone=data["phone"]
     user_id=session["user_id"]
     new_contact=Contact(name=name,phone=phone,user_id=user_id)
     db.session.add(new_contact)
     db.session.commit()
     print(request.data)
     return jsonify({"success":True,
                     "message":"Contact saved successfully"})
    

@app.route("/ShowContacts")
def ShowContacts():
     user_id=session["user_id"]
     print(session)
     contacts=Contact.query.filter_by(user_id=user_id).all()
     contacts_data=[]
     for contact in contacts:
         contacts_data.append({
          "id":contact.id,
          "name":contact.name,
          "user_id":contact.user_id,
          "phone":contact.phone})
     return jsonify(contacts_data)

@app.route("/DeleteContact",methods=["POST"])
def contact_delete():
     data=request.get_json()
     id=data["id"]
     contact=Contact.query.filter_by(id=id).first()
     db.session.delete(contact)
     db.session.commit()
     return jsonify({"message": "آیا مخاطب حذف شود؟"})


@app.route("/UpdateContact",methods=["POST"])
def contact_update():
     data=request.get_json()
     selectedid=data["id"]
     name=data["name"]
     phone=data["phone"]
     contact=Contact.query.filter_by(id=selectedid).first()
     contact.name=name
     contact.phone=phone
     db.session.commit()
     return jsonify({"name":name,"phone":phone})


@app.route("/profile")
def profile():
     if  not "username" in session:
          return redirect(url_for("login"))
     return render_template("my_contact.html")

@app.route("/logout",methods=["POST"])
def logout():
     session.clear()
     flash("Exit is Successfully")
     return redirect(url_for("login"))


@app.route("/admin/users")
def Admin_users():
     users=User.query.all()
     users_data=[]
     for user in users:
          users_data.append({
               "id":user.id,
               "username":user.username,
               "phone":user.phone,
               "role":user.role
          })
     return jsonify(users_data)

@app.route("/admin")
def Admin():
     if session.get("role")=="admin":
        return render_template("Admin_users.html")
     else:
          return redirect(url_for("login"))


@app.route("/admin/contacts/<int:user_id>")
def admin_contacts(user_id):
     user=User.query.get_or_404(user_id)
     contacts=Contact.query.filter_by(user_id=user_id).all()
     
     return render_template("Admin_contacts.html",user=user,contacts=contacts)







if __name__=='__main__':
     app.run(debug=True)
