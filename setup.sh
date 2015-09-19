#! /bin/bash

# author wwang

function exitOnError() {
    echo "Error: ${1}"
    exit 1
}
sudo pip install Flask || exitOnError "error install flask"
sudo pip install pymongo
sudo pip install oauth2
sudo pip install twisted
