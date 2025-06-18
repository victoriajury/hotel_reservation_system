from io import BytesIO
import os
import pytest
from server.database import db
from server.models import TransportMethods
from server.helpers import room_image_location


def test_get_all_transport_methods(client):
    response = client.get("api/transport-methods")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["transport_name"] == "Car"
    assert data[1]["transport_name"] == "Train"


def test_get_single_transport_method(client):
    response = client.get("api/transport-methods/1")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert data["transport_name"] == "Car"


@pytest.mark.parametrize(
    "path",
    (
        "api/transport-methods/3",
        "api/transport-methods/123",
    ),
)
def test_transport_method_record_not_found(client, auth, path):
    # test data only has 2 records, expects record 3 not found
    # auth.login()
    assert client.get(path).status_code == 404


# def test_index(client, auth):
#     response = client.get("/transport_methods/")
#     assert b'href="/auth/login"' in response.data
#     assert b"King-size bed, bath, sea views" not in response.data
#     assert b"Edit" not in response.data
#     assert response.headers["Location"] == "/auth/login"

#     auth.login()
#     response = client.get("/transport_methods/")
#     assert b"Log out" in response.data
#     assert b"Superior Double" in response.data
#     assert b"King-size bed, bath, sea views" in response.data
#     assert b'href="/transport_methods/1/update"' in response.data


def test_create_transport_method(client, auth, app):
    data = {
        "transport_name": "Bicycle",
    }

    # auth.login()
    assert client.get("api/transport-methods").status_code == 200
    res = client.post("api/transport-methods", json=data)
    assert res.status_code == 201

    with app.app_context():
        count_query = db.func.count(TransportMethods.id)
        count = db.session.execute(count_query).scalar()
        assert count == 3


