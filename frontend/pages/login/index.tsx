import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';


const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    //make http request to login user
    const response = await fetch(`http://localhost:5000/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Invalid email or password")
      return;
    }

    const reservations_r = await fetch(`http://localhost:5000/api/v1/user/reservations?email=${email}`);

    if (!reservations_r.ok) {
      setError("Failed to get reservations")
      return;
    }

    const reservations = await reservations_r.json();

    if (reservations) {
      //stringify reservations
      reservations.forEach((reservation: any) => {
        reservation.flight = JSON.stringify(reservation.flight);
      });
      console.log(reservations)
      setReservations(reservations);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    //make http request to register user
    const response = await fetch(`http://localhost:5000/api/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Failed to register")
      return;
    }

    const data = await response.json();

    if (data && data.token) {
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      console.error('Failed to register');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>RizingFlights | Login</title>
      </Head>
      <header className="text-4xl font-bold mb-20">RizingFlights</header>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6">
            <label
              htmlFor="email"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
          <div className="w-full px-3">
            <label
              htmlFor="password"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
          <div className="w-full px-3">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="mt-5 w-full px-3">
                <button
                  type="submit"
                  onClick={handleRegister}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* render reservations */}
        {reservations && reservations.map((reservation: any) => (
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    htmlFor="flight_code"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    Flight Code
                  </label>
                  <input
                    type="text"
                    id="flight_code"
                    name="flight_code"
                    value={reservation.flight_code}
                    readOnly={true}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    htmlFor="ntravelers"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    Number of travelers
                  </label>
                  <input
                    type="number"
                    id="ntravelers"
                    name="ntravelers"
                    value={reservation.ntravelers}
                    readOnly={true}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    htmlFor="user_data"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  >
                    User Data
                  </label>
                  <input
                    type="text"
                    id="user_data"
                    name="user_data"
                    value={JSON.stringify(reservation.user_data)}
                    readOnly={true}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* render   */}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}

export default Login


