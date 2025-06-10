import pytest
from server.database import db
from server.models import Invoices


def test_get_all_invoices(client):
    response = client.get("api/invoices")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["reservation_id"] == 1
    assert data[1]["reservation_id"] == 2


def test_get_single_invoice(client):
    response = client.get("api/invoices/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["reservation_id"] == 1


@pytest.mark.parametrize(
    "path",
    (
        "api/invoices/3",
        "api/invoices/123",
    ),
)
def test_invoice_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# @pytest.mark.parametrize(
#     "path, method",
#     [
#         ("/invoices/create", "post"),
#         ("/invoices/1/view", "get"),
#     ],
# )
# def test_login_required(client, path, method):
#     if method == "get":
#         response = client.get(path)
#         assert response.headers["Location"] == "/auth/login"
#     if method == "post":
#         response = client.post(path)
#         assert response.headers["Location"] == "/auth/login"


def test_create_invoice(client, auth, app):
    data = {
        "reservation_id": 1,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/invoices").status_code == 200
    res = client.post("api/invoices", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(Invoices.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_invoice_missing_field(client, auth, app):
    data = {
        # "reservation_id" missing
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/invoices").status_code == 200
    res = client.post("api/invoices", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["reservation_id"]

    with app.app_context():
        count_query = db.func.count(Invoices.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_invoice(client, auth, app):
    data = {
        "reservation_id": 2,
        "modified_by_id": 2,
    }

    # auth.login()
    assert client.get("api/invoices").status_code == 200
    res = client.put("api/invoices/1", json=data)
    assert res.status_code == 204


def test_update_invoice_missing_field(client, auth, app):
    data = {
        # "reservation_id" missing
        "modified_by_id": 2,
    }

    # auth.login()
    assert client.get("api/invoices").status_code == 200
    res = client.put("api/invoices/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["reservation_id"]


def test_update_invoice_not_found(client, auth, app):
    data = {
        "reservation_id": 2,
        "modified_by_id": 2,
    }

    # auth.login()
    assert client.get("api/invoices").status_code == 200
    res = client.put("api/invoices/3", json=data)
    assert res.status_code == 404


def test_delete_invoice(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/invoices/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(Invoices.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_invoice_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/invoices/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(Invoices.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2