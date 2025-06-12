import pytest
from server.database import db
from server.models import Users
from werkzeug.security import check_password_hash


def test_get_all_users(client):
    response = client.get("api/users")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["username"] == "Alice"
    assert data[1]["username"] == "Bob"


def test_get_single_user(client):
    response = client.get("api/users/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["username"] == "Alice"


@pytest.mark.parametrize(
    "path",
    (
        "api/users/3",
        "api/users/123",
    ),
)
def test_user_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


def test_create_user(client, auth, app):
    data = {
        "username": "test_username",
        "password": "password",
    }

    # auth.login()
    assert client.get("api/users").status_code == 200
    res = client.post("api/users", json=data)
    assert res.status_code == 201

    with app.app_context():
        user = db.session.execute(db.select(Users).filter_by(username="test_username")).scalar_one()
    assert check_password_hash(user.password, data["password"])

    with app.app_context():
        count_query = db.func.count(Users.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_user_missing_fields(client, auth, app):
    data = {
        # "username": "test_username",
        "password": "password",
    }

    # auth.login()
    assert client.get("api/users").status_code == 200
    res = client.post("api/users", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["username"]

    with app.app_context():
        count_query = db.func.count(Users.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_user(client, auth, app):
    data = {
        "username": "test_username",
        "password": "password",
    }

    # auth.login()
    assert client.get("api/users").status_code == 200
    res = client.put("api/users/1", json=data)
    assert res.status_code == 204

    with app.app_context():
        user = db.session.execute(db.select(Users).filter_by(username="test_username")).scalar_one()
    assert check_password_hash(user.password, data["password"])


def test_update_user_missing_fields(client, auth, app):
    data = {
        # "username": "test_username",
        "password": "password",
    }

    # auth.login()
    assert client.get("api/users/1").status_code == 200
    res = client.put("api/users/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["username"]


def test_update_user_not_found(client, auth, app):
    data = {
        "username": "test_username",
        "password": "password",
    }

    # auth.login()
    assert client.get("api/users").status_code == 200
    res = client.put("api/users/3", json=data)
    assert res.status_code == 404


def test_delete_user(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/users/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(Users.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_user_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/users/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(Users.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/users/create",
#         "/users/1/update",
#         "/users/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/users/3/update",
#         "/users/3/delete",
#     ),
# )
# def test_record_exists(client, auth, path):
#     # test data only has 2 records, expects record 3 not found
#     auth.login()
#     assert client.post(path).status_code == 404


# def test_create(client, auth, app):
#     data = {
#         "username": "test_username",
#         "password": "password",
#     }

#     auth.login()
#     assert client.get("/users/create").status_code == 200
#     client.post("/users/create", data=data)

#     with app.app_context():
#         count = db.execute("SELECT COUNT(id) FROM users").fetchone()[0]
#         assert count == 3


# def test_update(client, auth, app):
#     data = {
#         "username": "test_username",
#         "password": "password123",
#     }

#     auth.login()
#     assert client.get("/users/1/update").status_code == 200
#     res = client.post("/users/1/update", data=data)
#     assert res.status_code == 302

#     with app.app_context():
#         res = db.execute("SELECT * FROM users WHERE id = 1").fetchone()
#         assert res["username"] == "test_username"
#         assert check_password_hash(res["password"], data["password"])


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/users/create",
#         "/users/1/update",
#     ),
# )
# def test_create_update_validate(client, auth, path):
#     data = {
#         "username": "",
#         "password": "",
#     }

#     auth.login()
#     response = client.post(path, data=data)
#     assert b"Username is required." in response.data
#     assert b"Password is required." in response.data


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/users/create",
#         "/users/2/update",
#     ),
# )
# def test_create_already_registered_validate(client, auth, path):
#     data = {
#         "username": "test",
#         "password": "password",
#     }

#     auth.login()
#     response = client.post(path, data=data)
#     assert b"already registered." in response.data


# def test_delete_other_user(client, auth, app):
#     auth.login()
#     response = client.post("/users/2/delete")
#     assert response.headers["Location"] == "/users/"

#     with app.app_context():
#         post = db.execute("SELECT * FROM users WHERE id = 2").fetchone()
#         assert post is None


# def test_delete_logged_in(client, auth, app):
#     # Cannot delete users if they are already logged in
#     auth.login()
#     with client:
#         client.get("/")
#         assert session["user_id"] == 1
#         assert g.user["username"] == "test"

#     response = client.post("/users/1/delete", follow_redirects=True)
#     assert b"User currently logged in." in response.data

#     with app.app_context():
#         post = db.execute("SELECT * FROM users WHERE id = 1").fetchone()
#         assert post["username"] == "test"
