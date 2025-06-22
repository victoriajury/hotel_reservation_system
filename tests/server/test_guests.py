import pytest
from server.database import db
from server.models import Guests


def test_get_all_guests(client):
    response = client.get("api/guests")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["guest_name"] == "Alice Johnson"
    assert data[1]["guest_name"] == "Chris Brown"


def test_get_single_guest(client):
    response = client.get("api/guests/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["guest_name"] == "Alice Johnson"


@pytest.mark.parametrize(
    "path",
    (
        "api/guests/3",
        "api/guests/123",
    ),
)
def test_guest_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/guests/create",
#         "/guests/1/update",
#         "/guests/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


def test_create_guest(client, auth, app):
    data = {
        "guest_name": "Any Name",
        "email": "anyemail@example.com",
        "telephone": "+44 123456789",
        "address_1": "123 Any Street",
        "address_2": "Anywhere",
        "city": "Anytown",
        "county": "Someshire",
        "postcode": "AB12 3CD",
        "guest_notes": "",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/guests").status_code == 200
    res = client.post("api/guests", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(Guests.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_guest_missing_fields(client, auth, app):
    data = {
        # "guest_name" missing
        "email": "anyemail@example.com",
        "telephone": "+44 123456789",
        "address_1": "123 Any Street",
        "address_2": "Anywhere",
        "city": "Anytown",
        "county": "Someshire",
        "postcode": "AB12 3CD",
        "guest_notes": "",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/guests").status_code == 200
    res = client.post("api/guests", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["guest_name"]

    with app.app_context():
        count_query = db.func.count(Guests.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_guest(client, auth, app):
    data = {
        "guest_name": "Any Name",
        "email": "anyemail@example.com",
        "telephone": "+44 123456789",
        "address_1": "123 Any Street",
        "address_2": "Anywhere",
        "city": "Anytown",
        "county": "Someshire",
        "postcode": "AB12 3CD",
        "guest_notes": "Some notes",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/guests").status_code == 200
    res = client.put("api/guests/1", json=data)
    assert res.status_code == 204


def test_update_guest_missing_fields(client, auth, app):
    data = {
        # "guest_name" missing
        "email": "anyemail@example.com",
        "telephone": "+44 123456789",
        "address_1": "123 Any Street",
        "address_2": "Anywhere",
        "city": "Anytown",
        "county": "Someshire",
        "postcode": "AB12 3CD",
        "guest_notes": "Some notes",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/guests/1").status_code == 200
    res = client.put("api/guests/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["guest_name"]


def test_update_guest_not_found(client, auth, app):
    data = {
        "guest_name": "Any Name",
        "email": "anyemail@example.com",
        "telephone": "+44 123456789",
        "address_1": "123 Any Street",
        "address_2": "Anywhere",
        "city": "Anytown",
        "county": "Someshire",
        "postcode": "AB12 3CD",
        "guest_notes": "Some notes",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/guests").status_code == 200
    res = client.put("api/guests/3", json=data)
    assert res.status_code == 404


def test_delete_guest(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/guests/2",  # guest does not have existing reservation
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(Guests.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_guest_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/guests/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(Guests.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_delete_guest_with_existing_reservation(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/guests/1",
    )
    assert (
        "Cannot delete guest: guest is referenced by existing reservations" in res.text
    )
    assert res.status_code == 400

    with app.app_context():
        count_query = db.func.count(Guests.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


# @pytest.mark.parametrize(
#     "redirect_url, expected",
#     [
#         ("/reservations/create", "/reservations/create?guest_id=3"),
#         ("/calendar/2024/6", "/guests/"),
#         ("", "/guests/"),
#     ],
# )
# def test_create_with_redirect(client, auth, app, redirect_url, expected):
#     data = {
#         "guest_name": "Any Name",
#         "email": "anyemail@example.com",
#         "telephone": "+44 123456789",
#         "address_1": "123 Any Street",
#         "address_2": "Anywhere",
#         "city": "Anytown",
#         "county": "Someshire",
#         "postcode": "AB12 3CD",
#         "guest_notes": "",
#     }

#     auth.login()
#     assert client.get(f"/guests/create?redirect={redirect_url}").status_code == 200

#     response = client.post(f"/guests/create?redirect={redirect_url}", data=data)

#     with app.app_context():
#         db = get_db()
#         count = db.execute("SELECT COUNT(id) FROM guests").fetchone()[0]
#         assert count == 3

#     assert response.headers["Location"] == expected


# def test_update(client, auth, app):
#     data = {
#         "guest_name": "Any Name",
#         "email": "updated@example.com",
#         "telephone": "+44 123456789",
#         "address_1": "123 Any Street",
#         "address_2": "Anywhere",
#         "city": "Anytown",
#         "county": "Someshire",
#         "postcode": "AB12 3CD",
#         "guest_notes": "Some notes",
#     }

#     auth.login()
#     assert client.get("/guests/1/update").status_code == 200
#     response = client.post("/guests/1/update", data=data)
#     assert response.status_code == 302

#     with app.app_context():
#         db = get_db()
#         result = db.execute("SELECT * FROM guests WHERE id = 1").fetchone()
#         assert result["email"] == "updated@example.com"
#         assert result["guest_notes"] == "Some notes"


# @pytest.mark.parametrize(
#     "redirect_url, expected",
#     [
#         ("/reservations/create", "/reservations/create"),
#         (
#             f"/calendar/{datetime.now().year}/{datetime.now().month}",
#             f"/calendar/{datetime.now().year}/{datetime.now().month}/",
#         ),
#         ("/calendar/2024/6/", "/calendar/2024/6/"),
#         ("", "/guests/"),
#     ],
# )
# def test_update_with_redirect(client, auth, app, redirect_url, expected):
#     data = {
#         "guest_name": "Any Name",
#         "email": "updated@example.com",
#         "telephone": "+44 123456789",
#         "address_1": "123 Any Street",
#         "address_2": "Anywhere",
#         "city": "Anytown",
#         "county": "Someshire",
#         "postcode": "AB12 3CD",
#         "guest_notes": "Some notes",
#     }

#     auth.login()
#     assert client.get(f"/guests/1/update?redirect={redirect_url}").status_code == 200
#     response = client.post(f"/guests/1/update?redirect={redirect_url}", data=data)
#     assert response.status_code == 302

#     with app.app_context():
#         db = get_db()
#         result = db.execute("SELECT * FROM guests WHERE id = 1").fetchone()
#         assert result["email"] == "updated@example.com"
#         assert result["guest_notes"] == "Some notes"

#     assert response.headers["Location"] == expected


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/guests/create",
#         "/guests/1/update",
#     ),
# )
# def test_create_update_validate(client, auth, path):
#     data = {
#         "guest_name": "",
#         "email": "anyemail@example.com",
#         "telephone": "+44 123456789",
#         "address_1": "123 Any Street",
#         "address_2": "Anywhere",
#         "city": "",
#         "county": "Someshire",
#         "postcode": "AB12 3CD",
#         "guest_notes": "",
#     }
#     auth.login()
#     response = client.post(path, data=data)
#     assert b"Name is required." in response.data
#     assert b"City is required." in response.data
