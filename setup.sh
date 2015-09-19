#! /bin/bash

# author wwang

function exitOnError() {
    echo "Error: ${1}"
    exit 1
}
# sudo apt-get install apache2 libapache2-mod-wsgi || exitOnError "error installing apache 2"
sudo pip install --upgrade pip || exitOnError "error upgrade pip"
sudo pip install tweepy || exitOnError "error install tweepy"
sudo pip install git+git://github.com/Clarifai/Clarifai_py.git || exitOnError "error install clarify api"
sudo pip install Flask || exitOnError "error install flask"

sudo pip install praw || exitOnError "error install praw"
sudo pip install python-instagram || exitOnError "error install python-instagram"

sudo apt-get install python2.7-dev
sudo apt-get install tesseract-ocr
sudo pip install pytesseract
sudo pip install pillow
sudo pip install enum34 # package Enum
sudo pip install pymongo
sudo pip install -U nltk
sudo pip install -U numpy

sudo pip install oauth2
