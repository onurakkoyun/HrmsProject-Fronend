import React, { useEffect, useState } from "react";
import SkillService from "../services/skillService";
import NewSkillPopup from "../components/NewSkillPopup";

const skillService = new SkillService();
export default function SkillsList({ resumeId }) {
  const [skills, setSkills] = useState([]);
  const [newSkillsAdded, setNewSkillsAdded] = useState(false);
  const [isNewSkillModalOpen, setIsNewSkillModalOpen] = useState(false);
  const [skillUpdated, setSkillUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    skillService.getSkillsByResumeId(resumeId).then((result) => {
      setSkills(result.data.data);
    });
    if (newSkillsAdded) {
      setNewSkillsAdded(false);
    }
    if (skillUpdated) {
      setSkillUpdated(false);
    }
  }, [resumeId, newSkillsAdded, skillUpdated]);

  const deleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      // Resume başarıyla silindiğinde, silinen resume'yi frontend listesinden kaldırın
      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill.skillId !== skillId)
      );
    } catch (error) {
      console.error("An error occurred while deleting the skill.", error);
    }
  };

  const handleCreateNewSkillClick = () => {
    setIsNewSkillModalOpen(true);
  };

  return (
    <div>
      <div className="mt-3 mx-auto md:mx-auto lg:px-[256px]">
        <section className="rounded-lg tracking-wide bg-white sm:p-2 md:p-4 lg:p-8 shadow-xl hover:border-dashed border-2 hover:border-gray-500 justify-items-center mt-3 max-w-screen-full mx-auto px-4 md:px-8 sm:px-4">
          <div>
            <h3 className="text-left font-mulish font-semibold">Skills</h3>
          </div>
          <div className="mt-5">
            {skills.length === 0 ? (
              <div>
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-yellow-50 px-8.5 py-2 text-md text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  No any skill added yet
                </p>
              </div>
            ) : (
              <ul className="relative grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:max-w-10 font-mulish font-medium rounded-xl border group hover:border-green-400">
                {skills.map((skill) => (
                  <li className="justify-self-center" key={skill.skillId}>
                    <div className="inline-flex text-sm text-center items-center justify-center rounded-md text-green-700 bg-green-50 mx-2 my-1 px-[8px] py-[4px] ring-1 ring-inset ring-green-600/20 overflow-hidden line-clamp-2">
                      <span className="text-xs font-medium">
                        {skill.skillName.charAt(0).toUpperCase() +
                          skill.skillName.slice(1)}
                      </span>
                      <div className="">
                        <button
                          type="button"
                          className="mt-[4px] ms-1 mr-[0.5px] rounded-full inline-block gap-1 text-blue-900 transition hover:text-white hover:bg-red-300"
                          onClick={() => deleteSkill(skill.skillId)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-2 h-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleCreateNewSkillClick}
                className="grid justify-items-center mt-2 mb-2 rounded-lg border border-dashed border-gray-900/25 active:border-[#69d11c] px-[86px] py-[8px] sm:px-[136px] sm:py-[16px] hover:underline"
              >
                <span className="font-mulish font-bold flex text-center text-md leading-6 text-[#69d11c]">
                  + &nbsp;&nbsp;Add Skill
                </span>
              </button>
              <NewSkillPopup
                open={isNewSkillModalOpen}
                setOpen={setIsNewSkillModalOpen}
                showPopupCallback={() => {
                  setShowPopup(true);
                  setNewSkillsAdded(true);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
