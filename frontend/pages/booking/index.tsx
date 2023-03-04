import React, { useState } from "react";
import { useRouter } from 'next/router';
import FlightCard from "./FlightCard";

const FlightList = () => {
  const router = useRouter();
  var { flights, ntravelers } = router.query
  const [numTravelers, setNumTravelers] = useState(ntravelers);
  const [sortOption, setSortOption] = useState("price");

  //base case
  if (!flights) return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1>There's nothing here</h1>
    </div>
  )

  flights = JSON.parse(flights as string);

  const handleNumTravelersChange = (e: any) => {
    setNumTravelers(e.target.value);
  };

  const handleSortOptionChange = (e: any) => {
    setSortOption(e.target.value);
  }

  const sortFlights = (flights: any[], option: string) => {
    switch (option) {
      case "price":
        return flights.sort((a, b) => a.price - b.price);
      case "travel_time":
        return flights.sort((a, b) => a.travel_time - b.travel_time);
      case "arrival_time":
        return flights.sort((a, b) => new Date(a.arrival_time) - new Date(b.arrival_time));
      case "departure_time":
        return flights.sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
      default:
        return flights;
    }
  }

  const filteredFlights = sortFlights(
    flights.filter((flight: any) => flight.seats_left >= numTravelers),
    sortOption
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center text-3xl font-bold mt-2 mb-8">
        Available Flights
      </div>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div className="w-32 text-gray-600 font-bold mr-4 text-right">
              Number of Travelers:
            </div>
            <input
              type="number"
              name="num-travelers"
              value={numTravelers}
              onChange={handleNumTravelersChange}
              placeholder="Enter number of travelers"
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
          <div className="flex items-center mb-4">
            <div className="w-24 text-gray-600 mr-4 font-bold text-right">
              Sort by:
            </div>
            <div className="relative inline-block">
              <select
                value={sortOption}
                onChange={handleSortOptionChange}
                className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="price">Price</option>
                <option value="travel_time">Travel Time</option>
                <option value="arrival_time">Arrival Time</option>
                <option value="departure_time">Departure Time</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M14.706 7.706a1 1 0 0 0-1.414-1.414l-3.998 3.998-3.998-3.998a1 1 0 1 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l4.5-4.5z" /></svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {filteredFlights.map((flight: any, index: number) => (
              <FlightCard key={index} flight={flight} ntravelers={numTravelers} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightList;
