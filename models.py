# models.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
#from app import db

db = SQLAlchemy()

class Post(db.Model):
        __table_args__ = {'extend_existing': True}
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(80), nullable=False)
        authorId = db.Column(db.Integer, nullable=False)
        date = db.Column(db.DateTime, nullable=False)
        content = db.Column(db.String(1000), nullable=False)

        def __repr__(self):
            return f'<Post {self.title}>'

class Reply(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    authorId = db.Column(db.Integer, nullable=False)
    replyToPostId = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    content = db.Column(db.String(1000), nullable=False)

    def __repr__(self):
        return f'<Reply {self.title}>'

class User(db.Model, UserMixin):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), nullable=False)
    passWord = db.Column(db.String(80), nullable=False)
    def __repr__(self):
        return f'<User {self.userName}>'
    