import pytest
from server.database import db
from server.models import Rooms

def test_get_all_rooms(client):
    response = client.get("api/rooms")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["room_number"] == 1
    assert data[1]["room_number"] == 101


def test_get_single_room(client):
    response = client.get("api/rooms/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["room_number"] == 1


@pytest.mark.parametrize(
    "path",
    (
        "api/rooms/3",
        "api/rooms/123",
    ),
)
def test_room_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


def test_create_room(client, auth, app):
    data = {
        "room_number": 101,
        "room_type": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/rooms").status_code == 200
    res = client.post("api/rooms", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(Rooms.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_room_missing_fields(client, auth, app):
    data = {
        # "room_number" missing
        "room_type": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/rooms").status_code == 200
    res = client.post("api/rooms", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["room_number"]

    with app.app_context():
        count_query = db.func.count(Rooms.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_create_room_valid_field_type(client, auth, app):
    data = {
        "room_number": "Not a number",
        "room_type": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/rooms").status_code == 200
    res = client.post("api/rooms", json=data)
    assert res.status_code == 400
    assert "invalid literal for int()" in res.json["message"]["room_number"]

    with app.app_context():
        count_query = db.func.count(Rooms.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_room(client, auth, app):
    data = {
        "room_number": 101,
        "room_type": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/rooms").status_code == 200
    res = client.put("api/rooms/1", json=data)
    assert res.status_code == 204


def test_update_room_missing_fields(client, auth, app):
    data = {
        # "room_number" missing
        "room_type": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/rooms/1").status_code == 200
    res = client.put("api/rooms/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["room_number"]


def test_update_room_not_found(client, auth, app):
    data = {
        "room_number": 101,
        "room_type": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/rooms").status_code == 200
    res = client.put("api/rooms/3", json=data)
    assert res.status_code == 404


def test_delete_room(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/rooms/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(Rooms.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_room_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/rooms/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(Rooms.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2
