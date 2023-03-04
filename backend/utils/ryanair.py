import requests

def search(destinatination_name, destination_code, origin_name, origin_code, departure_date, ntravelers):
  print(destination_code, origin_code, departure_date, ntravelers)

  r = requests.get(f"https://www.ryanair.com/api/booking/v4/en-us/availability?ADT={ntravelers}&CHD=0&DateIn=&DateOut={departure_date}&Destination={destination_code}&Disc=0&INF=0&Origin={origin_code}&TEEN=0&promoCode=&IncludeConnectingFlights=false&FlexDaysBeforeOut=2&FlexDaysOut=2&FlexDaysBeforeIn=2&FlexDaysIn=2&RoundTrip=false&ToUs=AGREED")

  if r.status_code != 200:
    return {
      "status": "error",
      "error": "Rayanair API error"
    }

  #get actual data  
  flight_data = r.json()['trips'][0]["dates"]

  #find flight data of the day
  for day in flight_data:
    if len(day["flights"]) != 0:
      flight_data = day["flights"]
      break

  #parse flight data
  parsed_data = []
  for flight in flight_data:
    try:
      parsed_data.append({
        "origin": origin_name,
        "origin_code": origin_code,

        "destination": destinatination_name,
        "destination_code": destination_code,

        "seats_left": abs(flight["faresLeft"])  + flight["infantsLeft"], #abs will do the trick -1 seats will be 1 :)) works here

        "trip_time": flight["duration"],
        "flight_number": flight["flightNumber"],


        "departure_time": flight["time"][0],
        "arrival_time": flight["time"][1],
        "price": flight["regularFare"]["fares"][0]["amount"]
      })
    
    except:
      return {
        "status": "error",
        "error": "Rayanair API error"
      }
    
  return {
    "status": "success",
    "data": parsed_data
  }

