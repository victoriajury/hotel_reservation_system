import pytest
from server.database import db
from server.models import ReservationStatus


def test_get_all_reservation_statuses(client):
    response = client.get("api/reservation-status")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["status"] == "Confirmed"
    assert data[1]["status"] == "Checked-in"


def test_get_single_reservation_status(client):
    response = client.get("api/reservation-status/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["status"] == "Confirmed"


@pytest.mark.parametrize(
    "path",
    (
        "api/reservation-status/3",
        "api/reservation-status/123",
    ),
)
def test_reservations_status_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404

# @pytest.mark.parametrize(
#     "path",
#     (
#         "/reservation_status/create",
#         "/reservation_status/1/update",
#         "/reservation_status/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


def test_create_reservation_status(client, auth, app):
    data = {
        "status": "Confirmed",
        "description": "Reservation confirmed.",
        "bg_color": "#FF0000",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/reservation-status").status_code == 200
    res = client.post("api/reservation-status", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(ReservationStatus.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_reservation_status_missing_fields(client, auth, app):
    data = {
        # "status" missing
        "description": "Reservation confirmed.",
        "bg_color": "#FF0000",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/reservation-status").status_code == 200
    res = client.post("api/reservation-status", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["status"]

    with app.app_context():
        count_query = db.func.count(ReservationStatus.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_reservation_status(client, auth, app):
    data = {
        "status": "Confirmed",
        "description": "Reservation confirmed.",
        "bg_color": "#FF0000",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/reservation-status").status_code == 200
    res = client.put("api/reservation-status/1", json=data)
    assert res.status_code == 204


def test_update_reservation_status_missing_fields(client, auth, app):
    data = {
        # "status" missing
        "description": "Reservation confirmed.",
        "bg_color": "#FF0000",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/reservation-status/1").status_code == 200
    res = client.put("api/reservation-status/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["status"]


def test_update_reservation_status_not_found(client, auth, app):
    data = {
        "status": "Confirmed",
        "description": "Reservation confirmed.",
        "bg_color": "#FF0000",
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/reservation-status").status_code == 200
    res = client.put("api/reservation-status/3", json=data)
    assert res.status_code == 404


def test_delete_reservation_status(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/reservation-status/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(ReservationStatus.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_reservation_status_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/reservation-status/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(ReservationStatus.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2
