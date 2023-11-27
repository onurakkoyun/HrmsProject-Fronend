import { useEffect, useState, Fragment } from "react";
import { Dialog, Menu, Popover, Transition } from "@headlessui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../actions/message";
import { useCallback } from "react";
import { logout } from "../actions/auth";
import UserService from "../services/userService";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import SignUp from "./SignUp";
import { Button } from "@material-tailwind/react";

export default function Navi2() {
  const [homeActiveItem, setHomeActiveItem] = useState(0);
  const [findJobsActiveItem, setFindJobsActiveItem] = useState(null);
  const [companiesActiveItem, setCompaniesActiveItem] = useState(null);
  const [postJobActiveItem, setPostJobActiveItem] = useState(null);
  const [aboutUsActiveItem, setAboutUsActiveItem] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmployeeBoard, setShowEmployeeBoard] = useState(false);
  const [showEmployerBoard, setShowEmployerBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");

  let navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let location = useLocation();
  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true);
  };

  const loadUserPhoto = useCallback(async () => {
    try {
      if (currentUser) {
        let userService = new UserService();
        const response = await userService.getUserPhotoById(currentUser.id);

        if (response.status === 200) {
          const imageBlob = response.data;
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfilePhoto(imageUrl);
        }
      }
    } catch (error) {
      console.error(
        "An error occurred while retrieving the profile photo.",
        error.response
      );
    }
  }, [currentUser]);

  const logOut = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      loadUserPhoto();

      setShowEmployeeBoard(currentUser.roles.includes("ROLE_EMPLOYEE"));
      setShowEmployerBoard(currentUser.roles.includes("ROLE_EMPLOYER"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowEmployeeBoard(false);
      setShowEmployerBoard(false);
      setShowAdminBoard(false);
    }
  }, [currentUser, loadUserPhoto]);

  useEffect(() => {
    if (location.pathname === "/") {
      setHomeActiveItem(0);
      setFindJobsActiveItem(1);
      setCompaniesActiveItem(1);
      setPostJobActiveItem(1);
      setAboutUsActiveItem(1);
    } else if (location.pathname === "/jobPostings/listall") {
      setHomeActiveItem(1);
      setFindJobsActiveItem(0);
      setCompaniesActiveItem(1);
      setPostJobActiveItem(1);
      setAboutUsActiveItem(1);
    } else if (location.pathname === "/employers") {
      setHomeActiveItem(1);
      setFindJobsActiveItem(1);
      setCompaniesActiveItem(0);
      setPostJobActiveItem(1);
      setAboutUsActiveItem(1);
    } else if (
      currentUser &&
      location.pathname === `/employer/${currentUser.id}/jobPosting/add`
    ) {
      setHomeActiveItem(1);
      setFindJobsActiveItem(1);
      setCompaniesActiveItem(1);
      setPostJobActiveItem(0);
      setAboutUsActiveItem(1);
    } else if (location.pathname === "/aboutUs") {
      setHomeActiveItem(1);
      setFindJobsActiveItem(1);
      setCompaniesActiveItem(1);
      setPostJobActiveItem(1);
      setAboutUsActiveItem(0);
    } else {
      setHomeActiveItem(1);
      setFindJobsActiveItem(1);
      setCompaniesActiveItem(1);
      setPostJobActiveItem(1);
      setAboutUsActiveItem(1);
    }
  }, [location.pathname, currentUser]);

  return (
    <header className="bg-white fixed top-[0px] left-[0px] w-full z-50">
      <nav
        className="mx-auto flex max-w-screen-8xl items-center justify-between py-3 lg:px-9.5 shadow-md"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-[10px] p-[10px]">
            <span className="sr-only">Your Company</span>
            <img
              className="w-auto h-5 mx-3 lg:mx-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-6">
          <Menu>
            <div className="font-poppins">
              <Menu.Item
                onClick={() => {
                  setHomeActiveItem(0);
                  setFindJobsActiveItem(1);
                  setCompaniesActiveItem(1);
                  setPostJobActiveItem(1);
                  setAboutUsActiveItem(1);
                }}
                className={`text-sm font-semibold leading-6 text-gray-600 px-4 py-[27px] hover:text-gray-900 hover:border-b-[3px] hover:border-b-blue-gray-100 ${
                  homeActiveItem === 0
                    ? "text-gray-900 border-b-[3px] border-[#5a2bdb] hover:border-b-[#5a2bdb]"
                    : ""
                }`}
                as={Link}
                to="/"
              >
                Home
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setHomeActiveItem(1);
                  setFindJobsActiveItem(0);
                  setCompaniesActiveItem(1);
                  setPostJobActiveItem(1);
                  setAboutUsActiveItem(1);
                }}
                className={`text-sm font-semibold leading-6 text-gray-600 px-4 py-[27px] hover:text-gray-900 hover:border-b-[3px] hover:border-b-blue-gray-100 ${
                  findJobsActiveItem === 0
                    ? "text-gray-900 border-b-[3px] border-[#5a2bdb] hover:border-b-[#5a2bdb]"
                    : ""
                }`}
                as={Link}
                to="/jobPostings/listall"
              >
                Find Jobs
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setHomeActiveItem(1);
                  setFindJobsActiveItem(1);
                  setCompaniesActiveItem(0);
                  setPostJobActiveItem(1);
                  setAboutUsActiveItem(1);
                }}
                className={`text-sm font-semibold leading-6 text-gray-600 px-4 py-[27px] hover:text-gray-900 hover:border-b-[3px] hover:border-b-blue-gray-100 ${
                  companiesActiveItem === 0
                    ? "text-gray-900 border-b-[3px] border-[#5a2bdb] hover:border-b-[#5a2bdb]"
                    : ""
                }`}
                as={Link}
                to="/employers"
              >
                Companies
              </Menu.Item>
              {showEmployerBoard && currentUser && (
                <Menu.Item
                  onClick={() => {
                    setHomeActiveItem(1);
                    setFindJobsActiveItem(1);
                    setCompaniesActiveItem(1);
                    setPostJobActiveItem(0);
                    setAboutUsActiveItem(1);
                  }}
                  className={`text-sm font-semibold leading-6 text-gray-600 px-4 py-[27px] hover:text-gray-900 hover:border-b-[3px] hover:border-b-blue-gray-100 ${
                    postJobActiveItem === 0
                      ? "text-gray-900 border-b-[3px] border-[#5a2bdb] hover:border-b-[#5a2bdb]"
                      : ""
                  }`}
                  as={Link}
                  to={`/employer/${currentUser.id}/jobPosting/add`}
                >
                  Post a Job Ad
                </Menu.Item>
              )}
              <Menu.Item
                onClick={() => {
                  setHomeActiveItem(1);
                  setFindJobsActiveItem(1);
                  setCompaniesActiveItem(1);
                  setPostJobActiveItem(1);
                  setAboutUsActiveItem(0);
                }}
                className={`text-sm font-semibold leading-6 text-gray-600 px-4 py-[27px] hover:text-gray-900 hover:border-b-[3px] hover:border-b-blue-gray-100 ${
                  aboutUsActiveItem === 0
                    ? "text-gray-900 border-b-[3px] border-[#5a2bdb] hover:border-b-[#5a2bdb]"
                    : ""
                }`}
                as={Link}
                to="/aboutUs"
              >
                About us
              </Menu.Item>
            </div>
          </Menu>
        </Popover.Group>

        <Popover.Group className="hidden lg:flex lg:flex-1 lg:justify-end">
          {currentUser ? (
            <div className="flex">
              <div className="mt-2">
                <p className="ms-2 mr-1 hidden text-left text-xs sm:block">
                  <strong className="block font-mulish font-medium">
                    {currentUser.username}
                  </strong>

                  <span className="font-mulish font-medium text-gray-500 mr-1">
                    {" "}
                    {currentUser.email}
                  </span>
                </p>
              </div>
              <div>
                <Menu as="div" className="relative flex flex-col ml-3">
                  <div className="">
                    <Menu.Button className="mt-1 relative flex rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-blue-500">
                      <span className="absolute -inset-[10px]" />
                      <span className="sr-only">Open user menu</span>
                      <div className="rounded-full border-2 border-blue-500">
                        <div className="group flex shrink-0 items-left rounded-lg transition">
                          <span className="sr-only">Menu</span>
                          <div className="rounded-full">
                            {profilePhoto ? (
                              <img
                                className="h-5 w-5 rounded-full object-cover"
                                src={profilePhoto}
                                alt="Profile"
                              />
                            ) : (
                              <img
                                className="h-5 w-5 rounded-full object-cover"
                                src={defaultProfilePhoto}
                                alt="Profile"
                              />
                            )}
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ms-4 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 sm:block"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </Menu.Button>
                  </div>
                  <div className="">
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute text-md text-left font-gabarito right-[0px] z-10 mt-3 w-11 -my-6 divide-y divide-gray-500/10 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div>
                          {showEmployerBoard && (
                            <Menu.Item
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                              as={Link}
                              to={`/employer/${currentUser.id}/profile`}
                            >
                              <div className="flex">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                  </svg>
                                </span>
                                <span>Profile</span>
                              </div>
                            </Menu.Item>
                          )}

                          {showEmployerBoard && (
                            <Menu.Item
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                              as={Link}
                              to={`/employer/${currentUser.id}/jobpostingsList`}
                            >
                              <div className="flex">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                    />
                                  </svg>
                                </span>
                                <span> Published Job Postings</span>
                              </div>
                            </Menu.Item>
                          )}

                          {showEmployeeBoard && (
                            <Menu.Item
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                              as={Link}
                              to={`/employee/${currentUser.id}/profile`}
                            >
                              <div className="flex">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                  </svg>
                                </span>
                                <span>Profile</span>
                              </div>
                            </Menu.Item>
                          )}

                          {showEmployeeBoard && (
                            <Menu.Item
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                              as={Link}
                              to={`/employee/${currentUser.id}/appliedJobs`}
                            >
                              <div className="flex">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                                    />
                                  </svg>
                                </span>
                                <span>Applied Job List</span>
                              </div>
                            </Menu.Item>
                          )}

                          {showEmployeeBoard && (
                            <Menu.Item
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                              as={Link}
                              to={`/employee/${currentUser.id}/resumes`}
                            >
                              <div className="flex">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                                    />
                                  </svg>
                                </span>
                                <span>Resume List</span>
                              </div>
                            </Menu.Item>
                          )}

                          {showEmployeeBoard && (
                            <Menu.Item
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                              as={Link}
                              to={`/employee/${currentUser.id}/letters`}
                            >
                              <div className="flex">
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-3 h-3 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                  </svg>
                                </span>
                                <span>Cover Letter List</span>
                              </div>
                            </Menu.Item>
                          )}

                          <Menu.Item
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:border-l-[#5a2bdb] hover:border-l-[3px]"
                            as={Link}
                            to="/settings"
                          >
                            <div className="flex">
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-3 h-3 mr-2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </span>
                              <span>Settings</span>
                            </div>
                          </Menu.Item>
                        </div>
                        <div>
                          <Menu.Item
                            className="block px-4 py-2 text-gray-800  hover:text-red-500 hover:border-l-red-500 hover:border-l-[3px] hover:bg-red-50"
                            as={Link}
                            to="/"
                            onClick={() => logOut()}
                          >
                            <div className="flex">
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-3 h-3 mr-2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                  />
                                </svg>
                              </span>
                              <span>Log out</span>
                            </div>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </div>
                </Menu>
              </div>
            </div>
          ) : (
            <div className="flex font-mulish">
              <div className="mr-2">
                <Link to="/login">
                  <Button
                    variant="text"
                    size="sm"
                    className="rounded-full text-sm"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
              <div className="">
                <Button
                  className="rounded-full"
                  size="sm"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
                <SignUp
                  open={isSignUpModalOpen}
                  setOpen={setIsSignUpModalOpen}
                />
              </div>
            </div>
          )}
        </Popover.Group>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-[0px] z-10" />
        <Dialog.Panel className="mt-7 fixed inset-y-[0px] right-[0px] z-10 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Mobile Logo</span>
              <img
                className="h-5 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-[18px] rounded-md p-[18px] text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {currentUser ? (
                <div className="grid-rows-1 space-y-2 py-3 mt-2">
                  <div className="rounded-full mt-3">
                    {profilePhoto ? (
                      <div>
                        <li className="list-none">
                          <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg pl-1 space-x-[0xp] w-full h-[64px] text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                              <div className="flex flex-row">
                                <div className="text-sm font-medium">
                                  <img
                                    className="h-6 w-6 rounded-full object-cover"
                                    src={profilePhoto}
                                    alt="Profile"
                                  />
                                </div>
                                <div className="block rounded-lg px-2 text-base font-semibold leading-7 text-gray-900">
                                  <strong className="block font-mulish font-medium">
                                    {currentUser.username}
                                  </strong>

                                  <span className="font-mulish font-medium text-gray-500">
                                    {" "}
                                    {currentUser.email}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3 mt-[8px]"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                              <Menu>
                                {showEmployerBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employer/${currentUser.id}/profile`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                          </svg>
                                        </span>
                                        <span>Profile</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}
                                {showEmployerBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employer/${currentUser.id}/jobpostingsList`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                            />
                                          </svg>
                                        </span>
                                        <span> Published Job Postings</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}
                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/profile`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                          </svg>
                                        </span>
                                        <span>Profile</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}

                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/appliedJobs`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                                            />
                                          </svg>
                                        </span>
                                        <span>Applied Job List</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}

                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/resumes`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                                            />
                                          </svg>
                                        </span>
                                        <span>Resume List</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}

                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/letters`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                            />
                                          </svg>
                                        </span>
                                        <span>Cover Letter List</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}

                                <Menu.Item
                                  as={Link}
                                  to="/profile"
                                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                >
                                  <div className="flex">
                                    <span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-3 h-3 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                    </span>
                                    <span>Settings</span>
                                  </div>
                                </Menu.Item>
                              </Menu>
                            </ul>
                          </details>
                        </li>
                      </div>
                    ) : (
                      <div>
                        <li className="list-none">
                          <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg pl-1 w-[296px] h-[64px] text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                              <span className="text-sm font-medium">
                                <img
                                  className="h-5 w-5 rounded-full object-cover"
                                  src={defaultProfilePhoto}
                                  alt="Profile"
                                />
                              </span>

                              <div className="mr-7">
                                <p className="block rounded-lg px-2 text-base font-semibold leading-7 text-gray-900">
                                  <strong className="block font-mulish font-medium">
                                    {currentUser.username}
                                  </strong>

                                  <span className="font-mulish font-medium text-gray-500 mr-1">
                                    {" "}
                                    {currentUser.email}
                                  </span>
                                </p>
                              </div>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                              <Menu>
                                {showEmployerBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employer/${currentUser.id}/profile`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                          </svg>
                                        </span>
                                        <span>Profile</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}
                                {showEmployerBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employer/${currentUser.id}/jobpostingsList`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                            />
                                          </svg>
                                        </span>
                                        <span> Published Job Postings</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}
                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/profile`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                          </svg>
                                        </span>
                                        <span>Profile</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}

                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/appliedJobs`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                                            />
                                          </svg>
                                        </span>
                                        <span>Applied Job List</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}

                                {showEmployeeBoard && (
                                  <li>
                                    <Menu.Item
                                      as={Link}
                                      to={`/employee/${currentUser.id}/resumes`}
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    >
                                      <div className="flex">
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-3 h-3 mr-2"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                                            />
                                          </svg>
                                        </span>
                                        <span>Resume List</span>
                                      </div>
                                    </Menu.Item>
                                  </li>
                                )}
                                <Menu.Item
                                  as={Link}
                                  to="/profile"
                                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                >
                                  <div className="flex">
                                    <span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-3 h-3 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                    </span>
                                    <span>Profile</span>
                                  </div>
                                </Menu.Item>
                              </Menu>
                            </ul>
                          </details>
                        </li>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div className="space-y-2 py-3">
                <Menu>
                  <Menu.Item
                    as={Link}
                    to="/"
                    onClick={() => {
                      setHomeActiveItem(0);
                      setFindJobsActiveItem(1);
                      setCompaniesActiveItem(1);
                      setPostJobActiveItem(1);
                      setAboutUsActiveItem(1);
                    }}
                    className={`-mx-3 block font-semibold leading-7 text-gray-600 px-4 py-2 text-base hover:text-gray-900 hover:border-l-[3px] ${
                      homeActiveItem === 0
                        ? "text-gray-900 border-l-[3px] border-l-[#5a2bdb] hover:border-l-[3px]"
                        : ""
                    }`}
                  >
                    Home
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    to="/jobPostings/listall"
                    onClick={() => {
                      setHomeActiveItem(1);
                      setFindJobsActiveItem(0);
                      setCompaniesActiveItem(1);
                      setPostJobActiveItem(1);
                      setAboutUsActiveItem(1);
                    }}
                    className={`-mx-3 block font-semibold leading-7 text-gray-600 px-4 py-2 text-base hover:text-gray-900 hover:border-l-[3px] hover:border-b-blue-gray-100 ${
                      findJobsActiveItem === 0
                        ? "text-gray-900 border-l-[3px] border-l-[#5a2bdb] hover:border-l-[3px]"
                        : ""
                    }`}
                  >
                    Find Jobs
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    to="/employers"
                    onClick={() => {
                      setHomeActiveItem(1);
                      setFindJobsActiveItem(1);
                      setCompaniesActiveItem(0);
                      setPostJobActiveItem(1);
                      setAboutUsActiveItem(1);
                    }}
                    className={`-mx-3 block font-semibold leading-7 text-gray-600 px-4 py-2 text-base hover:text-gray-900 hover:border-l-[3px] hover:border-b-blue-gray-100 ${
                      companiesActiveItem === 0
                        ? "text-gray-900 border-l-[3px] border-l-[#5a2bdb] hover:border-l-[3px]"
                        : ""
                    }`}
                  >
                    Companies
                  </Menu.Item>
                  {showEmployerBoard && currentUser && (
                    <Menu.Item
                      as={Link}
                      to={`/employer/${currentUser.id}/jobPosting/add`}
                      onClick={() => {
                        setHomeActiveItem(1);
                        setFindJobsActiveItem(1);
                        setCompaniesActiveItem(1);
                        setPostJobActiveItem(0);
                        setAboutUsActiveItem(1);
                      }}
                      className={`-mx-3 block font-semibold leading-7 text-gray-600 px-4 py-2 text-base hover:text-gray-900 hover:border-l-[3px] ${
                        postJobActiveItem === 0
                          ? "text-gray-900 border-l-[3px] border-l-[#5a2bdb] hover:border-l-[3px]"
                          : ""
                      }`}
                    >
                      Post a Job Ad
                    </Menu.Item>
                  )}
                  <Menu.Item
                    as={Link}
                    to="/aboutUs"
                    onClick={() => {
                      setHomeActiveItem(1);
                      setFindJobsActiveItem(1);
                      setCompaniesActiveItem(1);
                      setPostJobActiveItem(1);
                      setAboutUsActiveItem(0);
                    }}
                    className={`-mx-3 block font-semibold leading-7 text-gray-600 px-4 py-2 text-base hover:text-gray-900 hover:border-l-[3px] ${
                      aboutUsActiveItem === 0
                        ? "text-gray-900 border-l-[3px] border-l-[#5a2bdb] hover:border-l-[3px]"
                        : ""
                    }`}
                  >
                    About us
                  </Menu.Item>
                </Menu>
              </div>
              <div className="py-2">
                <Menu>
                  {currentUser ? (
                    <Menu.Item
                      onClick={() => logOut()}
                      as={Link}
                      to="/"
                      className="-mx-3 block px-4 py-3 text-base font-semibold leading-7 text-red-500 hover:text-red-500 hover:border-l-red-500 hover:border-l-[3px] hover:bg-red-50"
                    >
                      <div className="flex">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3 h-3 mr-2 mt-[4px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                          </svg>
                        </span>
                        <span>Log out</span>
                      </div>
                    </Menu.Item>
                  ) : (
                    <div>
                      <Menu.Item
                        as={Link}
                        to="/login"
                        className="-mx-3 block px-4 py-3 text-base font-semibold leading-7 text-gray-700 hover:text-gray-900 hover:border-l-green-500 hover:border-l-[3px] hover:bg-green-50"
                      >
                        Log in &rarr;
                      </Menu.Item>

                      <Menu.Item
                        as={Link}
                        onClick={handleSignUpClick}
                        className="-mx-3 block rounded-lg px-4 py-3 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50 active:text-gray-900"
                      >
                        Sign up
                      </Menu.Item>
                    </div>
                  )}
                </Menu>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
