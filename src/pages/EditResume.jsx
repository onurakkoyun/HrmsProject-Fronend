import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/userService";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import ResumeSubmitPopup from "../components/ResumeSubmitPopup";
import ResumeService from "../services/resumeService";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "semantic-ui-react";
import ExperiencesList from "./ExperiencesList";
import EducationsList from "./EducationsList";
import LanguagesList from "./LanguagesList";
import SkillsList from "./SkillsList";

const userService = new UserService();
const resumeService = new ResumeService();

export default function EditResume() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { resumeId } = useParams();
  let navigate = useNavigate();
  const [resume, setResume] = useState({});
  const [showMilitaryStatus, setShowMilitaryStatus] = useState(false);
  const [showPostponedDate, setShowPostponedDate] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [popupMessage, setPopupMessage] = useState({});
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (
      !currentUser ||
      (!currentUser.roles.includes("ROLE_EMPLOYEE") &&
        !currentUser.roles.includes("ROLE_ADMIN"))
    ) {
      navigate("/unauthorized");
    } else {
      loadResume();
      loadProfilePhoto();
    }
  }, []);

  const drivingLicenceOptions = [
    "None",
    "A",
    "A1",
    "A2",
    "B",
    "B2",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "K",
    "International driver's license",
  ];

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

    const response = await resumeService.updateResume(values);
    if (response.data && response.data.message) {
      const message = {
        title: "Changes saved",
        content: response.data.message,
      };
      setMessage(message);
      setSuccess(response.data.success);
      setShowPopup(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 3000);
    } else {
      setMessage("Update failed");
    }
  };

  const initialValues = {
    resumeId: resumeId,
    jobTitle: "",
    gender: "",
    drivingLicence: "",
    militaryStatus: "",
    postponedDate: "",
    linkedinAddress: "",
    githubAddress: "",
    personalWebsite: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);

    if (fieldName === "gender") {
      if (value === "Male") {
        setShowMilitaryStatus(true);
        setShowPostponedDate(formik.values.militaryStatus === "Postponed");
      } else {
        setShowMilitaryStatus(false);
        setShowPostponedDate(false);
        formik.setFieldValue("militaryStatus", "");
        formik.setFieldValue("postponedDate", "");
      }
    } else if (fieldName === "militaryStatus") {
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

      if (
        resumeData.employee?.id === currentUser.id ||
        currentUser.roles.includes("ROLE_ADMIN")
      ) {
        formik.setFieldValue("jobTitle", resumeData.jobTitle || "");
        formik.setFieldValue("gender", resumeData.gender || "");
        formik.setFieldValue("drivingLicence", resumeData.drivingLicence || "");
        formik.setFieldValue("militaryStatus", resumeData.militaryStatus || "");
        formik.setFieldValue("postponedDate", resumeData.postponedDate || "");
        formik.setFieldValue(
          "linkedinAddress",
          resumeData.linkedinAddress || ""
        );
        formik.setFieldValue("githubAddress", resumeData.githubAddress || "");
        formik.setFieldValue(
          "personalWebsite",
          resumeData.personalWebsite || ""
        );

        if (resumeData.gender === "Male") {
          setShowMilitaryStatus(true);
          if (resumeData.militaryStatus === "Postponed") {
            setShowPostponedDate(true);
          }
        }

        setResume(resumeData);
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("An error occurred while loading resume data:", error);
    }
  };

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

  const handleDismissPopup = () => {
    setShowUploadPopup(false);
  };

  return (
    <div className="p-2 mt-5 bg-gray-50">
      <Formik>
        <Form onSubmit={formik.handleSubmit}>
          <div className="mx-auto md:mx-auto lg:px-[256px] mt-8 lg:mt-6">
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

                <ul className="font-mulish font-medium flex flex-col sm:grid-cols-3">
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
                    <div className="font-bold">
                      {resume.employee?.phoneNumber}
                    </div>
                  </li>

                  <li key="adressLine" className="text-left mt-2">
                    {resume.employee?.country ||
                    resume.employee?.province ||
                    resume.employee?.city ? (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Address</span>

                        <div className="font-bold text-sm">
                          {resume.employee?.address ? (
                            <span>{resume.employee?.address}&nbsp;</span>
                          ) : null}
                        </div>
                        <div className="font-bold text-sm">
                          {resume.employee?.city ? (
                            <span>{resume.employee?.city}&nbsp;</span>
                          ) : null}
                          {resume.employee?.province ? (
                            <span>{resume.employee?.province}&nbsp;</span>
                          ) : null}
                          {resume.employee?.postalCode ? (
                            <span>{resume.employee?.postalCode}&nbsp;</span>
                          ) : null}
                          {resume.employee?.country ? (
                            <span>{resume.employee?.country}&nbsp;</span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </li>
                </ul>
              </div>

              <div className="divide-y space-y-3">
                <div className="px-2 py-2">
                  <div className="font-mulish flex flex-row gap-5 sm:grid-cols-1 mt-4">
                    <div className="w-3/5">
                      <h3 className="text-left font-mulish font-semibold mb-4">
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
                      <div className="flex">
                        <div className="w-1/2 relative mb-3">
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
                        <div className="w-1/2 relative ml-1 mb-3">
                          <label
                            className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                            htmlFor="Gender"
                          >
                            Driving Licence
                          </label>
                          <select
                            name="drivingLicence"
                            onChange={(e) =>
                              handleChange("drivingLicence", e.target.value)
                            }
                            value={formik.values.drivingLicence}
                            className="w-full rounded-lg border-2 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                          >
                            <option value="">Select Driving Licence</option>

                            {drivingLicenceOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
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
                      <h3 className="text-left font-mulish font-semibold mb-4 mt-6">
                        Social Media Information
                      </h3>
                      <div className="relative mb-3">
                        <label
                          className="grid justify-items-start text-sm font-bold ml-0.5 mb-1"
                          htmlFor="linkedin"
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
                          Github
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
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="font-mulish font-medium gap-2 px-3 py-2 text-white bg-blue-400 rounded-full duration-150 hover:bg-blue-600 active:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </section>
          </div>
          <ExperiencesList resumeId={resumeId} />
          <EducationsList resumeId={resumeId} />
          <LanguagesList resumeId={resumeId} />
          <SkillsList resumeId={resumeId} />
        </Form>
      </Formik>
      {showUploadPopup && (
        <ResumeSubmitPopup
          message={popupMessage}
          success={isUploadSuccess}
          handleDismissPopup={handleDismissPopup}
        />
      )}
      {success && (
        <ResumeSubmitPopup
          message={message}
          success={success}
          handleDismissPopup={handleDismissPopup}
        />
      )}
    </div>
  );
}
