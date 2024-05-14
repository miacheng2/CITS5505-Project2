import unittest, json
from app import create_app, db
from models import User

class AuthTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()

        db.create_all()

        self.test_user1 = User(userName='testuser1', passWord='password1')
        self.test_user2 = User(userName='testuser2', passWord='password2')
        db.session.add(self.test_user1)
        db.session.add(self.test_user2)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_login_valid(self):
        data = {'username': 'testuser1', 'password': 'password1'}
        response = self.client.post('/login', json=data)
        self.assertEqual(response.status_code, 200)

    def test_login_invalid_username(self):
        data = {'username': 'invaliduser', 'password': 'password1'}
        response = self.client.post('/login', json=data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['msg'], 'invalid UserName')

    def test_login_invalid_password(self):
        data = {'username': 'testuser1', 'password': 'wrongpassword'}
        response = self.client.post('/login', json=data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['msg'], 'Bad password')
    
    def test_signup_valid(self):
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post('/signup', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['msg'], 'User Created')

    def test_signup_existing_user(self):
        data = {'username': 'testuser1', 'password': 'password1'}
        response = self.client.post('/signup', json=data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['msg'], 'Username exist, try another')

    #new logic required: no access without login
    def test_protected_routes_not_logged_in(self):
        response = self.client.get('/index')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data)['msg'], 'You need to login first')
        
        response = self.client.get('/profile')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.data)['msg'], 'You need to login first')
