import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ExperienceService from "../services/experienceService";
import NewExperiencePopup from "../components/NewExperiencePopup";
import EditExperiencePopup from "../components/EditExperiencePopup";

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

const experienceService = new ExperienceService();

export default function ExperiencesList({ resumeId }) {
  const [experiences, setExperiences] = useState([]);
  const [experienceId, setExperienceId] = useState("");
  const [isNewExperienceModalOpen, setIsNewExperienceModalOpen] =
    useState(false);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] =
    useState(false);
  const [newExperienceAdded, setNewExperienceAdded] = useState(false);
  const [experienceUpdated, setExperienceUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    experienceService.getExperiencesByResumeId(resumeId).then((result) => {
      setExperiences(result.data.data);
    });
    if (newExperienceAdded) {
      setNewExperienceAdded(false);
    }
    if (experienceUpdated) {
      setExperienceUpdated(false);
    }
  }, [resumeId, newExperienceAdded, experienceUpdated]);

  const handleCreateNewExperienceClick = () => {
    setIsNewExperienceModalOpen(true);
  };

  const handleUpdateExperienceClick = (id) => {
    setExperienceId(id);
    setIsEditExperienceModalOpen(true);
  };

  const deleteExperience = async (experienceId) => {
    try {
      await experienceService.deleteExperience(experienceId);
      setExperiences((prevExperiences) =>
        prevExperiences.filter(
          (experience) => experience.experienceId !== experienceId
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the experience.", error);
    }
  };

  return (
    <div>
      <div className="mt-3 mx-auto md:mx-auto lg:px-[256px]">
        <section className="rounded-lg tracking-wide bg-white sm:p-2 md:p-4 lg:p-8 shadow-xl hover:border-dashed border-2 hover:border-gray-500 justify-items-center mt-3 max-w-screen-full mx-auto px-4 md:px-8 sm:px-4">
          <div>
            <h3 className="text-left font-mulish font-semibold">
              Job Experiences
            </h3>
          </div>
          <div className="mt-5">
            {experiences.length === 0 ? (
              <div>
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-yellow-50 px-8.5 py-2 text-md text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  No any experience added yet
                </p>
              </div>
            ) : (
              <div>
                {experiences.map((experience) => (
                  <div
                    key={experience.experienceId}
                    className="relative font-mulish font-medium flex flex-col md:flex-row gap-5 rounded-xl p-3 border group mb-3 hover:border-green-400"
                  >
                    <button
                      type="button"
                      className="absolute top-1 rounded-full right-1 group-hover:opacity-100 opacity-0 hover:cursor-pointer hover:text-red-500"
                      onClick={() => deleteExperience(experience.experienceId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 group-hover:opacity-100 opacity-0 hover:cursor-pointer hover:text-green-500"
                      onClick={() =>
                        handleUpdateExperienceClick(experience.experienceId)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <EditExperiencePopup
                      experienceId={experienceId}
                      open={isEditExperienceModalOpen}
                      setOpen={setIsEditExperienceModalOpen}
                      showPopupCallback={() => {
                        setShowPopup(true);
                        setExperienceUpdated(true);
                      }}
                    />

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
                      <div className="w-[72px] text-left">
                        <div className="text-sm text-gray-500">Duration</div>
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
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Company Name
                          </div>
                          <div className="font-bold">
                            {experience.companyName}
                          </div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">City</div>
                          <div className="font-bold">{experience.cityName}</div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Company Sector
                          </div>
                          <div className="font-bold">
                            {experience.companySector}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Start Date
                          </div>
                          <div className="font-bold">
                            {experience.experienceStart}
                          </div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Ending Date
                          </div>
                          <div className="font-bold">
                            {experience.experienceEnd}
                          </div>
                        </li>
                        <li className="w-[196px] text-left">
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
                className="flex group tracking-wide justify-items-center items-center gap-x-2 mt-2 mb-2 rounded-lg border border-dashed border-gray-900/25 hover:border-solid hover:border-green-500 hover:shadow-md active:border-[#69d11c] px-[86px] py-[8px] sm:px-[136px] sm:py-[16px]"
              >
                <span className="text-2xl text-gray-900/70 group-hover:text-green-500">
                  +
                </span>
                <span className="font-mulish font-bold flex text-center text-md group-hover:text-green-500 group-hover:underline leading-8 text-gray-900/70">
                  New experience
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
    </div>
  );
}
