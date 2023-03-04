import React from "react";
import { useRouter } from "next/router";

function FlightCard({ flight, ntravelers }: any) {
  const router = useRouter();

  const {
    arrival_time,
    departure_time,
    destination,
    destination_code,
    flight_number,
    origin,
    origin_code,
    price,
    seats_left,
    trip_time,
  } = flight;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
    });
  };

  const handleCheckoutClick = () => {
    const parsed_flight = JSON.stringify(flight);

    router.push({
      pathname: '/checkout',
      query: {
        flight: parsed_flight,
        ntravelers,
      }
    });
  };

  return (
    <div className="bg-white shadow-md rounded-md mb-4 p-6 border-black ">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-lg text-blue-600">{flight_number}</div>
        <div className="text-gray-500">Seats left: {seats_left}</div>
      </div>
      <div className="flex items-center mb-4">
        <div className="text-gray-500 mr-4">{formatDate(departure_time)}</div>
        <div className="text-lg font-bold text-gray-800">{origin}</div>
      </div>
      <div className="flex items-center mb-4">
        <div className="text-gray-500 mr-4">{formatDate(arrival_time)}</div>
        <div className="text-lg font-bold text-gray-800">{destination}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-gray-500 flex-grow">
          Trip time: {trip_time}, {origin_code} - {destination_code}
        </div>
        <div className="font-bold text-lg text-green-600">
          ${(price * Number(ntravelers)).toFixed(2)}
        </div>
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCheckoutClick}
        >
          Checkout
        </button>
      </div>

    </div>
  );
}

export default FlightCard;
