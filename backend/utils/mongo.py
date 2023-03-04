import re
from pymongo import MongoClient
from decouple import config

MONGO = config("MONGO")

def connect_database():
  try:  
    #connect to the cluster
    client = MongoClient(MONGO)

    #connect to the collection inside the db
    # database
    db = client.rice #arroz branco xd
    return db
    
  except:
    print("Could not connect to database!")
    exit()
    

def insert_data(collection, data):
  collection.insert_one(data)
  
def update_data(collection, id, data):
  collection.update_one(
    {"_id": id},
    {"$set": data}
  )
  
def find(collection, id):
  result = list(collection.find({
    "_id": id
  }))

  if result:
    return result[0]
  else:
    return False

def get_entries(collection):
  result = list(collection.find())
  
  if result:
    return result
  else:
    return False