from flask import Blueprint, render_template
from datetime import datetime
from operator import index
from flask import Flask, redirect, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from .models import db, User, Post, Reply,migrate
from app import login_manager
from app import jwt

app = Blueprint('main', __name__)

blacklist = set()  #logged out users

@app.route('/', methods=['GET'])
def welcome():
    return render_template('welcome.html')

@app.route('/index', methods=['GET'])
#@app.route('/login', methods=['POST'])
def index_route():
    return render_template('index.html')
    #return jsonify({"msg": "testing"}), 200


@app.route('/login', methods=['POST','GET'])
def login():
    if request.method == "POST":
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        user = db.session.query(User).filter_by(userName=username).first()

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

@app.route('/signup', methods=['POST','GET'])
def signup():
    if request.method == "POST":
        username = request.json.get('username', None)
        password = request.json.get('password', None)

        user = db.session.query(User).filter_by(userName=username).first()

        if user == None:
            user = User(userName = username, passWord = password)
            db.session.add(user)
            db.session.commit()
            return jsonify({"msg": "User Created"}), 200
        else:
            return jsonify({"msg": "Username exist, try another"}), 401
    else:
        return render_template('signup.html')


@app.route('/logout',  methods=['GET'])
@jwt_required()
def logout():
    jti = get_token()
    print(jti)
    blacklist.add(jti)
    return render_template('index.html'), 200

def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    if jti in blacklist:
        return True
    else:
        return False
    
@app.route('/profile', methods=['GET'])
def get_profile():
    return render_template('profile.html')

# Get post and reply data return to front-end
@app.route('/getPosts', methods=['GET'])
@jwt_required()
def getPosts():

    allPost = db.session.query(Post)
    returnData = []
    for post in allPost:
        replysForCurrentPost = db.session.query(Reply).filter_by(replyToPostId=post.id).order_by(Reply.date).all()
        replyData = []
        for reply in replysForCurrentPost:
            reply_author = db.session.query(User).filter_by(id=reply.authorId).first()
            reply_data = {'id': reply.id, 'title': reply.title, 'authorName': reply_author.userName, 'date': reply.date, 'content': reply.content, "replyToPostId": reply.replyToPostId}
            replyData.append(reply_data)
        post_author = db.session.query(User).filter_by(id=post.authorId).first()
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

    if not title or title.strip() == "":
        return jsonify({"error": "Title is required and cannot be empty."}), 400
    if not authorId:
        return jsonify({"error": "Author ID is required."}), 400
    if not content or content.strip() == "":
        return jsonify({"error": "Content is required and cannot be empty."}), 400

    print("Author is: ", authorId, "\nContent is: ", content, "\n Time is:", date)
    new_post = Post(title=title, authorId=authorId, date=date, content=content)
    db.session.add(new_post)
    db.session.commit()
    print(new_post.content)
    return jsonify({'msg': 'Post Posted!'}), 200


@app.route('/postReply', methods=['POST'])
@jwt_required()
def postReply():
    title = ""
    authorId = request.json.get('authorId', None)
    replyToPostId = request.json.get('replyToPostId', None)
    date = datetime.now()
    content = request.json.get('content', None)

    if not replyToPostId:
        return jsonify({"error": "ReplyToPostId is required and cannot be empty."}), 400
    if not authorId:
        return jsonify({"error": "Author ID is required."}), 400
    if not content or content.strip() == "":
        return jsonify({"error": "Content is required and cannot be empty."}), 400

    print("Author is: ", authorId, "\nContent is: ", content, "\n Time is:", date, "\nReplying to post: ", replyToPostId)
    new_reply = Reply(title=title, authorId=authorId, replyToPostId =replyToPostId, date=date, content=content)
    db.session.add(new_reply)
    db.session.commit()
    return jsonify({'msg': 'Reply Posted!'}), 200


@app.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):

    current_user = get_jwt_identity()
    post = db.session.query(Post).filter_by(id=post_id).first()

    if post is None:
        return jsonify({'msg': 'Post not found'}), 404

    if db.session.query(User).filter_by(id=post.authorId).first().userName != current_user and current_user != 'admin':
        return jsonify({'msg': 'Unauthorized'}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({'msg': 'Post deleted'}), 200

@app.route('/replies/<int:reply_id>', methods=['DELETE'])
@jwt_required()
def delete_reply(reply_id):
    current_user = get_jwt_identity()
    reply = db.session.query(Reply).filter_by(id=reply_id).first()

    if reply is None:
        return jsonify({'msg': 'Reply not found'}), 404
    if db.session.query(User).filter_by(id=reply.authorId).first().userName != current_user and current_user != 'admin':
        return jsonify({'msg': 'Unauthorized'}), 403

    db.session.delete(reply)
    db.session.commit()
    return jsonify({'msg': 'Reply deleted'}), 200

def get_token():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(" ")[1]  # Get the token part after 'Bearer'
    return None

