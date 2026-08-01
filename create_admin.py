from app import app,db,User
from werkzeug.security import generate_password_hash
with app.app_context():
    admin_exists=User.query.filter_by(username="Mehrdad").first()
    if admin_exists:
        print("Admin already exists")
    else:
        admin=User(
            username="Mehrdad",
            password=generate_password_hash("Baz Sho Sisini"),
            phone="09010431063",
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin created Successfully")
