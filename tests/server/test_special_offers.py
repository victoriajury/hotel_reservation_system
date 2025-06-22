import pytest
from server.database import db
from server.models import SpecialOffers


def test_get_all_special_offers(client):
    response = client.get("api/special-offers")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["title"] == "Some offer"
    assert data[1]["title"] == "Another offer"


def test_get_single_special_offer(client):
    response = client.get("api/special-offers/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["title"] == "Some offer"


@pytest.mark.parametrize(
    "path",
    (
        "api/special-offers/3",
        "api/special-offers/123",
    ),
)
def test_reservation_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/special_offers/create",
#         "/special_offers/1/update",
#         "/special_offers/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


def test_create_special_offer(client, auth, app):
    data = {
        "title": "Some test offer",
        "room_type": 1,
        "price_per_night": 55,
        "start_date": "2024-09-01",
        "end_date": "2024-09-30",
        "is_enabled": 0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/special-offers").status_code == 200
    res = client.post("api/special-offers", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(SpecialOffers.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_special_offer_missing_field(client, auth, app):
    data = {
        # "title": "Some test offer",
        "room_type": 1,
        "price_per_night": 55,
        "start_date": "2024-09-01",
        "end_date": "2024-09-30",
        "is_enabled": 0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/special-offers").status_code == 200
    res = client.post("api/special-offers", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["title"]

    with app.app_context():
        count_query = db.func.count(SpecialOffers.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_special_offer(client, auth, app):
    data = {
        "title": "Some test offer",
        "room_type": 1,
        "price_per_night": 55,
        "start_date": "2024-09-01",
        "end_date": "2024-09-30",
        "is_enabled": 0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/special-offers").status_code == 200
    res = client.put("api/special-offers/1", json=data)
    assert res.status_code == 204


def test_update_special_offer_missing_field(client, auth, app):
    data = {
        # "title": "Some test offer",
        "room_type": 1,
        "price_per_night": 55,
        "start_date": "2024-09-01",
        "end_date": "2024-09-30",
        "is_enabled": 0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/special-offers").status_code == 200
    res = client.put("api/special-offers/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["title"]


def test_update_special_offer_not_found(client, auth, app):
    data = {
        "title": "Some test offer",
        "room_type": 1,
        "price_per_night": 55,
        "start_date": "2024-09-01",
        "end_date": "2024-09-30",
        "is_enabled": 0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/special-offers").status_code == 200
    res = client.put("api/special-offers/3", json=data)
    assert res.status_code == 404


def test_delete_special_offer(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/special-offers/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(SpecialOffers.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_special_offer_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/special-offers/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(SpecialOffers.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2
