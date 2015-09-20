__author__ = 'wwang'

import pymongo
import urllib2, time as time_util

AWS_IP_ADDRESS = "54.152.97.131"
DB_NAME = "test"

try:
    if urllib2.urlopen('http://ip.42.pl/raw').read() == AWS_IP_ADDRESS:
        url = 'mongodb://localhost:27017'
    else:
        url = 'mongodb://' + AWS_IP_ADDRESS + ':27017'
    client = pymongo.MongoClient(url)
    db = client[DB_NAME]
except urllib2.HTTPError:
    url = 'mongodb://' + AWS_IP_ADDRESS + ':27017'
    client = pymongo.MongoClient(url)
    db = client[DB_NAME]
except Exception as e:

    print("Mongo client initialize failed!")
    db = None


# +++++ Handle user +++++


def add_facebook_user(user_id):
    """
    create new user
    :param user_id: the user_id get from fb callback call
    :return: null
    """

    collection = db["user_info"]
    doc = {"user_id": user_id, "reputation": 0}
    collection.insert(doc)
    return


def fill_facebook_user(user_id, phone_number, email, nickname):
    collection = db["user_info"]
    mongo_key = {"user_id": user_id}
    mongo_value = {"$set": {"phone_number": phone_number, "email": email, "nickname": nickname}}
    collection.update(mongo_key, mongo_value)
    return


def check_user(user_id):
    """
    check if user already exists
    :param user_id: the user_id get from fb callback call
    :return: 0 for not found, 1 for found
    """

    collection = db["user_info"]
    mongo_key = {"user_id": user_id}
    cursor = collection.find(mongo_key)
    if cursor.count() == 0:
        return 0
    return 1


def get_user(user_id):
    """
    get user_doc by user_id
    :param user_id: the user_id get from fb callback call
    :return: user doc
    """

    collection = db["user_info"]
    mongo_key = {"user_id": user_id}
    cursor = collection.find(mongo_key)
    if cursor.count() == 0:
        print("[mongo.get_user] user not found: " + user_id)
        return
    return cursor[0]


def get_objectid_by_userid(user_id):
    """
    convert userid to user mongo object id
    :param user_id:
    :return:
    """

    collection = db["user_info"]
    mongo_key = {"user_id": user_id}
    cursor = collection.find(mongo_key)
    if cursor.count() == 0:
        print("[mongo.get_objectid_by_userid] user not found: " + user_id)
        return
    return str(cursor[0]["_id"])

# +++++ handle ride +++++


def add_provide_info(user_id, time, target_address, quantity):
    collection = db["provide_info"]
    doc = {"user_id": user_id, "time": time, "target_address": target_address, "quantity": quantity}
    collection.insert(doc)
    return


def add_request_info(user_id, time, target_address, quantity):
    collection = db["request_info"]
    doc = {"user_id": user_id, "time": time, "target_address": target_address, "quantity": quantity}
    collection.insert(doc)
    return


def get_provide_info_list(time, target_address):
    collection = db["provide_info"]
    mongo_key = {"target_address": target_address}#, "time": {"$lt": time}}
    result = collection.find(mongo_key).sort([("time", 1)])
    return map(lambda element: {"user_id": element["user_id"],
                                "time": element["time"],
                                "target_address": element["target_address"],
                                "quantity": element["quantity"]}, list(result))


def get_request_info_list(time, target_address):
    collection = db["request_info"]
    mongo_key = {"target_address": target_address}#, "time": {"$gt": time}}
    result = collection.find(mongo_key).sort([("time", 1)])
    return map(lambda element: {"user_id": element["user_id"],
                                "time": element["time"],
                                "target_address": element["target_address"],
                                "quantity": element["quantity"]}, list(result))


if __name__ == "__main__":
    # test user part
    exist = check_user("fakfasdf")
    print(exist)
    if not exist:
        add_facebook_user("fakfasdf")
    print(check_user("fakfasdf"))
    fill_facebook_user("fakfasdf", "123456", "safasf@sdfaf.com", "david")
    print(get_user("fakfasdf"))
    print(get_objectid_by_userid("fakfasdf"))

    # test ride part
    add_provide_info("fakfasdf", int(time_util.time()), "123234", 1)
    print(int(time_util.time()) + 1)
    print(get_provide_info_list(int(time_util.time()) + 1, "123234"))

    add_request_info("fakfasdf", int(time_util.time()), "123234", 1)
    print(int(time_util.time()) - 5)
    print(get_request_info_list(int(time_util.time()) - 5, "123234"))