def test_create_transport_method_missing_fields(client, auth, app):
    data = {
        # "transport_name" missing,
    }

    # auth.login()
    assert client.get("api/transport-methods").status_code == 200
    res = client.post("api/transport-methods", json=data)
    assert res.status_code == 400
    assert b"Missing required parameter" in res.data

    with app.app_context():
        count_query = db.func.count(TransportMethods.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_create_transport_method_valid_fields_type(client, auth, app):
    data = {
        "transport_name": "",
    }

    # auth.login()
    assert client.get("api/transport-methods").status_code == 200
    res = client.post("api/transport-methods", json=data)
    assert res.status_code == 400
    assert b"Invalid value for field: transport_name" in res.data

    with app.app_context():
        count_query = db.func.count(TransportMethods.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2


def test_update_transport_method(client, auth, app):
    data = {
        "transport_name": "Bicycle",
    }

    # auth.login()
    assert client.get("api/transport-methods").status_code == 200
    res = client.put("api/transport-methods/1", json=data)
    assert res.status_code == 204


def test_update_transport_method_missing_fields(client, auth, app):
    data = {
        # "transport_name" missing,
    }

    # auth.login()
    assert client.get("api/transport-methods/1").status_code == 200
    res = client.put("api/transport-methods/1", json=data)
    assert res.status_code == 400
    assert b"Missing required parameter" in res.data


def test_update_transport_method_valid_fields_type(client, auth, app):
    data = {
        "transport_name": "",
    }
    # auth.login()
    assert client.get("api/transport-methods/1").status_code == 200
    res = client.put("api/transport-methods/1", json=data)
    assert res.status_code == 400
    assert b"Invalid value for field: transport_name" in res.data


def test_update_transport_method_not_found(client, auth, app):
    data = {
        "transport_name": "Bicycle",
    }

    # auth.login()
    assert client.get("api/transport-methods").status_code == 200
    res = client.put("api/transport-methods/3", json=data)
    assert res.status_code == 404


def test_delete_transport_method(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/transport-methods/1",
    )
    assert res.status_code == 204

    with app.app_context():
        count_query = db.func.count(TransportMethods.id)
        count = db.session.execute(count_query).scalar()
        assert count == 1


def test_delete_transport_method_not_found(client, auth, app):
    # auth.login()
    res = client.delete(
        "api/transport-methods/3",
    )
    assert res.status_code == 404

    with app.app_context():
        count_query = db.func.count(TransportMethods.id)
        count = db.session.execute(count_query).scalar()
        assert count == 2

# @pytest.mark.parametrize(
#     "path",
#     (
#         "/transport_methods/create",
#         "/transport_methods/1/update",
#         "/transport_methods/1/delete",
#     ),
# )
# def test_login_required(client, path):
#     response = client.post(path)
#     assert response.headers["Location"] == "/auth/login"


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/transport_methods/3/update",
#         "/transport_methods/3/delete",
#     ),
# )
# def test_record_exists(client, auth, path):
#     # test data only has 2 records, expects record 3 not found
#     auth.login()
#     assert client.post(path).status_code == 404


# def test_create(client, auth, app):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     assert client.get("/transport_methods/create").status_code == 200
#     client.post("/transport_methods/create", data=data, content_type="multipart/form-data")

#     with app.app_context():
#         db = get_db()
#         count = db.execute("SELECT COUNT(id) FROM transport_methods").fetchone()[0]
#         assert count == 3


# def test_update(client, auth, app):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     assert client.get("/transport_methods/1/update").status_code == 200
#     res = client.post(
#         "/transport_methods/1/update", data=data, content_type="multipart/form-data"
#     )
#     assert res.status_code == 302

#     with app.app_context():
#         db = get_db()
#         res = db.execute("SELECT * FROM transport_methods WHERE id = 1").fetchone()
#         assert res["type_name"] == "Single"
#         assert res["max_occupants"] == 1


# @pytest.mark.parametrize(
#     "path",
#     (
#         "/transport_methods/create",
#         "/transport_methods/1/update",
#     ),
# )
# def test_create_update_validate(client, auth, path):
#     data = {
#         "type_name": "",
#         "base_price_per_night": "",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), "test.jpg")

#     auth.login()
#     response = client.post(path, data=data, content_type="multipart/form-data")
#     assert b"Type Name is required." in response.data
#     assert b"Base Price Per Night is required." in response.data
#     assert b"Max Occupants is required." in response.data


# @pytest.mark.parametrize(
#     "path, extension",
#     [
#         ("/transport_methods/create", "pdf"),
#         ("/transport_methods/1/update", "txt"),
#     ],
# )
# def test_create_update_allowed_extensions_validate(client, auth, path, extension):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data["photo"] = (BytesIO(b"abcdef"), f"test.{extension}")

#     auth.login()
#     response = client.post(path, data=data, content_type="multipart/form-data")
#     assert b"Not a valid file type." in response.data


# @pytest.mark.parametrize(
#     "path, key, filename, photo_bytes, expected",
#     [
#         ("/transport_methods/create", "", "test.jpg", b"abcdef", b"No photo part found"),
#         ("/transport_methods/create", "photo", "", b"abcdef", b"No selected photo"),
#         ("/transport_methods/create", "photo", "test.jpg", b"", b"Invalid file"),
#         ("/transport_methods/1/update", "", "test.jpg", b"abcdef", b"No photo part found"),
#         ("/transport_methods/1/update", "photo", "", b"abcdef", b"No selected photo"),
#         ("/transport_methods/1/update", "photo", "test.jpg", b"", b"Invalid file"),
#     ],
# )
# def test_create_update_photo_upload_validate(
#     client, auth, path, key, filename, photo_bytes, expected
# ):
#     data = {
#         "type_name": "Single",
#         "base_price_per_night": "95",
#         "amenities": "Single bed, sea views, shower",
#         "max_occupants": "1",
#     }
#     data[key] = (BytesIO(photo_bytes), filename)

#     auth.login()
#     response = client.post(path, data=data, content_type="multipart/form-data")
#     assert expected in response.data


# def test_delete(client, auth, app):
#     auth.login()
#     response = client.post("/transport_methods/1/delete")
#     assert response.headers["Location"] == "/transport_methods/"

#     with app.app_context():
#         db = get_db()
#         post = db.execute("SELECT * FROM transport_methods WHERE id = 1").fetchone()
#         assert post is None
