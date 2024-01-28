import React, { useEffect, useState } from "react";
import LanguageService from "../services/languageService";
import NewLanguagePopup from "../components/NewLanguagePopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const languageService = new LanguageService();
export default function LanguagesList({ resumeId }) {
  const [languages, setLanguages] = useState([]);
  const [newLanguagesAdded, setNewLanguagesAdded] = useState(false);
  const [isNewLanguageModalOpen, setIsNewLanguageModalOpen] = useState(false);
  const [languageUpdated, setLanguageUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    languageService.getLanguagesByResumeId(resumeId).then((result) => {
      setLanguages(result.data.data);
    });
    if (newLanguagesAdded) {
      setNewLanguagesAdded(false);
    }
    if (languageUpdated) {
      setLanguageUpdated(false);
    }
  }, [resumeId, newLanguagesAdded, languageUpdated]);

  const deleteLanguage = async (languageId) => {
    try {
      await languageService.deleteLanguage(languageId);
      // Resume başarıyla silindiğinde, silinen resume'yi frontend listesinden kaldırın
      setLanguages((prevLanguages) =>
        prevLanguages.filter((language) => language.languageId !== languageId)
      );
    } catch (error) {
      console.error("An error occurred while deleting the language.", error);
    }
  };

  const handleCreateNewLanguageClick = () => {
    setIsNewLanguageModalOpen(true);
  };

  const getStarCount = (languageLevel) => {
    switch (languageLevel) {
      case "Beginner":
        return 1;
      case "Pre Intermediate":
        return 2;
      case "Intermediate":
        return 3;
      case "Upper Intermediate":
        return 4;
      case "Advanced":
        return 5;
      case "Advanced (Native)":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <div>
      <div className="mt-3 mx-auto md:mx-auto lg:px-[256px]">
        <section className="rounded-lg tracking-wide bg-white sm:p-2 md:p-4 lg:p-8 shadow-xl hover:border-dashed border-2 hover:border-gray-500 justify-items-center mt-3 max-w-screen-full mx-auto px-4 md:px-8 sm:px-4">
          <div>
            <h3 className="text-left font-mulish font-semibold">
              Foreign Languages
            </h3>
          </div>
          <div className="mt-5">
            {languages.length === 0 ? (
              <div>
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-yellow-50 px-8.5 py-2 text-md text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  No any language added yet
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 mb-2">
                  <div className=" font-bold text-lg text-orange-500 ml-3">
                    Language
                  </div>
                  <div className=" font-bold text-lg text-orange-500 mr-3">
                    Level
                  </div>
                </div>
                {languages.map((language) => (
                  <div
                    key={language.languageId}
                    className="relative h-8 font-mulish font-medium gap-5 rounded-xl p-3 border group mb-3 hover:border-green-400"
                  >
                    <button
                      type="button"
                      className="absolute top-1 rounded-full right-1 group-hover:opacity-100 opacity-0 hover:cursor-pointer hover:text-red-500"
                      onClick={() => deleteLanguage(language.languageId)}
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
                    <div className="grid grid-cols-2">
                      <div className="mt-[12px]">
                        <div className="font-bold">{language.languageName}</div>
                        <div className="text-sm text-gray-500">
                          {language.languageLevel}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="mt-[16px] mr-[3px]">
                          {[...Array(getStarCount(language.languageLevel))].map(
                            (_, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                style={{ color: "#ffea00" }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleCreateNewLanguageClick}
                className="flex group tracking-wide justify-items-center items-center gap-x-2 mt-2 mb-2 rounded-lg border border-dashed border-gray-900/25 hover:border-solid hover:border-green-500 hover:shadow-md active:border-[#69d11c] px-[86px] py-[8px] sm:px-[136px] sm:py-[16px]"
              >
                <span className="text-2xl text-gray-900/70 group-hover:text-green-500">
                  +
                </span>
                <span className="font-mulish font-bold flex text-center text-md group-hover:text-green-500 group-hover:underline leading-8 text-gray-900/70">
                  New language
                </span>
              </button>
              <NewLanguagePopup
                open={isNewLanguageModalOpen}
                setOpen={setIsNewLanguageModalOpen}
                showPopupCallback={() => {
                  setShowPopup(true);
                  setNewLanguagesAdded(true);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
