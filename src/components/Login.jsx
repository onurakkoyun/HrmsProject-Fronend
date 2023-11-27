import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authUser.service";
import SignUp from "./SignUp";
import * as Yup from "yup";
import { Label } from "semantic-ui-react";

import { Formik, Field, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Field is required!"),
  password: Yup.string().required("Field is required!"),
});

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true);
  };

  useEffect(() => {
    let timer;
    if (message) {
      // Set a timer to clear the message after 3000 milliseconds (3 seconds)
      timer = setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    return () => {
      // Clean up the timer when the component unmounts or when message changes
      clearTimeout(timer);
    };
  }, [message]);

  const handleLogin = (values) => {
    setMessage("");
    setLoading(true);

    AuthService.login(values.username, values.password).then(
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
        initialValues={{ username: "", password: "" }}
        onSubmit={handleLogin}
        validationSchema={validationSchema} // Use Yup's validation schema
      >
        {({ handleSubmit }) => (
          <div className="mx-auto mt-8 -z-0 max-w-screen-xl px-4 py-16 xl:justify-center sm:px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">
              <h1 className="text-center text-xl font-mulish font-bold text-indigo-600 sm:text-3xl">
                Get started today
              </h1>

              <p className="mx-auto mt-4 max-w-md text-center text-md font-medium text-gray-600">
                Welcome to the premier job portal where your career journey
                begins. Your next big opportunity is just a login away. Join our
                community of job seekers and employers today.
              </p>

              <form
                onSubmit={handleSubmit}
                action=""
                className="mb-0 mt-5 space-y-4 rounded-lg p-4 border-2 shadow-2xl sm:p-2 lg:p-4 3xl:p-6"
              >
                <p className="text-center text-xl font-mulish font-bold">
                  Log in to your account
                </p>

                <div>
                  <label className="font-mulish font-bold text-sm text-gray-900 grid justify-items-start">
                    Email / Username
                  </label>

                  <div className="relative max-w-xl mt-2">
                    <Field
                      name="username"
                      type="text"
                      className="w-full pr-6 pl-3 py-3 text-gray-800 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
                      placeholder="Enter email or username"
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
                    name="username"
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

                <div>
                  <label className="font-mulish font-bold text-sm text-gray-900 grid justify-items-start">
                    Password
                  </label>

                  <div className="relative max-w-xl mt-2">
                    <span
                      className="text-gray-400 absolute right-3 inset-y-0 my-auto active:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          className="w-3 h-3 mt-[18px] text-indigo-800"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 mt-[18px] text-gray-500 hover:text-indigo-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                    </span>
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pr-6 pl-3 py-3 text-gray-800 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                  </div>

                  <ErrorMessage
                    name="password"
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
                  {message && (
                    <Label
                      color="red"
                      basic
                      className="orbitron"
                      content={message}
                      style={{ marginTop: 10 }}
                    ></Label>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-6 text-white font-bold bg-gray-900 dark:bg-sky-500 hover:bg-gray-800 dark:hover:bg-sky-600 ring-offset-2 ring-gray-800 dark:ring-sky-500 focus:ring shadow rounded-lg"
                >
                  Log in
                </button>

                <p className="font-mulish text-center text-md text-gray-500">
                  Don't have an account yet?&nbsp;
                  <a
                    className="underline"
                    onClick={handleSignUpClick}
                    style={{ cursor: "pointer" }}
                  >
                    Sign up
                  </a>
                </p>
                <SignUp
                  open={isSignUpModalOpen}
                  setOpen={setIsSignUpModalOpen}
                />
              </form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
