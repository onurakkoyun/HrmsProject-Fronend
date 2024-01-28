import React from "react";

export default function UnauthorizedPage() {
  return (
    <div>
      <div className="grid h-screen px-4 bg-white place-content-center">
        <div className="text-center">
          <h1 className="mt-6 font-black text-gray-200 text-9xl">403</h1>

          <p className="flex flex-col text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span>Vigilate Captain!</span>
            <br />
            <span>🫡</span>
          </p>

          <p className="mt-4 text-gray-500">Unauthorized Access Denied</p>

          <a
            href="/"
            className="inline-block rounded bg-[#5a2bdb] px-5 py-2 text-sm font-medium text-white hover:text-white focus:outline-none focus:ring"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
