import pytest
from server.database import db
from server.models import InvoiceItems


def test_get_single_invoice_item(client):
    response = client.get("api/invoice-items/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["item_description"] == "Superior Double"


def test_get_all_invoice_items_by_invoice(client):
    response = client.get("api/invoice-items/invoice/2")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["item_description"] == "Superior Double"
    assert data[1]["item_description"] == "Dinner"


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/invoice_items/create",
#         "/invoice_items/1/update",
#         "/invoice_items/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


@pytest.mark.parametrize(
    "path",
    (
        "api/invoice-items/6",
        "api/invoice-items/123",
    ),
)
def test_invoice_item_record_not_found(client, auth, path):
    # test data only has 5 records, expects record 6 not found
    # auth.login()
    assert client.get(path).status_code == 404


def test_create_invoice_item(client, auth, app):
    data = {
        "invoice_id": 2,
        "item_description": "Drinks",
        "quantity": 2,
        "price": 23.0,
        "modified_by_id": 1
    }

    # auth.login()
    res = client.post("api/invoice-items", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(InvoiceItems.id)
        count = db.session.execute(count_query).scalar()
        assert count == 6


def test_create_invoice_item_missing_fields(client, auth, app):
    data = {
        "item_description": "Drinks",
        "quantity": 2,
        "price": 23.0,
        "modified_by_id": 1
    }

    # auth.login()
    res = client.post("api/invoice-items", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["invoice_id"]

    with app.app_context():
        count_query = db.func.count(InvoiceItems.id)
        count = db.session.execute(count_query).scalar()
        assert count == 5


def test_update_invoice_item(client, auth, app):
    data = {
        "invoice_id": 2,
        "item_description": "Standard Double",
        "quantity": 1,
        "is_room": True,
        "price": 123.0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/invoice-items/1").status_code == 200
    res = client.put("api/invoice-items/1", json=data)
    assert res.status_code == 204


def test_update_invoice_item_missing_field(client, auth, app):
    data = {
        # "invoice_id" missing
        "item_description": "Standard Double",
        "quantity": 1,
        "is_room": True,
        "price": 123.0,
        "modified_by_id": 1,
    }

    # auth.login()
    assert client.get("api/invoice-items/1").status_code == 200
    res = client.put("api/invoice-items/1", json=data)
    assert res.status_code == 400
    assert "Missing required parameter" in res.json["message"]["invoice_id"]


def test_update_invoice_item_not_found(client, auth, app):
    data = {
        "invoice_id": 2,
        "item_description": "Standard Double",
        "quantity": 1,
        "is_room": True,
        "price": 123.0,
        "modified_by_id": 1,
    }

    # auth.login()
    res = client.put("api/invoice-items/10", json=data)
    assert res.status_code == 404


def test_delete_invoice_item(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/invoice-items/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(InvoiceItems.id)
        count = db.session.execute(count_query).scalar()
        assert count == 4


def test_delete_invoice_item_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/invoice-items/123",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(InvoiceItems.id)
        count = db.session.execute(count_query).scalar()
        assert count == 5
