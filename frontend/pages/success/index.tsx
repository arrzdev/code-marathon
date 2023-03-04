import { NextPage } from 'next'
import { useRouter } from 'next/router';
import Head from 'next/head';

const Bill: NextPage = () => {
  const router = useRouter();
  var { reservation, user } = router.query;

  //base case
  if (!reservation || !user) return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1>There's nothing here</h1>
    </div>
  )

  reservation = JSON.parse(reservation as string); //brrrrrrr
  user = JSON.parse(user as string); //brrrrrrr

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Booking Confirmation</title>
      </Head>
      <header className="text-4xl font-bold mb-20">Booking Confirmation</header>
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6">Flight Details</h2>
        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <div className="bg-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-2">Flight Number: {reservation.flight.flight_number}</h3>
            <p>Origin: {reservation.flight.origin} ({reservation.flight.origin_code})</p>
            <p>Destination: {reservation.flight.destination} ({reservation.flight.destination_code})</p>
            <p>Departure Time: {formatDate(reservation.flight.departure_time)}</p>
            <p>Arrival Time: {formatDate(reservation.flight.arrival_time)}</p>
            <p>Price: ${reservation.flight.price}</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-6">Passenger Details</h2>
        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <div className="bg-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-2">Name: {user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Address: {user.address}</p>
            <p>Credit Card: {user.credit_card}</p>
          </div>

        </div>
        <h2 className="text-xl font-bold mb-6">Total Cost</h2>
        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <p>Total cost for {reservation.ntravelers} travelers: ${(reservation.flight.price * reservation.ntravelers).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default Bill