import pytest
from server.database import db
from server.models import Payments


def test_get_all_payments(client):
    response = client.get("api/payments")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["amount"] == 90
    assert data[1]["amount"] == 50


def test_get_single_payment(client):
    response = client.get("api/payments/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["amount"] == 90


@pytest.mark.parametrize(
    "path",
    (
        "api/payments/3",
        "api/payments/123",
    ),
)
def test_payment_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/payments/create",
#         "/payments/1/update",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


def test_create_payment(client, auth, app):
    data = {
        "invoice_id": 1,
        "amount": 125.00,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/payments").status_code == 200
    res = client.post("api/payments", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(Payments.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_payment_missing_fields(client, auth, app):
    data = {
        # "invoice_id" missing
        "amount": 125.00,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/payments").status_code == 200
    res = client.post("api/payments", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["invoice_id"]

    with app.app_context():
        count_query = db.func.count(Payments.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_payment(client, auth, app):
    data = {
        "invoice_id": 3,
        "amount": 50.00,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/payments").status_code == 200
    res = client.put("api/payments/1", json=data)
    assert res.status_code == 204


def test_update_payment_missing_fields(client, auth, app):
    data = {
        # "invoice_id" missing
        "amount": 50.00,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/payments/1").status_code == 200
    res = client.put("api/payments/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["invoice_id"]


def test_update_payment_not_found(client, auth, app):
    data = {
        "invoice_id": 1,
        "amount": 50.00,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/payments").status_code == 200
    res = client.put("api/payments/3", json=data)
    assert res.status_code == 404


def test_delete_payment(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/payments/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(Payments.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_payment_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/payments/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(Payments.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2
