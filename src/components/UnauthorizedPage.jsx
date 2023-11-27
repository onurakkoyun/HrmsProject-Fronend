import React from 'react'

export default function UnauthorizedPage() {
  return (
    <div>
      <div className="grid h-screen px-4 bg-white place-content-center">
        <div className="text-center">
          <h1 className="mt-6 font-black text-gray-200 text-9xl">403</h1>

          <p className="flex flex-col text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span>Vigilate Captain!</span>
            <span>🫡</span>
          </p>

          <p className="mt-4 text-gray-500">Unauthorized Access Denied</p>

          <a
            href="/home"
            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  )
}
