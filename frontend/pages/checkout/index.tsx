import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  var { flight, ntravelers } = router.query;

  const [error, setError] = useState('');

  //base case
  if (!flight || !ntravelers) return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1>There's nothing here</h1>
    </div>
  )

  flight = JSON.parse(flight as string); //brrrrrrr

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    //call api and make resevation
    const res = await fetch('http://localhost:5000/api/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flight_code: flight.flight_number,
        ntravelers,
        user: {
          name: e.target.name.value,
          email: e.target.email.value,
          phone: e.target.phone.value,
          address: e.target.address.value,
          credit_card: e.target["credit-card"].value,
        }
      })
    });

    if (res.status == 200) {
      //this will make the reservation
      router.push(
        {
          pathname: '/success',
          query: {
            reservation: JSON.stringify({
              flight,
              ntravelers
            }),
            user: JSON.stringify({
              name: e.target.name.value,
              email: e.target.email.value,
              phone: e.target.phone.value,
              address: e.target.address.value,
              credit_card: e.target["credit-card"].value,
            })
          },
        }
      )
    }
    else {
      //this will show an error
      setError("Something went wrong, did not make reservation!");
    }

  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-10 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="py-2 px-3 border-gray-300 border w-full rounded-md"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="py-2 px-3 border-gray-300 border w-full rounded-md"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="py-2 px-3 border-gray-300 border w-full rounded-md"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="address"
                  required
                  className="py-2 px-3 border-gray-300 border w-full rounded-md"
                />
              </div>
            </div>
            <div>
              <label htmlFor="credit-card" className="block text-sm font-medium text-gray-700">
                Credit Card
              </label>
              <div className="mt-1">
                <input
                  id="credit-card"
                  name="credit-card"
                  type="text"
                  autoComplete="cc-number"
                  required
                  className="py-2 px-3 border-gray-300 border w-full rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-600">Flight code: {flight.flight_number}</span>
              <span className="text-gray-600">Price: {(flight?.price * ntravelers).toFixed(2)} €</span>
              <span className="text-gray-600">Number of Travelers: {ntravelers}</span>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Confirm Order
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
