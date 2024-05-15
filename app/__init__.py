from datetime import datetime
from operator import index
from flask import Flask, redirect, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from .config import Config, TestConfig
import os
from .models import db, User, Post, Reply,migrate

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pagedata.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#db = SQLAlchemy()
CORS()
login_manager = LoginManager()
jwt = JWTManager()
   
def create_app(test_config=False):
    test_config = os.getenv('FLASK_TEST_CONFIG', 'False') == 'True'  ##configure the test_flag for testing
    app = Flask(__name__)
    CORS(app)
    if test_config:
        app.config.from_object(TestConfig)
        
    else:
        app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)

    app.config['SECRET_KEY'] = '^&GU_&*UY'
    app.config['JWT_SECRET_KEY'] = '%D^FTY_$%^R'
    jwt.init_app(app)
    
    login_manager.init_app(app)
    login_manager.login_view = 'app.login'
    
    @login_manager.user_loader
    def load_user(user_id):
        print(db.session.get(User,user_id).id)
        
        return db.session.get(User,user_id)
    
    from .routes import app as main_blueprint
    app.register_blueprint(main_blueprint)

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
        print('Added default admin user, added temp post with a reply')


    return app