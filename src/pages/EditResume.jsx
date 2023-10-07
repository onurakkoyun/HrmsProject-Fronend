import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserService from "../services/userService";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import ResumeSubmitPopup from "../components/ResumeSubmitPopup";
import ResumeService from "../services/resumeService";
import ExperienceService from "../services/experienceService";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Label } from "semantic-ui-react";
import NewExperiencePopup from "../components/NewExperiencePopup";

const userService = new UserService();
const resumeService = new ResumeService();
const experienceService = new ExperienceService();

function calculateExperienceDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffInMilliseconds = Math.abs(end - start);
  const years = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365);
  const yearsRoundDown = Math.floor(years);
  const months = (years - yearsRoundDown) * 12;
  const monthsRoundDown = Math.floor(months);

  if (yearsRoundDown >= 1) {
    return `${yearsRoundDown} ${
      yearsRoundDown === 1 ? "year" : "years"
    } ${monthsRoundDown} ${monthsRoundDown === 1 ? "month" : "months"}`;
  } else {
    return `${monthsRoundDown} ${monthsRoundDown === 1 ? "month" : "months"}`;
  }
}

export default function Resumes() {
  const { resumeId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [resume, setResume] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [newExperinceAdded, setNewExperinceAdded] = useState(false);

  const [countries, setCountries] = useState([]);
  const [showMilitaryStatus, setShowMilitaryStatus] = useState(false);
  const [showPostponedDate, setShowPostponedDate] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState("");
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [popupMessage, setPopupMessage] = useState({});
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [isNewExperienceModalOpen, setIsNewExperienceModalOpen] =
    useState(false);
  const [newExperienceAdded, setNewExperienceAdded] = useState(false);

  useEffect(() => {
    experienceService.getExperiencesByResumeId(resumeId).then((result) => {
      setExperiences(result.data.data);
    });
    if (newExperienceAdded) {
      setNewExperienceAdded(false);
    }
  }, [resumeId, newExperienceAdded]);

  const deleteExperience = async (experienceId) => {
    try {
      await experienceService.deleteExperience(experienceId);
      // Resume başarıyla silindiğinde, silinen resume'yi frontend listesinden kaldırın
      setExperiences((prevExperiences) =>
        prevExperiences.filter(
          (experience) => experience.experienceId !== experienceId
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the experience.", error);
    }
  };

  const handleCreateNewExperienceClick = () => {
    setIsNewExperienceModalOpen(true);
  };

  const validationSchema = Yup.object().shape({
    militaryStatus: Yup.string().when("gender", {
      is: "Male",
      then: () => Yup.string().required("Military status is required!"),
    }),
    postponedDate: Yup.date().when("militaryStatus", {
      is: "Postponed",
      then: () => Yup.date().required("Postponed date is required!"),
    }),
  });

  const onSubmit = async (values, { resetForm }) => {
    setMessage("");
    setSuccess(false);
    const { firstName, lastName, resume } = values;

    try {
    } catch (error) {
      setMessage("An error occurred while registering");
    }
  };

  const initialValues = {
    resumeId: { id: resumeId },
    jobTitle: "",
    gender: "",
    militaryStatus: "",
    postponedDate: "",
    linkedinAddress: "",
    githubAddress: "",
    personalWebsite: "",
    country: "",
    province: "",
    city: "",
    address: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);

    if (fieldName === "gender") {
      // Eğer "Male" seçildiyse askerlik durumu için select bileşenini göster
      if (value === "Male") {
        setShowMilitaryStatus(true);
        setShowPostponedDate(formik.values.militaryStatus === "Postponed");
      } else {
        setShowMilitaryStatus(false);
        setShowPostponedDate(false);
        formik.setFieldValue("militaryStatus", "");
        formik.setFieldValue("postponedDate", null);
      }
    } else if (fieldName === "militaryStatus") {
      // "Postponed" seçeneği seçildiğinde date bileşenini göster
      if (value === "Postponed") {
        setShowPostponedDate(true);
      } else {
        setShowPostponedDate(false);
        formik.setFieldValue("postponedDate", "");
      }
    }
  };

  const loadResume = async () => {
    try {
      const result = await resumeService.getResumeById(resumeId);
      const resumeData = result.data.data;

      formik.setFieldValue("jobTitle", resumeData.jobTitle || "");
      formik.setFieldValue("gender", resumeData.gender || "");
      formik.setFieldValue("militaryStatus", resumeData.militaryStatus || "");
      formik.setFieldValue("postponedDate", resumeData.postponedDate || "");
      formik.setFieldValue("linkedinAddress", resumeData.linkedinAddress || "");
      formik.setFieldValue("githubAddress", resumeData.githubAddress || "");
      formik.setFieldValue("personalWebsite", resumeData.personalWebsite || "");
      formik.setFieldValue("country", resumeData.country || "");
      formik.setFieldValue("country", resumeData.country || "");
      formik.setFieldValue("province", resumeData.province || "");
      formik.setFieldValue("city", resumeData.city || "");
      formik.setFieldValue("address", resumeData.address || "");

      if (resumeData.gender === "Male") {
        setShowMilitaryStatus(true);
        if (resumeData.militaryStatus === "Postponed") {
          setShowPostponedDate(true);
        }
      }

      setResume(resumeData);
    } catch (error) {
      console.error("An error occurred while loading resume data:", error);
    }
  };

  useEffect(() => {
    loadResume();
    loadProfilePhoto();
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((response) => {
        // Extract the list of countries from the API response
        const countryData = response.data.data;
        const countryList = countryData.map((country) => ({
          label: country.country,
          value: country.country,
        }));
        // Set the list of countries to the state variable
        setCountries(countryList);
      })
      .catch((error) => {
        console.error("Error fetching countries data:", error);
      });
  }, []);

  const loadProfilePhoto = async () => {
    try {
      const response = await userService.getUserPhotoById(currentUser.id);

      if (response.status === 200) {
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfilePhoto(imageUrl);
      }
    } catch (error) {
      console.error(
        "An error occurred while retrieving the profile photo.",
        error
      );
    }
  };
  const handleUploadProfilePhoto = async () => {
    // Yeni profil fotoğrafını yükleme işlemi
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
          // Burada Blob veya File nesnesiyle çalışabilirsiniz

          const blob = new Blob([responseData], { type: "image/jpeg" }); // responseData'i uygun türde bir Blob nesnesine dönüştürün
          const imageUrl = URL.createObjectURL(blob); // Blob nesnesini kullanarak URL oluşturun
          setProfilePhoto(imageUrl); // Profil fotoğrafını ayarlayın
          loadProfilePhoto();
          setShowUploadPopup(true);
          setIsUploadSuccess(true);

          const message = {
            title: "Changes saved",
            content: "Photo uploaded successfully",
          };
          setPopupMessage(message);

          const fileInput = document.getElementById("file-upload");
          if (fileInput) {
            fileInput.value = ""; // Reset the file input value
          }
        } else {
          console.log(
            "Response verisi bir Blob veya File değil:",
            responseData
          );
          // Hata durumunu ele alabilirsiniz
        }
      } else {
        console.error("Profile photo upload failed:", response);
        // Hata durumunu ele alabilirsiniz
      }
    }
  };

  const handleProfilePhotoChange = (e) => {
    // Kullanıcı yeni profil fotoğrafını seçtiğinde bu fonksiyon çağrılır
    const file = e.target.files[0];
    setNewProfilePhoto(file);
  };

  const handleDismissPopup = () => {
    setShowUploadPopup(false);
  };

  const showUpdateModal = () => {
    setIsUploadSuccess(true);
  };

  return (
    <div className="p-2 bg-gray-50">
      <br />
      <br />
      <Formik>
        <Form onSubmit={formik.handleSubmit}>
          <div className="mx-auto md:mx-auto lg:px-[256px]">
            <section className="rounded-lg bg-white sm:p-2 md:p-4 lg:p-8 shadow-xl hover:border-dashed border-2 hover:border-gray-500 justify-items-center mt-3 max-w-screen-full mx-auto px-4 md:px-8 sm:px-4">
              <div className="flex flex-col md:flex-row gap-4 rounded-xl p-3 mb-5 shadow-xl border">
                <div className="rounded-full grid grid-rows-2 h-8 w-8 md:h-9 md:w-9 border-[3px] border-blue-200 p-[3px]">
                  {profilePhoto ? (
                    <img
                      className="rounded-full w-auto h-auto"
                      src={profilePhoto}
                      alt="Profile"
                    />
                  ) : (
                    <img
                      className="rounded-full w-auto h-auto"
                      src={defaultProfilePhoto}
                      alt="Profile"
                    />
                  )}
                </div>

                <ul className="flex flex-col sm:grid-cols-3">
                  <li
                    key="firstNameAndlastName"
                    className="text-left text-xl font-bold"
                  >
                    {resume.employee?.firstName} {resume.employee?.lastName}
                  </li>
                  <li key="email" className="text-left mt-2">
                    <span className="text-sm text-gray-500">
                      E-mail Address
                    </span>
                    <div className="font-bold">{currentUser.email}</div>
                  </li>

                  <li key="phoneNumber" className="text-left mt-2">
                    <span className="text-sm text-gray-500">Phone</span>
                    <div className="font-bold">{currentUser.phoneNumber}</div>
                  </li>
                </ul>
              </div>

              <div className="divide-y space-y-3">
                <div className="px-2 py-2">
                  <div className="flex flex-row gap-5 sm:grid-cols-1 mt-4">
                    <div className="w-3/5">
                      {" "}
                      <h3 className="text-left font-semibold mb-4">
                        Private Information
                      </h3>
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="Job Title"
                        >
                          Job title
                        </label>
                        <input
                          name="jobTitle"
                          type="text"
                          onChange={(e) =>
                            handleChange("jobTitle", e.target.value)
                          }
                          value={formik.values.jobTitle}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                          placeholder="Job Title"
                        />
                      </div>
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="Gender"
                        >
                          Gender
                        </label>
                        <select
                          name="gender"
                          onChange={(e) =>
                            handleChange("gender", e.target.value)
                          }
                          value={formik.values.gender}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="I don't wish to answer">
                            I don't wish to answer
                          </option>
                        </select>
                      </div>
                      {showMilitaryStatus && (
                        <div className="relative mb-3">
                          <label
                            className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                            htmlFor="Military status"
                          >
                            Military status
                          </label>
                          <select
                            name="militaryStatus"
                            onChange={(e) =>
                              handleChange("militaryStatus", e.target.value)
                            }
                            value={formik.values.militaryStatus}
                            className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                          >
                            <option value="">Select military status</option>
                            <option value="Completed">Completed</option>
                            <option value="Exempted">Exempted</option>
                            <option value="Postponed">Postponed</option>
                            <option value="Not Applicable">
                              Not Applicable
                            </option>
                          </select>
                          {formik.errors.militaryStatus &&
                            formik.touched.militaryStatus && (
                              <span>
                                <Label
                                  basic
                                  pointing
                                  color="red"
                                  className="orbitron"
                                  content={formik.errors.militaryStatus}
                                />
                                <br />
                              </span>
                            )}
                        </div>
                      )}
                      {showPostponedDate && (
                        <div className="relative mb-3">
                          <label
                            className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                            htmlFor="Postponed date"
                          >
                            Postponed date
                          </label>
                          <input
                            type="date"
                            name="postponedDate"
                            onChange={(e) =>
                              handleChange("postponedDate", e.target.value)
                            }
                            value={formik.values.postponedDate}
                            className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                            min={new Date().toISOString().split("T")[0]}
                          />
                          {formik.errors.postponedDate &&
                            formik.touched.postponedDate && (
                              <span>
                                <Label
                                  basic
                                  pointing
                                  color="red"
                                  className="orbitron"
                                  content={formik.errors.postponedDate}
                                />
                                <br />
                              </span>
                            )}
                        </div>
                      )}
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="Country"
                        >
                          Country
                        </label>
                        <select
                          name="country"
                          onChange={(event, data) =>
                            handleChange("country", data.value)
                          }
                          value={formik.values.country}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                        >
                          <option value="">Select A Country...</option>
                          {countries.map((country, index) => (
                            <option key={index + 1} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex">
                        <div className="w-1/2 relative mb-3">
                          <label
                            className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                            htmlFor="province"
                          >
                            Province/State
                          </label>
                          <input
                            name="province"
                            type="text"
                            onChange={(e) =>
                              handleChange("province", e.target.value)
                            }
                            value={formik.values.province}
                            className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                            placeholder="Province or State"
                          />
                        </div>
                        <div className="w-1/2 relative mb-3 ml-1">
                          <label
                            className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                            htmlFor="city"
                          >
                            City/Town
                          </label>
                          <input
                            name="city"
                            type="text"
                            onChange={(e) =>
                              handleChange("city", e.target.value)
                            }
                            value={formik.values.city}
                            className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                            placeholder="City or Town"
                          />
                        </div>
                      </div>
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="address"
                        >
                          Address Line
                        </label>
                        <input
                          name="address"
                          type="text"
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          value={formik.values.address}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                          placeholder="Address line"
                        />
                      </div>
                    </div>
                    <div className="w-2/5">
                      <h3 className="text-left font-semibold mb-4">
                        Social Media Information
                      </h3>
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="email"
                        >
                          Linkedin
                        </label>
                        <input
                          name="linkedin"
                          type="text"
                          onChange={(e) =>
                            handleChange("linkedinAddress", e.target.value)
                          }
                          value={formik.values.linkedinAddress}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-6 pe-12 text-md shadow-sm"
                          placeholder="linkedin.com/in/username"
                        />
                        <span className="mt-2 absolute right-3 inset-y-0 my-auto active:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 448 512"
                            className="w-3 h-3"
                          >
                            <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                          </svg>
                        </span>
                      </div>
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="gitHub"
                        >
                          GitHub
                        </label>
                        <input
                          name="gitHub"
                          type="text"
                          onChange={(e) =>
                            handleChange("githubAddress", e.target.value)
                          }
                          value={formik.values.githubAddress}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-6 pe-12 text-md shadow-sm"
                          placeholder="github.com/username"
                        />
                        <span className="mt-2 ml-4 absolute right-3 inset-y-0 my-auto active:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="0.625em"
                            viewBox="0 0 496 512"
                            className="w-3 h-3"
                          >
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                          </svg>
                        </span>
                      </div>

                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="webSite"
                        >
                          Personal Website
                        </label>
                        <input
                          name="website"
                          type="text"
                          onChange={(e) =>
                            handleChange("personalWebsite", e.target.value)
                          }
                          value={formik.values.personalWebsite}
                          className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-6 pe-12 text-md shadow-sm"
                          placeholder="mypersonalwebsite.com"
                        />
                        <span className="mt-2 ml-4 absolute right-3 inset-y-0 my-auto active:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 640 512"
                            className="w-3 h-3"
                          >
                            <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 mt-6">
                    <h3 htmlFor="photo" className="text-left font-semibold">
                      Profile photo
                    </h3>
                    <div className="mt-2 flex flex-col">
                      {newProfilePhoto ? (
                        <div className="flex">
                          <img
                            src={URL.createObjectURL(newProfilePhoto)}
                            className="h-6 w-6 text-gray-300 rounded-full object-cover"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <div className="flex">
                          <div className="">
                            <img
                              src={defaultProfilePhoto}
                              className="h-6 w-6 text-gray-300"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col text-left mt-4">
                        <div className="flex flex-row space-x-4">
                          <div className="mt-2 mb-1">
                            <input
                              id="file-upload"
                              name="file-upload"
                              className="relative m-0 block w-[196px] min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePhotoChange}
                            />
                          </div>
                          <div className="text-left">
                            <div className="text-left">
                              <button
                                type="button"
                                className="rounded-md bg-white mt-1 px-[10px] py-[8px] text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                        <div>
                          {" "}
                          <span className="text-xs font-bold text-gray-500">
                            (PNG, JPG, GIF up to 10MB)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="gap-2 px-3 py-2 text-white bg-blue-400 rounded-full duration-150 hover:bg-blue-600 active:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </section>
          </div>
          <div className="mt-3 mx-auto md:mx-auto lg:px-[256px]">
            <section className="rounded-lg bg-white sm:p-2 md:p-4 lg:p-8 shadow-xl hover:border-dashed border-2 hover:border-gray-500 justify-items-center mt-3 max-w-screen-full mx-auto px-4 md:px-8 sm:px-4">
              <div>
                <h3 className="text-left font-semibold">Job Experiences</h3>
              </div>
              <div className="mt-5">
                {experiences.length === 0 ? (
                  <div>
                    <p className="inline-flex items-center rounded-full bg-yellow-50 px-9.5 py-2 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      No any experience added yet
                    </p>
                  </div>
                ) : (
                  <div>
                    {experiences.map((experience) => (
                      <div
                        key={experience.experienceId}
                        className="relative flex flex-col md:flex-row gap-4 rounded-xl p-3 border group mb-3"
                      >
                        <button
                          type="button"
                          className="absolute top-1 rounded-full right-1 group-hover:opacity-100 opacity-0 hover:cursor-pointer hover:text-red-500"
                          onClick={() =>
                            deleteExperience(experience.experienceId)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="absolute bottom-1 right-1 group-hover:opacity-100 opacity-0 hover:cursor-pointer hover:text-green-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>

                        <div className="flex flex-col">
                          <div className="mb-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 ml-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                              />
                            </svg>
                          </div>
                          <div className="w-[64px] text-left">
                            <div className="text-sm text-gray-500">
                              Duration
                            </div>
                            {calculateExperienceDuration(
                              experience.experienceStart,
                              experience.experienceEnd
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3">
                          <ul className="flex flex-row sm:grid-rows-1 mb-3">
                            <li key="positionName" className="text-left">
                              <div className="text-sm text-gray-500">Title</div>
                              <div className="font-bold">
                                {experience.jobTitle.jobTitleName}
                              </div>
                            </li>
                          </ul>

                          <ul className="flex flex-row sm:grid-rows-1 mb-3">
                            <li className="w-[232px] text-left">
                              <div className="text-sm text-gray-500">
                                Company Name
                              </div>
                              <div className="font-bold">
                                {experience.companyName}
                              </div>
                            </li>
                            <li className="w-[232px] text-left">
                              <div className="text-sm text-gray-500">City</div>
                              <div className="font-bold">
                                {experience.cityName}
                              </div>
                            </li>
                            <li className="w-[232px] text-left">
                              <div className="text-sm text-gray-500">
                                Company Sector
                              </div>
                              <div className="font-bold">
                                {experience.companySector}
                              </div>
                            </li>
                          </ul>

                          <ul className="flex flex-row sm:grid-rows-1 mb-3">
                            <li className="w-[232px] text-left">
                              <div className="text-sm text-gray-500">
                                Start Date
                              </div>
                              <div className="font-bold">
                                {experience.experienceStart}
                              </div>
                            </li>
                            <li className="w-[232px] text-left">
                              <div className="text-sm text-gray-500">
                                Ending Date
                              </div>
                              <div className="font-bold">
                                {experience.experienceEnd}
                              </div>
                            </li>
                            <li className="text-left">
                              <div className="text-sm text-gray-500">
                                Working Type
                              </div>
                              <div className="font-bold">
                                {experience.workingType.typeName}
                              </div>
                            </li>
                          </ul>

                          <ul className="flex flex-row sm:grid-rows-1 mr-2">
                            <li className="w-full text-left">
                              <div className="text-sm text-gray-500 mb-1">
                                Job Definition
                              </div>
                              <div
                                className=""
                                dangerouslySetInnerHTML={{
                                  __html: experience.jobDescription,
                                }}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleCreateNewExperienceClick}
                    className="grid justify-items-center mt-2 mb-2 rounded-lg border-2 border-dashed border-gray-900/25 active:border-cyan-500 px-[86px] py-[8px] sm:px-[136px] sm:py-[16px]"
                  >
                    <span className="flex text-center text-md leading-6 text-green-500">
                      + &nbsp;&nbsp;Add New Experience
                    </span>
                  </button>
                  <NewExperiencePopup
                    open={isNewExperienceModalOpen}
                    setOpen={setIsNewExperienceModalOpen}
                    showPopupCallback={() => {
                      setShowPopup(true);
                      setNewExperienceAdded(true);
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </Form>
      </Formik>
      {showUploadPopup && (
        <ResumeSubmitPopup
          message={popupMessage}
          handleDismissPopup={handleDismissPopup}
        />
      )}
    </div>
  );
}
