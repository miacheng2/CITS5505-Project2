import pytest
from app import create_app

from models import User, db


@pytest.fixture
def client():
    app = create_app(test_config=True)
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()

            test_user = User(userName='123', passWord='123')
            db.session.add(test_user)
            db.session.commit()


        yield client
        with app.app_context():
            db.drop_all()

def test_getTestingMsg(client):
    response = client.get('/')
    assert response.status_code == 200

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
    response = client.post("/logout", headers=header)
    assert response.status_code == 200


def test_logout_user_noJWT(client):

    response = client.post("/logout")
    assert response.status_code == 401



# def test_postPost(client):
#     login_response = client.post("/login", json={
#         "username": "123", 
#         "password": "123"
#     })
#     assert login_response.status_code == 200
#     data = login_response.get_json()
#     jwt_token = data['access_token']

#     header = {
#         'Authorization':'Bearer '+jwt_token,
#         'Content-Type': 'application/json'
#     }

#     response = client.post("/postPost", headers=header)
#     assert response.status_code == 200

#     posts = response.get_json()
#     assert isinstance(posts, list)  

#     if len(posts) > 0:
#         assert 'title' in posts[0]
#         assert 'content' in posts[0]
#     else:
#         assert posts == []
