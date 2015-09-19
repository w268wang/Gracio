__author__ = 'wwang'

import pymongo
import urllib2

AWS_IP_ADDRESS = "54.210.82.202"
DB_NAME = "test"

try:
    if urllib2.urlopen('http://ip.42.pl/raw').read() == AWS_IP_ADDRESS:
        url = 'mongodb://localhost:27017'
    else:
        url = 'mongodb://' + AWS_IP_ADDRESS + ':27017'
    print(url)
    client = pymongo.MongoClient(url)
    db = client[DB_NAME]
except urllib2.HTTPError:
    url = 'mongodb://' + AWS_IP_ADDRESS + ':27017'
    client = pymongo.MongoClient(url)
    db = client[DB_NAME]
except Exception as e:

    print("Mongo client initialize failed!")
    db = None


def check_user(user_id):
    collection = db["user_info"]
    key = "user_id"
    mongo_key = {key: user_id}
    cursor = collection.find(mongo_key)
    if cursor.count() == 0:
        return 0
    return 1


# "contact_info": {"address": "", "phone_number": "", "email": ""}
def add_facebook_user(user_id):
    collection = db["user_info"]
    doc = {"user_id": user_id, "reputation": 0}
    collection.insert(doc)


def fill_facebook_user(user_id, phone_number, email):
    collection = db["user_info"]
    mongo_key = {"user_id": user_id}
    mongo_value = {"$set": {"phone_number": phone_number, "email": email}}
    collection.update(mongo_key, mongo_value)


if __name__ == "__main__":
    print(check_user("fakfasdf"))
    add_facebook_user("fakfasdf")
    print(check_user("fakfasdf"))
    fill_facebook_user("fakfasdf", "123456", "safasf@sdfaf.com")


