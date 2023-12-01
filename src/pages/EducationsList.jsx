import React, { useEffect, useState } from "react";
import EducationService from "../services/educationService";
import NewEducationPopup from "../components/NewEducationPopup";
import EditEducationPopup from "../components/EditEducationPopup";

const educationService = new EducationService();
export default function EducationsList({ resumeId }) {
  const [educations, setEducations] = useState([]);
  const [educationId, setEducationId] = useState("");
  const [isEditEducationModalOpen, setIsEditEducationModalOpen] =
    useState(false);
  const [newEducationsAdded, setNewEducationsAdded] = useState(false);
  const [isNewEducationModalOpen, setIsNewEducationModalOpen] = useState(false);
  const [educationUpdated, setEducationUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    educationService.getEducationsByResumeId(resumeId).then((result) => {
      setEducations(result.data.data);
    });
    if (newEducationsAdded) {
      setNewEducationsAdded(false);
    }
    if (educationUpdated) {
      setEducationUpdated(false);
    }
  }, [resumeId, newEducationsAdded, educationUpdated]);

  const deleteEducation = async (educationId) => {
    try {
      await educationService.deleteEducation(educationId);
      // Resume başarıyla silindiğinde, silinen resume'yi frontend listesinden kaldırın
      setEducations((prevEducations) =>
        prevEducations.filter(
          (education) => education.educationId !== educationId
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the education.", error);
    }
  };

  const handleCreateNewEducationClick = () => {
    setIsNewEducationModalOpen(true);
  };

  const handleUpdateEducationClick = (id) => {
    setEducationId(id);
    setIsEditEducationModalOpen(true);
  };

  return (
    <div>
      <div className="mt-3 mx-auto md:mx-auto lg:px-[256px]">
        <section className="rounded-lg tracking-wide bg-white sm:p-2 md:p-4 lg:p-8 shadow-xl hover:border-dashed border-2 hover:border-gray-500 justify-items-center mt-3 max-w-screen-full mx-auto px-4 md:px-8 sm:px-4">
          <div>
            <h3 className="text-left font-mulish font-semibold md:pt-3">
              Educations
            </h3>
          </div>
          <div className="mt-5">
            {educations.length === 0 ? (
              <div>
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-yellow-50 px-8.5 py-2 text-md text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  No any education added yet
                </p>
              </div>
            ) : (
              <div>
                {educations.map((education) => (
                  <div
                    key={education.educationId}
                    className="relative font-mulish font-medium flex flex-col md:flex-row gap-5 rounded-xl p-3 border group mb-3 hover:border-green-400"
                  >
                    <button
                      type="button"
                      className="absolute top-1 rounded-full right-1 group-hover:opacity-100 opacity-0 hover:cursor-pointer hover:text-red-500"
                      onClick={() => deleteEducation(education.educationId)}
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
                        handleUpdateEducationClick(education.educationId)
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
                    <EditEducationPopup
                      educationId={educationId}
                      open={isEditEducationModalOpen}
                      setOpen={setIsEditEducationModalOpen}
                      showPopupCallback={() => {
                        setShowPopup(true);
                        setEducationUpdated(true);
                      }}
                    />
                    <div className="flex flex-col">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 ml-[34px]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                          />
                        </svg>
                      </div>
                      {education.continue && (
                        <div>
                          <div className="w-[102px] font-bold mt-2 mb-1">
                            {education.educationLevel}
                          </div>

                          <div className="text-sm text-gray-500">
                            Graduation Degree
                          </div>
                          <div className="font-bold">-</div>
                        </div>
                      )}
                      {!education.continue && (
                        <div>
                          <div className="w-[102px] font-bold mt-2 mb-1">
                            {education.educationLevel}
                          </div>

                          <div className="text-sm text-gray-500">
                            Graduation Degree
                          </div>
                          <div className="font-bold">
                            {education.graduationDegree} /{" "}
                            {education.degreeType}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3">
                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            University
                          </div>
                          <div className="font-bold">
                            {education.universityName}
                          </div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">Faculty</div>
                          <div className="font-bold">{education.faculty}</div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Department
                          </div>
                          <div className="font-bold">
                            {education.department}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">City</div>
                          <div className="font-bold">{education.cityName}</div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Starting Date
                          </div>
                          <div className="font-bold">
                            {education.startingDate}
                          </div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Finishing Date
                          </div>
                          <div className="font-bold">
                            <div className="font-bold">
                              {education.continue
                                ? "Still Continue"
                                : education.endingDate}
                            </div>
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Education Type
                          </div>
                          <div className="font-bold">
                            {education.educationType}
                          </div>
                        </li>
                        <li className="w-[196px] text-left">
                          <div className="text-sm text-gray-500">
                            Education Language
                          </div>
                          <div className="font-bold">
                            {education.educationLanguage}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mr-2">
                        <li className="w-full text-left">
                          <div className="text-sm text-gray-500 mb-1">
                            Description
                          </div>
                          <div
                            className=""
                            dangerouslySetInnerHTML={{
                              __html: education.description,
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
                onClick={handleCreateNewEducationClick}
                className="flex group tracking-wide justify-items-center items-center gap-x-2 mt-2 mb-2 rounded-lg border border-dashed border-gray-900/25 hover:border-solid hover:border-green-500 hover:shadow-md active:border-[#69d11c] px-[86px] py-[8px] sm:px-[136px] sm:py-[16px]"
              >
                <span className="text-2xl text-gray-900/70 group-hover:text-green-500">
                  +
                </span>
                <span className="font-mulish font-bold flex text-center text-md group-hover:text-green-500 group-hover:underline leading-8 text-gray-900/70">
                  New education
                </span>
              </button>
              <NewEducationPopup
                open={isNewEducationModalOpen}
                setOpen={setIsNewEducationModalOpen}
                showPopupCallback={() => {
                  setShowPopup(true);
                  setNewEducationsAdded(true);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
