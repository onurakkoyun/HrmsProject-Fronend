import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../actions/message";
import { logout } from "../actions/auth";
import SignUp from "../components/SignUp";
import { Link } from "react-router-dom";
import "../App.css";
import { Menu, Container, Header, Dropdown, Icon } from "semantic-ui-react";
import { Button } from "@material-tailwind/react";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import UserService from "../services/userService";

const Navi = () => {
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

  const logOut = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    loadUserPhoto();
    if (currentUser) {
      console.log(currentUser);
      setShowEmployeeBoard(currentUser.roles.includes("ROLE_EMPLOYEE"));
      setShowEmployerBoard(currentUser.roles.includes("ROLE_EMPLOYER"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowEmployeeBoard(false);
      setShowEmployerBoard(false);
      setShowAdminBoard(false);
    }
  }, [currentUser]);

  const loadUserPhoto = async () => {
    try {
      let userService = new UserService();
      const response = await userService.getUserPhotoById(currentUser.id);

      if (response.status === 200) {
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfilePhoto(imageUrl);
      }
    } catch (error) {
      console.error(
        "Profil fotoğrafı alınırken bir hata oluştu.",
        error.response // Daha fazla ayrıntı için yanıtı logla
      );
    }
  };

  return (
    <div>
      <Menu className="nav-menu" borderless fixed="top" color="teal">
        <Container>
          <Menu.Item className="nav-menu-item" position="left" as={Link} to="/">
            <Header
              as="h4"
              color="blue"
              icon="newspaper outline"
              content="HRMS"
            />
          </Menu.Item>
          <Menu.Item
            className="nav-menu-item"
            as={Link}
            to="/home"
            icon="sun"
            content="Home"
          />
          <Menu.Item
            className="nav-menu-item"
            as={Link}
            to="/jobPostings/listall"
            icon="compass"
            content="Find Jobs"
          />

          <Menu.Item
            className="nav-menu-item"
            as={Link}
            to="/employers"
            icon="building"
            content="Companies"
          />
          {showEmployerBoard && currentUser && (
            <Menu.Item
              className="nav-menu-item"
              as={Link}
              to={`employer/${currentUser.id}/jobPosting/add`}
              icon="paper plane"
              content="Post a Job"
            />
          )}

          <Menu.Item
            className="nav-menu-item"
            as={Link}
            to="/aboutUs"
            icon="heart"
            content="About Us"
          />
          <Menu.Menu position="right">
            {currentUser ? (
              <>
                <div className="mt-2">
                  <p className="ms-2 mr-1 hidden text-left text-xs sm:block">
                    <strong className="block font-medium">
                      {currentUser.username}
                    </strong>

                    <span className="text-gray-500 mr-1">
                      {" "}
                      {currentUser.email}
                    </span>
                  </p>
                </div>
                <Dropdown
                  trigger={
                    <div className="mt-2 rounded-full border-2 border-blue-500">
                      <button
                        type="button"
                        className="group flex shrink-0 items-left rounded-lg transition"
                      >
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
                      </button>
                    </div>
                  }
                  icon={{ icon: "null" }}
                >
                  <Dropdown.Menu>
                    <Dropdown.Header>
                      Logged in as {currentUser.username}
                    </Dropdown.Header>

                    {showEmployeeBoard && (
                      <Dropdown.Item
                        as={Link}
                        to={`/employee/${currentUser.id}/profile`}
                      >
                        <Icon name="user circle" />
                        Profile
                      </Dropdown.Item>
                    )}
                    {showEmployerBoard && (
                      <Dropdown.Item
                        as={Link}
                        to={`/employer/${currentUser.id}/profile`}
                      >
                        <Icon name="user circle" />
                        Profile
                      </Dropdown.Item>
                    )}
                    {showEmployerBoard && (
                      <Dropdown.Item
                        as={Link}
                        to={`/employer/${currentUser.id}/jobpostings`}
                      >
                        <Icon name="user circle" />
                        Published Job Postings
                      </Dropdown.Item>
                    )}
                    {showAdminBoard && (
                      <Dropdown.Item
                        as={Link}
                        to={`/admin/${currentUser.id}/profile`}
                      >
                        <Icon name="user circle" />
                        Profile
                      </Dropdown.Item>
                    )}
                    {showEmployeeBoard && (
                      <Dropdown.Item
                        as={Link}
                        to={`/employee/${currentUser.id}/resumes`}
                      >
                        <Icon name="address card" />
                        Resume List
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item>
                      <Icon name="help" />
                      Help
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Icon name="settings" />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logOut}>
                      <Icon name="sign-out alternate" />
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Menu.Item>
                    <Link to="/login">
                      <Button
                        variant="text"
                        size="sm"
                        className="rounded-full text-sm"
                      >
                        Log in
                      </Button>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
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
                  </Menu.Item>
                </div>
              </>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  );
};

export default Navi;
