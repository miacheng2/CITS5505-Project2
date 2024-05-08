from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from config import Config, TestConfig
from models import db, User, Post, Reply

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pagedata.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#db = SQLAlchemy()

def create_app(test_config=False):
    app = Flask(__name__)
    CORS(app)
    if test_config:
        app.config.from_object(TestConfig)
    else:
        app.config.from_object(Config)
    db.init_app(app)



    app.config['SECRET_KEY'] = '^&GU_&*UY'
    app.config['JWT_SECRET_KEY'] = '%D^FTY_$%^R'
    # app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    # app.config["JWT_COOKIE_SECURE"] = False
    # app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Only do this if you are also using CSRF protection
    jwt = JWTManager(app)
    jwt.init_app(app)
    blacklist = set()  #logged out users


    login_manager = LoginManager(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    @app.route('/', methods=['GET'])
    @app.route('/index', methods=['GET'])
    def testMsg():
        return render_template('index.html')


    @login_manager.user_loader
    def load_user(user_id):
        print(User.query.get(user_id).id)
        return User.query.get(user_id)
    
    @app.route('/login', methods=['POST', 'GET'])
    def login():
        if request.method == 'POST':
            username = request.json.get('username', None)
            password = request.json.get('password', None)
            user = User.query.filter_by(userName=username).first()
            print("password:", password)
            print("Username:", username)

            if user == None:
                print("invalid UserName")
                return jsonify({"msg": "invalid UserName"}), 401
            elif user.passWord != password:
                print("Incorrect Password")
                return jsonify({"msg": "Bad password"}), 401
            else:
                access_token = create_access_token(identity=username)
                login_user(user)
                response = jsonify(access_token=access_token, userName=username, userId=user.id)
                set_access_cookies(response, access_token)
                return response, 200
        else:
            return render_template('login.html')

    @app.route('/signup', methods=['POST', 'GET'])
    def signup():
        if request.method == 'POST':
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
        else:
            return render_template('signup.html')



    @app.route('/logout',  methods=['POST'])
    @jwt_required()
    def logout():
            jti = get_token()
            print(jti)
            blacklist.add(jti)
            return jsonify({'msg': 'Logged out'}), 200

    @app.route('/logout', methods=['GET'])
    def show_logout():
        return render_template('logout.html')
       


    def check_if_token_in_blacklist(decrypted_token):
        jti = decrypted_token['jti']
        if jti in blacklist:
            return True
        else:
            return False
        

# Get post and reply data return to front-end
    @app.route('/getPosts', methods=['GET'])
    @jwt_required()
    def getPosts():
        allPost = Post.query
        returnData = []
        for post in allPost:
            replysForCurrentPost = Reply.query.filter_by(replyToPostId=post.id).order_by(Reply.date).all()
            replyData = []
            for reply in replysForCurrentPost:
                reply_author = User.query.filter_by(id=reply.authorId).first()
                reply_data = {'id': reply.id, 'title': reply.title, 'authorName': reply_author.userName, 'date': reply.date, 'content': reply.content, "replyToPostId": reply.replyToPostId}
                replyData.append(reply_data)
            post_author = User.query.filter_by(id=post.authorId).first()
            post_data = {'id': post.id, 'title': post.title, 'authorName': post_author.userName, 'date': post.date, 'content': post.content, "replyData": replyData}
            returnData.append(post_data)
        
        return jsonify({"post": returnData}), 200 
# postPost Function - Creating a New Post
    @app.route('/postPost', methods=['POST'])
    @jwt_required()
    def postPost():
        title = request.json.get('title', None)
        authorId = request.json.get('authorId', None)
        date = datetime.now()
        content = request.json.get('content', None)

        print("Author is: ", authorId, "\nContent is: ", content, "\n Time is:", date)
        new_post = Post(title=title, authorId=authorId, date=date, content=content)
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'msg': 'Post Posted!'}), 200


    @app.route('/postReply', methods=['POST'])
    @jwt_required()
    def postReply():
        title = ""
        authorId = request.json.get('authorId', None)
        replyToPostId = request.json.get('replyToPostId', None)
        date = datetime.now()
        content = request.json.get('content', None)

        print("Author is: ", authorId, "\nContent is: ", content, "\n Time is:", date, "\nReplying to post: ", replyToPostId)
        new_reply = Reply(title=title, authorId=authorId, replyToPostId =replyToPostId, date=date, content=content)
        db.session.add(new_reply)
        db.session.commit()
        return jsonify({'msg': 'Reply Posted!'}), 200



    @app.cli.command("init_db") 
    def create_tables():
        db.create_all()
        new_admin = User(userName='admin', passWord='admin123')
        new_post = Post(title='Testing post', authorId=1, date=datetime.now(), content="This is the testing content")
        new_reply = Reply(title='Testing reply', authorId=1, replyToPostId = 1, date=datetime.now(), content="This is the testing content")
        db.session.add(new_admin)
        db.session.add(new_post)
        db.session.add(new_reply)
        db.session.commit()
        print('Added default admin user')

    @app.route('/profile', methods=['GET'])
    def get_profile():
        return render_template('profile.html')

    def get_token():
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(" ")[1]  # Get the token part after 'Bearer'
        return None
    return app



if __name__ == "__main__":
    db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=False)
