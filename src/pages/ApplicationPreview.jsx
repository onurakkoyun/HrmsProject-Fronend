import React, { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import ApplyService from "../services/applyService";
import { useEffect } from "react";
import { useState } from "react";
import ExperienceService from "../services/experienceService";
import EducationService from "../services/educationService";
import LanguageService from "../services/languageService";
import SkillService from "../services/skillService";
import UserService from "../services/userService";
import GradientBackground from "../components/GradientBackground";
import { Menu, Transition } from "@headlessui/react";
import ApplicationInfo from "../components/ApplicationInfo";
import html2pdf from "html2pdf.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const userService = new UserService();
const applyServie = new ApplyService();
const experienceServie = new ExperienceService();
const educationServie = new EducationService();
const languageServie = new LanguageService();
const skillServie = new SkillService();

export default function ApplicationPreview() {
  const { applicationId } = useParams();
  const { resumeId } = useParams();
  const [application, setApplication] = useState({});
  const [coverLetter, setCoverLetter] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [employeePhoto, setEmployeePhoto] = useState("");

  useEffect(() => {
    applyServie.getApplicationById(applicationId).then((result) => {
      setApplication(result.data.data);
      setCoverLetter(result.data.data.coverLetter);
      loadEmployeePhoto(result.data.data.employee.id);
    });
    experienceServie.getExperiencesByResumeId(resumeId).then((result) => {
      setExperiences(result.data.data);
    });
    educationServie.getEducationsByResumeId(resumeId).then((result) => {
      setEducations(result.data.data);
    });
    languageServie.getLanguagesByResumeId(resumeId).then((result) => {
      setLanguages(result.data.data);
    });
    skillServie.getSkillsByResumeId(resumeId).then((result) => {
      setSkills(result.data.data);
    });
  }, []);

  const loadEmployeePhoto = async (employeeId) => {
    try {
      const response = await userService.getUserPhotoById(employeeId);

      if (response.status === 200) {
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setEmployeePhoto(imageUrl);
      }
    } catch (error) {
      console.error(
        "An error occurred while retrieving the profile photo.",
        error
      );
    }
  };

  const handleDownload = () => {
    const content = document.getElementById("downloadable-content");

    const options = {
      margin: 10,
      filename: `${application.resume?.resumeName}`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf(content, options);
  };

  return (
    <div className="">
      <GradientBackground id="downloadable-content" />
      <div className="relative mx-auto md:mx-auto lg:px-[256px] pt-6 pb-8 lg:mt-6">
        <div className="text-right">
          <div>
            <Menu as="div" className="relative inline-block text-left">
              <div className="w-4 h-4 rounded-full bg-gray-50">
                <Menu.Button>
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
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-[8px] p-[4px] z-10 w-[132px] origin-top-right divide-y-[1px] divide-gray-500/10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-[2px]">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleDownload}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block rounded-lg px-[22px] py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          )}
                        >
                          <div className="flex">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-3 h-3 mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
                                />
                              </svg>
                            </span>
                            <span>Download</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div id="downloadable-content">
          <ApplicationInfo
            employeePhoto={employeePhoto}
            application={application}
            coverLetter={coverLetter}
            experiences={experiences}
            educations={educations}
            languages={languages}
            skills={skills}
          />
        </div>
      </div>
    </div>
  );
}
