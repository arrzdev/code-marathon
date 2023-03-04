import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';


const Home: NextPage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [numTravelers, setNumTravelers] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    //make http request
    const flightData = await fetch(`http://localhost:5000/api/v1/search?origin=${origin}&destination=${destination}&departure_date=${departureDate}&ntravelers=${numTravelers}`);

    if (!flightData.ok) {
      setError("Invalid parameters")
    }

    const data = await flightData.json();

    if (data && data.data) {
      const flights = JSON.stringify(data.data);
      router.push({
        pathname: '/booking',
        query: { flights, ntravelers: numTravelers }
      });
    } else {
      console.error('Flights not found');
    }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <header className="text-4xl font-bold mb-20">RizingFlights</header>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="origin"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Origin city
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin city"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="destination"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Destination city
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination city"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="departure-date"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Departure date
            </label>
            <input
              type="date"
              id="departure-date"
              name="departure-date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="num-travelers"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Number of travelers
            </label>
            <input
              type="number"
              id="num-travelers"
              name="num-travelers"
              value={numTravelers}
              onChange={(e) => setNumTravelers(e.target.value)}
              placeholder="Enter number of travelers"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default Home
