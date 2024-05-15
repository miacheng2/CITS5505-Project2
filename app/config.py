# config.py
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///pagedata.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = False
    DEBUG = False

class TestConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # RAM dataset