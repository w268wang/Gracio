__author__ = 'wwang'

import pymongo
import urllib2

AWS_IP_ADDRESS = "54.152.34.192"
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
except:
    print("Mongo client initialize failed!")
    db = None

