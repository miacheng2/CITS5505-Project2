import pytest
from app import create_app
from app.models import db, User, Post, Reply
from app.config import TestConfig


@pytest.fixture
def client():
    app = create_app(test_config=True)
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            test_user = User(userName='123', passWord='123')
            test_user2 = User(userName='admin', passWord='admin')
            db.session.add(test_user)
            db.session.add(test_user2)
            db.session.commit()


        yield client
        with app.app_context():
            db.drop_all()

def test_getTestingMsg(client):
    response = client.get('/')
    assert response.status_code == 200


def test_signup_user(client):

    response = client.post("/signup", json={
        "username": "1234", 
        "password": "1234"
    }
    )
    assert response.status_code == 200

def test_signup_with_duplicated_user(client):

    response = client.post("/signup", json={
        "username": "123", 
        "password": "123"
    }
    )
    assert response.status_code == 401

def test_login_user(client):

    response = client.post("/login", json={
        "username": "123", 
        "password": "123"
    }
    )
    assert response.status_code == 200



def test_logout_user(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.get("/logout", headers=header)
    assert response.status_code == 200

def test_access_post_with_JWT(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.get("/getPosts", headers=header)
    assert response.status_code == 200

def test_access_post_without_JWT(client):
    response = client.get("/getPosts")
    assert response.status_code == 401

def test_send_post_with_JWT_with_wrong_data(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.post("/postPost", headers=header, json={
        "username": "123", 
        "password": "123"
    })
    assert response.status_code == 400

def test_send_post_with_JWT_with_correct_data(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.post("/postPost", headers=header, json={
        "title": "Testing title", 
        "authorId": "1",
        "content": "Testing content"
    })
    assert response.status_code == 200

def test_send_post_without_JWT(client):
    response = client.post("/postPost")
    assert response.status_code == 401

def test_send_reply_with_JWT_with_wrong_data(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.post("/postReply", headers=header, json={
        "username": "123", 
        "password": "123"
    })
    assert response.status_code == 400

def test_send_reply_with_JWT_with_correct_data(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.post("/postReply", headers=header, json={
        "replyToPostId": "1", 
        "authorId": "1",
        "content": "Testing reply"
    })
    assert response.status_code == 200

def test_send_reply_without_JWT(client):
    response = client.post("/postReply")
    assert response.status_code == 401

def test_delete_post_with_JWT(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    client.post("/postPost", headers=header, json={
        "title": "Testing Title", 
        "authorId": "1",
        "content": "Testing content"
    })
    response = client.delete("/posts/1", headers=header)
    assert response.status_code == 200

def test_delete_post_with_AdminJWT(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    client.post("/postPost", headers=header, json={
        "title": "Testing Title", 
        "authorId": "1",
        "content": "Testing content"
    })
    client.get("/logout", headers=header)
    return_data = client.post("/login", json={
        "username": "admin", 
        "password": "admin"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.delete("/posts/1", headers=header)
    assert response.status_code == 200

def test_delete_post_without_JWT(client):
    response = client.delete("/posts/1")
    assert response.status_code == 401

def test_delete_reply_with_JWT(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    client.post("/postPost", headers=header, json={
        "title": "Testing Title", 
        "authorId": "1",
        "content": "Testing content"
    })
    client.post("/postReply", headers=header, json={
        "replyToPostId": "1", 
        "authorId": "1",
        "content": "Testing reply"
    })
    response = client.delete("/replies/1", headers=header)
    assert response.status_code == 200

def test_delete_reply_with_AdminJWT(client):
    return_data = client.post("/login", json={
        "username": "123", 
        "password": "123"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    client.post("/postPost", headers=header, json={
        "title": "Testing Title", 
        "authorId": "1",
        "content": "Testing content"
    })
    client.post("/postReply", headers=header, json={
        "replyToPostId": "1", 
        "authorId": "1",
        "content": "Testing reply"
    })
    client.get("/logout", headers=header)
    return_data = client.post("/login", json={
        "username": "admin", 
        "password": "admin"
    })
    data = return_data.get_json()
    jwt_token = data['access_token']
    header = {
        'Authorization':'Bearer '+jwt_token,
        'Content-Type': 'application/json'
    }
    response = client.delete("/replies/1", headers=header)
    assert response.status_code == 200

def test_delete_reply_without_JWT(client):
    response = client.delete("/replies/1")
    assert response.status_code == 401





# def test_logout_user_noJWT(client):
#     response = client.post("/logout")
#     assert response.status_code == 401

# def test_get_post_no_JWT(client):
#     response = client.get('/getPosts')
#     assert response.status_code == 200


# def test_postPost(client):
#     login_response = client.post("/login", json={
#         "username": "123", 
#         "password": "123"
#     })
#     data = login_response.get_json()
#     jwt_token = data['access_token']

#     header = {
#         'Authorization':'Bearer '+jwt_token,
#         'Content-Type': 'application/json'
#     }

#     response = client.post("/postPost", headers=header)

