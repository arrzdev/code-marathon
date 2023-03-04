#create a flask api
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

from utils.similarity import similarity_score
from utils import ryanair
from utils import mongo

app = Flask(__name__)

cors = CORS(app)

#get collection
db = mongo.connect_database()
users_collection = db.users
reservations_collection = db.reservations

#get country c
#https://booking.flytap.com/assets/data/country_codes.json

#https://booking.flytap.com/booking/flights/deeplink?market=US&language=en&origin=LIS&destination=MAD&flightType=return&adt=1&chd=0&inf=0&flexibleDates=false&depDate=11.03.2023&retDate=11.03.2023

#https://www.ryanair.com/api/booking/v4/en-us/availability?ADT=1&CHD=0&DateIn=2023-05-10&DateOut=2023-04-05&Destination=BCN&Disc=0&INF=0&Origin=LIS&TEEN=0&promoCode=&IncludeConnectingFlights=false&FlexDaysBeforeOut=2&FlexDaysOut=2&FlexDaysBeforeIn=2&FlexDaysIn=2&RoundTrip=true&ToUs=AGREED

#https://www.qatarairways.com/app/booking/flexible-calendar?widget=QR&searchType=F&addTaxToFare=Y&minPurTime=0&upsellCallId=&allowRedemption=Y&bookingClass=E&tripType=R&selLang=en&fromStation=LIS&from=Lisbon&toStation=BCN&to=Barcelona&departingHidden=04%20Mar%202023&departing=2023-03-04&returningHidden=11%20Mar%202023&returning=2023-03-11&adults=1&children=0&infants=0&teenager=0&ofw=0&promoCode=

#https://www.qatarairways.com/app/booking/flexible-calendar?widget=QR&searchType=F&addTaxToFare=Y&minPurTime=0&upsellCallId=&allowRedemption=Y&bookingClass=E&tripType=R&selLang=en&from=Lisbon&to=Barcelona&departingHidden=04%20Mar%202023&departing=2023-03-04&returningHidden=11%20Mar%202023&returning=2023-03-11&adults=1&children=0&infants=0&teenager=0&ofw=0&promoCode=

#get city codes
city_codes = requests.get('https://www.qatarairways.com/content/Qatar/common/cityLists/citylists/cityList_en.json').json()

@app.route('/')
def hello_world():
  return 'Hello, World!'


@app.route('/api/v1/search', methods=['GET'])
def search():
  if request.method != 'GET':
    return jsonify({'error': 'Method not allowed'}), 405

  origin = request.args.get('origin')
  destination = request.args.get('destination')

  departure_date = request.args.get('departure_date')
  ntravelers = request.args.get('ntravelers')

  if not origin or not destination or not departure_date or not ntravelers:
    return jsonify({'error': 'Missing parameters'}), 400
  
  #run similarity to get country codes
  origin_lookup = similarity_score(origin, city_codes)
  destination_lookup = similarity_score(destination, city_codes)

  #get city names
  origin_name = origin_lookup["data"]["name"]
  origin_code = origin_lookup["data"]["code"]

  destination_name = destination_lookup["data"]["name"]
  destination_code = destination_lookup["data"]["code"]


  #make rayanair request
  ryanair_results = ryanair.search(destination_name, destination_code, origin_name, origin_code, departure_date, ntravelers)

  if ryanair_results["status"] != "success":
    return jsonify({'error': 'No flights found'}), 400
  
  #get reserved seats on db and remove from results
  for result in ryanair_results["data"]:
    print("before", result["seats_left"])
    reserved_seats = reservations_collection.find({"flight_code": result["flight_number"]})
    if reserved_seats:
      print("found reservation")
    for reserved_seat in reserved_seats:
      result["seats_left"] -= int(reserved_seat["ntravelers"])
    print("after", result["seats_left"])

  return ryanair_results, 200

@app.route('/api/v1/checkout', methods=['POST'])
def checkout():
  if request.method != 'POST':
    return jsonify({'error': 'Method not allowed'}), 405
  
  flight_code = request.json.get('flight_code')
  ntravelers = request.json.get('ntravelers')
  user_data = request.json.get('user')

  #insert into db
  mongo_r = reservations_collection.insert_one({ 
    "flight_code": flight_code,
    "ntravelers": int(ntravelers),
    "user_identifier": user_data["email"], #this will be used to fetch user reservations
    "user_data": user_data
  })

  if mongo_r:
    return jsonify({'success': 'Reservation made'}), 200
  else:
    return jsonify({'error': 'Reservation failed'}), 400

@app.route('/api/v1/login', methods=['POST'])
def login():
  """
  const response = await fetch(`http://localhost:5000/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  """

  if request.method != 'POST':
    return jsonify({'error': 'Method not allowed'}), 405
  
  email = request.json.get('email')
  password = request.json.get('password')

  #check if user exists
  user = users_collection.find_one({"email": email})

  if not user or user["password"] != password:
    return jsonify({'error': 'Wrong credentials'}), 404 

  return jsonify({'success': 'User logged in'}), 200

@app.route('/api/v1/register', methods=['POST'])
def register():
  """
  const response = await fetch(`http://localhost:5000/api/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  """

  if request.method != 'POST':
    return jsonify({'error': 'Method not allowed'}), 405
  
  email = request.json.get('email')
  password = request.json.get('password')

  #check if user exists
  user = users_collection.find_one({"email": email})

  if user:
    return jsonify({'error': 'User already exists'}), 400 

  #insert into db
  mongo_r = users_collection.insert_one({ 
    "email": email,
    "password": password
  })

  if mongo_r:
    return jsonify({'success': 'User registered'}), 200
  else:
    return jsonify({'error': 'User registration failed'}), 400

@app.route('/api/v1/user/reservations', methods=['GET'])
def reservations():
  """
  const response = await fetch(`http://localhost:5000/api/v1/user/reservations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
  """

  if request.method != 'GET':
    return jsonify({'error': 'Method not allowed'}), 405
  
  email = request.args.get('email')

  #get user reservations
  reservations= reservations_collection.find({"user_identifier": email})

  reservations_list = list(reservations)

  #remove _id
  for reservation in reservations_list: #fix serialization
    reservation.pop("_id") 

  return jsonify(reservations_list), 200



if __name__ == '__main__':
  app.run(debug=True)