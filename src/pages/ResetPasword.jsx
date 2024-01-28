import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authUser.service";
import * as Yup from "yup";
import { Label } from "semantic-ui-react";

import { Formik, Field, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Required field"),
});

export default function ResetPasword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (values) => {
    setMessage("");
    setLoading(true);

    AuthService.login(values.email).then(
      () => {
        navigate("/");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleLogin}
        validationSchema={validationSchema} // Use Yup's validation schema
      >
        {({ handleSubmit }) => (
          <div className="mx-auto mt-8 -z-0 max-w-screen-xl px-4 py-7 xl:justify-center sm:px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">
              <form
                onSubmit={handleSubmit}
                action=""
                className="mb-0 mt-5 space-y-4 rounded-lg p-4 border-2 shadow-2xl sm:p-2 lg:p-4 3xl:p-6"
              >
                <p className="text-center text-xl font-mulish font-bold">
                  Reset your password
                </p>

                <div>
                  <label className="font-mulish font-bold text-sm text-gray-900 grid justify-items-start">
                    Email address
                  </label>

                  <div className="relative max-w-xl mt-2">
                    <Field
                      name="email"
                      type="email"
                      className="w-full pr-6 pl-3 py-3 text-gray-800 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
                      placeholder="Enter email address"
                    />

                    <span className="text-gray-400 absolute right-3 inset-y-0 my-auto active:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-3 h-3 mt-[18px] text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                  </div>
                  <ErrorMessage
                    name="email"
                    render={(msg) => (
                      <span>
                        <Label
                          color="red"
                          className="orbitron"
                          content={msg}
                          style={{ marginTop: 10 }}
                        />
                      </span>
                    )}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-6 text-white font-bold bg-gray-900 dark:bg-sky-500 hover:bg-gray-800 dark:hover:bg-sky-600 ring-offset-2 ring-gray-800 dark:ring-sky-500 focus:ring shadow rounded-lg"
                >
                  Reset your password
                </button>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
