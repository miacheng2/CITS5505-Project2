from datetime import datetime
from operator import index
from flask import Flask, redirect, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from config import Config, TestConfig
from models import db, User, Post, Reply,migrate

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pagedata.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#db = SQLAlchemy()
CORS()
login_manager = LoginManager()
jwt = JWTManager()



def create_app(test_config=False):
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
    # app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    # app.config["JWT_COOKIE_SECURE"] = False
    # app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Only do this if you are also using CSRF protection
    jwt.init_app(app)
    


    
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    import routes
    return app



if __name__ == "__main__":
    db.create_all()


