# from app import flaskApp
# from flask import render_template
# @flaskApp.route("/")
# def groups():
#     return render_template('createGroup.html')


from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime






from flask_jwt_extended import JWTManager, jwt_required, create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pagedata.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    authorId = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    content = db.Column(db.String(1000), nullable=False)

    def __repr__(self):
        return f'<Post {self.title}>'
        
class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    authorId = db.Column(db.Integer, nullable=False)
    replyToPostId = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    content = db.Column(db.String(1000), nullable=False)

    def __repr__(self):
        return f'<Reply {self.title}>'
        
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), nullable=False)
    passWord = db.Column(db.String(80), nullable=False)
 
    def __repr__(self):
        return f'<User {self.title}>'
    
@app.cli.command("init_db")
def create_tables():
    db.create_all()
    # Check if the admin user already exists
        # Create a new admin user instance
    new_admin = User(userName='admin', passWord='admin123')
    new_post = Post(title='Testing post', authorId=1, date=datetime.now(), content="This is the testing content")
    new_reply = Reply(title='Testing reply', authorId=1, replyToPostId = 1, date=datetime.now(), content="This is the testing content")
    db.session.add(new_admin)
    db.session.add(new_post)
    db.session.add(new_reply)
    db.session.commit()
    print('Added default admin user')



app.config['SECRET_KEY'] = 'R^F&TUYH&^'
app.config['JWT_SECRET_KEY'] = 'F*GH^*(HIT^T'
# app.config['JWT_TOKEN_LOCATION'] = ['cookies']
# app.config["JWT_COOKIE_SECURE"] = False
# app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Only do this if you are also using CSRF protection
jwt = JWTManager(app)
jwt.init_app(app)
blacklist = set()  #logged out users


login_manager = LoginManager(app)
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    print(User.query.get(user_id).id)
    return User.query.get(user_id)

# class User(UserMixin):
#     @staticmethod
#     def query(user_id):
#         user_database = {
#             "sosAdminUser!@#": {"id": "sosAdminUser!@#", "username": "sosAdminUser!@#", "password": "PaS5W0r6"}
#         }
#         user_info = user_database.get(user_id)
#         if user_info:
#             user = User()
#             user.id = user_info['id']
#             user.password = user_info['password']
#             return user
#         return None

#     def is_authenticated(self):
#         return True

#     def is_active(self):
#         return True

#     def is_anonymous(self):
#         return False
#     def get_id(self):

#         return self.id
    

# @app.route('/submitform', methods=['POST'])
# def send_email():
#     data = request.json
#     print(data)
    
#     msg = Message("Contact Form Submission",
#                   recipients=["webmessage00@gmail.com"],  
#                   body=f"Name: {data['name']}\nEmail: {data['email']}\nPhone: {data['phone']}\nMessage: {data['message']}\nCart Items:")
#     msg.html = f"""
#                 {data['cart']}
#                 """
    
#     mail.send(msg)
    
#     return {"message": "Email sent successfully."}, 200



# @app.route('/register', methods=['POST'])
# def register():
#     username = request.json.get('username', None)
#     password = request.json.get('password', None)

#     if username in users: 
#         return jsonify({"msg": "Username already exists"}), 409

#     users[username] = password
    
#     access_token = create_access_token(identity=username)
#     return jsonify(access_token=access_token), 200
    
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    print("password:", password)
    print("Username:", username)

    user = User.query.filter_by(userName=username).first()

    
    if user == None:
        print("invalid UserName")
        return jsonify({"msg": "invalid UserName"}), 401
    elif user.passWord != password:
        print("Incorrect Password")
        return jsonify({"msg": "Bad password"}), 401
    else:
        access_token = create_access_token(identity=username)
        login_user(user)
        response = jsonify(access_token=access_token)
        set_access_cookies(response, access_token)
        return response, 200

@app.route('/signup', methods=['POST'])
def signup():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    print("password:", password)
    print("Username:", username)

    user = User.query.filter_by(userName=username).first()

    if user == None:
        user = User(userName = username, passWord = password)
        db.session.add(user)
        db.session.commit()
        print("User Created")
        return jsonify({"msg": "User Created"}), 200
    else:
        print("invalid UserName")
        return jsonify({"msg": "Username exist, try another"}), 401
    
@login_required
@app.route('/posts', methods=['GET'])
def posts():
    allPost = Post.query
    returnData = []
    for item in allPost:
        item_data = {'id': item.id, 'title': item.title, 'authorId': item.authorId, 'date': item.date, 'content': item.content}
        returnData.append(item_data)
    return jsonify({"data": returnData})

@login_required
@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"msg": "Logged out"}), 200

# @app.route('/items', methods=['GET'])
# def items():

#     page = int(request.args.get('page', 1))
#     itemsPerPage = int(request.args.get('itemsPerPage', 3))
#     category = request.args.get('category')

#     query = Item.query

#     if category:
#         query = query.filter_by(category=category)

#     items_paginated = query.paginate(page=page, per_page=itemsPerPage, error_out=False)
#     total_pages = items_paginated.pages
#     items = items_paginated.items

