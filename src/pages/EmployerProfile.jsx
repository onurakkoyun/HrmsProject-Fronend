import React, { useState, useEffect } from "react";
import ContentTitle from "../components/ContentTitle";
import { useSelector } from "react-redux";
import { Form, Formik, useFormik } from "formik";
import UserService from "../services/userService";
import EmployerService from "../services/employerService";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import axios from "axios";
import * as Yup from "yup";
import { Label } from "semantic-ui-react";
import ResumeSubmitPopup from "../components/ResumeSubmitPopup";

const userService = new UserService();
const employerService = new EmployerService();

export default function EmployerProfile() {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [employer, setEmployer] = useState({});
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({});
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (
      !currentUser ||
      (!currentUser.roles.includes("ROLE_EMPLOYER") &&
        !currentUser.roles.includes("ROLE_ADMIN"))
    ) {
      navigate("/unauthorized");
    } else {
      loadEmployer();
      axios
        .get("https://countriesnow.space/api/v0.1/countries")
        .then((response) => {
          const countryData = response.data.data;
          const countryList = countryData.map((country) => ({
            label: country.country,
            value: country.country,
          }));
          setCountries(countryList);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            console.error(
              "You do not have permission to access this resource. Please contact the administrator."
            );
          } else {
            console.error("Something went wrong. Please try again.");
          }
        });
    }
  }, [currentUser]);

  const initialValues = {
    id: currentUser.id,
    username: "",
    email: "",
    companyName: "",
    website: "",
    phoneNumber: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    setMessage("");
    setSuccess(false);

    const response = await employerService.updateProfile(values);
    if (response.data && response.data.message) {
      const message = {
        title: "Changes saved",
        content: response.data.message,
      };
      setMessage(message);
      setSuccess(response.data.success);
      setShowPopup(true);

      setFormSubmitted(true);

      setTimeout(() => {
        setShowPopup(false);
        setSuccess(false);
      }, 3000);
    } else {
      setMessage("Update failed");
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required Field"),
    email: Yup.string()
      .email("Not a valid email address")
      .required("Required Field"),
    companyName: Yup.string().required("Required Field"),
    website: Yup.string()
      .url("Not a valid website address")
      .required("Required Field"),
    phoneNumber: Yup.string()
      .matches(/^\d{11}$/, "Enter a valid phone number") // 10 haneli sayı olmalı
      .required("Required Field"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  const loadEmployer = async () => {
    try {
      const result = await employerService.getEmployerById(currentUser.id);
      const empData = result.data.data;

      if (
        id === currentUser.id.toString() ||
        currentUser.roles.includes("ROLE_ADMIN")
      ) {
        formik.setFieldValue("username", empData.username || "");
        formik.setFieldValue("email", empData.email || "");
        formik.setFieldValue("companyName", empData.companyName || "");
        formik.setFieldValue("website", empData.website || "");
        formik.setFieldValue("phoneNumber", empData.phoneNumber || "");

        setEmployer(empData);
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("An error occurred while loading employee data:", error);
    }
  };

  const handleUploadProfilePhoto = async () => {
    if (newProfilePhoto) {
      const formData = new FormData();
      formData.append("file", newProfilePhoto);

      const response = await userService.uploadUserPhotoById(
        currentUser.id,
        formData
      );

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData === "Profile photo uploaded successfully") {
          const blob = new Blob([responseData], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          setProfilePhoto(imageUrl);
          setShowUploadPopup(true);
          setIsUploadSuccess(true);

          const message = {
            title: "Changes saved",
            content: "Photo uploaded successfully",
          };
          setPopupMessage(message);

          setTimeout(() => {
            window.location.reload();
          }, 3000);

          const fileInput = document.getElementById("file-upload");
          if (fileInput) {
            fileInput.value = "";
          }
        } else {
          console.log(
            "Response verisi bir Blob veya File değil:",
            responseData
          );
        }
      } else {
        console.error("Profile photo upload failed:", response);
      }
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePhoto(file);
  };

  const showUpdateModal = () => {
    setIsUploadSuccess(true);
  };

  const handleDismissPopup = () => {
    setShowUploadPopup(false);
  };

  return (
    <main className="mt-8 mx-auto lg:px-[192px]">
      <div className="mr-8 w-full">
        <ContentTitle content={`Profile ${currentUser.username}`} />
      </div>
      <div className="max-w-screen-xl mx-auto px-4 text-gray-800 md:px-8 rounded-lg border-2 bg-white md:p-4 lg:p-6 shadow-xl max-w-screen-full sm:px-4">
        <div className="mt-4 max-w-2xl mx-auto">
          <div className="text-left text-lg font-mulish mb-5">
            <p className="text-xl font-bold leading-3 text-gray-900">
              Personal Informations
            </p>
            <p className="mt-1 text-[14.5px] leading-6 text-gray-900">
              Use a permanent address where you can receive mail.
            </p>
          </div>
          <Formik key={formSubmitted}>
            <Form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="text-left">
                <label className="text-md font-mulish font-bold">
                  Username
                </label>
                <div className="flex items-center">
                  <input
                    name="username"
                    type="username"
                    disabled
                    className="w-full mt-2 px-3 py-1 text-sm text-gray-900 bg-gray-50 outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg focus:ring-[0px] md:text-[14px] sm:leading-6"
                    onChange={(e) => handleChange("username", e.target.value)}
                    value={formik.values.username}
                  />
                </div>
                {formik.errors.username && formik.touched.username && (
                  <span>
                    <Label
                      basic
                      pointing
                      color="red"
                      className="orbitron"
                      content={formik.errors.username}
                    />
                  </span>
                )}
              </div>

              <div className="text-left">
                <label className="text-md font-mulish font-bold">Email</label>
                <div>
                  <input
                    type="email"
                    className="w-full md:w-2/3 mt-2 px-3 py-1 text-gray-900 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg focus:ring-[0px] md:text-[14px] sm:leading-6"
                    onChange={(e) => handleChange("email", e.target.value)}
                    value={formik.values.email}
                  />
                </div>
                <div className="flex justify-center">
                  <div className="w-1/2">
                    {formik.errors.email && formik.touched.email && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron inline-block"
                          content={formik.errors.email}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col justify-items-start items-center gap-y-5 gap-x-4 [&>*]:w-full sm:flex-row">
                  <div className="text-left">
                    <label className="text-md font-mulish font-bold">
                      Website
                    </label>
                    <input
                      type="text"
                      className="w-full mt-2 px-3 py-1 text-sm text-gray-900 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg focus:ring-[0px] md:text-[14px] sm:leading-6"
                      onChange={(e) => handleChange("website", e.target.value)}
                      value={formik.values.website}
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-md font-mulish font-bold">
                      Phone number
                    </label>
                    <input
                      type="number"
                      className="w-full mt-2 px-3 py-1 text-sm text-gray-900 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg focus:ring-[0px] md:text-[14px] sm:leading-6"
                      onChange={(e) =>
                        handleChange("phoneNumber", e.target.value)
                      }
                      value={formik.values.phoneNumber}
                    />
                  </div>
                </div>
                <div className="flex justify-around">
                  <div>
                    {formik.errors.website && formik.touched.website && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.website}
                        />
                      </span>
                    )}
                  </div>
                  <div>
                    {formik.errors.phoneNumber &&
                      formik.touched.phoneNumber && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.phoneNumber}
                          />
                        </span>
                      )}
                  </div>
                </div>
              </div>

              <div className="text-left">
                <label className="text-md font-mulish font-bold">
                  Company name
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="w-full mt-2 px-3 py-1 text-sm text-gray-900 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg focus:ring-[0px] md:text-[14px] sm:leading-6"
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                    value={formik.values.companyName}
                  />
                </div>
              </div>

              <div className="text-left">
                <label
                  htmlFor="photo"
                  className="text-md font-mulish font-bold"
                >
                  Company logo
                </label>
                <div className="flex flex-col sm:flex-row items-center">
                  {newProfilePhoto ? (
                    <div className="flex">
                      <img
                        alt="newProfilePhoto"
                        src={URL.createObjectURL(newProfilePhoto)}
                        className="h-6 w-6 text-gray-300 rounded-full object-cover"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="flex mt-1">
                      <div className="">
                        <img
                          alt="defaultProfilePhoto"
                          src={defaultProfilePhoto}
                          className="h-6 w-6 text-gray-300"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col text-left mt-4 ml-3">
                    <div className="flex flex-col sm:flex-row items-center space-x-4">
                      <div className="text-center mt-2">
                        <input
                          id="file-upload"
                          name="file-upload"
                          className="relative m-0 block w-[196px] min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                        />
                        <span className="text-xs font-bold text-gray-500">
                          (PNG, JPG, GIF up to 10MB)
                        </span>
                      </div>
                      <div className="text-left">
                        <button
                          type="button"
                          className="rounded-md bg-white px-[10px] py-[8px] text-sm font-mulish font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => {
                            handleUploadProfilePhoto();
                            showUpdateModal();
                            setNewProfilePhoto(null);
                          }}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                >
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
          {showPopup && (
            <ResumeSubmitPopup
              message={message}
              success={success}
              handleDismissPopup={handleDismissPopup}
            />
          )}
        </div>
      </div>
    </main>
  );
}