#     output = []
#     for item in items:
#         if item.display == "1":
#             item_data = {'id': item.id, 'title': item.title, 'category': item.category, 'image_url': item.image_url, 'main_category': item.mainCategory}
#             output.append(item_data)  

#     return jsonify({'items': output, 'total_pages': total_pages})

# @app.route('/manageitems', methods=['GET'])
# @jwt_required()
# def manageitems():

#     page = int(request.args.get('page', 1))
#     itemsPerPage = int(request.args.get('itemsPerPage', 3))
#     category = request.args.get('category')

#     query = Item.query

#     if category:
#         query = query.filter_by(category=category)

#     items_paginated = query.paginate(page=page, per_page=itemsPerPage, error_out=False)
#     total_pages = items_paginated.pages
#     items = items_paginated.items

#     output = []
#     for item in items:
#         print(item.display)
#         item_data = {'id': item.id, 'title': item.title, 'category': item.category, 'description': item.description, 'display': item.display, 'image_url': item.image_url, 'main_category': item.mainCategory}
#         output.append(item_data)  

#     return jsonify({'items': output, 'total_pages': total_pages})

# @app.route('/items', methods=['POST'])
# @jwt_required()
# def postItems():
#     # token = request.headers["Authorization"].split(" ")[1]
#     # print(token)
#     if request.method == 'POST':
#         item_id = request.form.get('id')
#         item = Item.query.get(item_id)
#         # Save the image file
#         image = request.files.get('image')
#         if image or not item:
#             filename = photos.save(image)
#             image_url = f"/uploads/{filename}"
#         else:
#             image_url = item.image_url

#         # Save the item

#         title = request.form.get('title')
#         category = request.form.get('category')
#         description = request.form.get('description')
#         mainCategory = request.form.get('mainCategory')
#         display = request.form.get('display')
#         new_item = Item(title=title, category=category, description=description, image_url=image_url, display=display, mainCategory=mainCategory)
#         if item:
#             item.title = title
#             item.category = category
#             item.description = description
#             item.image_url = image_url
#             item.mainCategory = mainCategory
#             item.display = display
#             db.session.commit()
#             print ("updated item", new_item.title, "id", item_id, "Description", new_item.description, "Display", new_item.display, "img_url", image_url)
#         else: 
#             db.session.add(new_item)
#             db.session.commit()
#             print ("created item", new_item.title, "id", item_id, "Description", new_item.description, "Display", new_item.display, "img_url", image_url)
#         return jsonify({"message": "Item created"}), 201

# @app.route('/items/<int:item_id>', methods=['DELETE'])
# @jwt_required()
# def delete_item(item_id):
#     # if not check_if_token_in_blacklist(decrypted_token)
#     item = Item.query.get_or_404(item_id)
#     if item:
#         db.session.delete(item)
#         db.session.commit()
#         return jsonify({"message": "Item deleted"}), 201
#     else:
#         return jsonify({"message": "Unable to delete"}), 400

# @app.route('/customitems', methods=['GET'])
# def customitems():
#     page = int(request.args.get('page', 1))
#     itemsPerPage = int(request.args.get('itemsPerPage', 3))
#     category = request.args.get('category')

#     query = Item.query.filter(Item.mainCategory == 'custom-signs')  # Filter by mainCategory before pagination

#     if category:
#         query = query.filter_by(category=category)

#     items_paginated = query.paginate(page=page, per_page=itemsPerPage, error_out=False)
#     total_pages = items_paginated.pages
#     items = items_paginated.items

#     output = []
#     for item in items:
#         item_data = {'id': item.id, 'title': item.title, 'category': item.category, 'description': item.description, 'image_url': item.image_url, 'category': item.category}
#         output.append(item_data)  

#     return jsonify({'items': output, 'total_pages': total_pages})

# @app.route('/customcategories', methods=['GET'])
# def customcategories():
#     categories = db.session.query(Item.category.distinct()).filter(Item.mainCategory == "custom-signs").all()
#     return jsonify([category[0] for category in categories])


# @app.route('/categories', methods=['GET'])
# def categories():
#     categories = db.session.query(Item.category.distinct().label("category")).order_by(Item.category).all()
#     return jsonify([category[0] for category in categories])

# @app.route('/items/<int:item_id>',  methods=['GET', 'POST'])
# def get_item(item_id):
#     item = Item.query.get(item_id)
#     category_display = replace_and_capitalize(item.category)
#     item_data = {'id': item.id, 'title': item.title, 'category': category_display, 'description': item.description, 'image_url': item.image_url, 'mainCategory': item.mainCategory}
#     return jsonify({"item": item_data})


# @app.route('/items/<int:item_id>', methods=['PUT'])
# def update_item(item_id):
#     item = Item.query.get_or_404(item_id)
#     item.data = request.json['data']
#     db.session.commit()
#     return jsonify({'id': item.id, 'data': item.data})

# @app.route('/uploads/<path:filename>', methods=['GET'])
# def serve_image(filename):
#     return send_from_directory('uploads', filename)

# def replace_and_capitalize(input_string):
#     replaced_string = input_string.replace("-", " ")
#     capitalized_string = replaced_string.title()
#     return capitalized_string


if __name__ == "__main__":
    db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=False)