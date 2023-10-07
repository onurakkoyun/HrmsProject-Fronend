import React, { useEffect, useState } from "react";
import ResumeService from "../services/resumeService";
import UserService from "../services/userService";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import ResumeModal from "../components/ResumeModal";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const resumeService = new ResumeService();
const userService = new UserService();

export default function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isNewResumeModalOpen, setIsNewResumeModalOpen] = useState(false);
  const [newResumeAdded, setNewResumeAdded] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);

  const loadUserPhoto = async () => {
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

  useEffect(() => {
    loadUserPhoto();

    resumeService.getResumesByEmployeeId(currentUser.id).then((result) => {
      setResumes(result.data.data);
    });
    if (newResumeAdded) {
      setNewResumeAdded(false);
    }
  }, [currentUser.id, newResumeAdded]);

  const deleteResume = async (resumeId) => {
    try {
      await resumeService.deleteResume(resumeId);
      // Resume başarıyla silindiğinde, silinen resume'yi frontend listesinden kaldırın
      setResumes((prevResumes) =>
        prevResumes.filter((resume) => resume.resumeId !== resumeId)
      );
    } catch (error) {
      console.error("An error occurred while deleting the resume.", error);
    }
  };

  const handleCreateNewResumeClick = () => {
    setIsNewResumeModalOpen(true);
  };

  return (
    <div className="container mx-auto mt-8 lg:px-[156px]">
      <section className="rounded-lg border-2 bg-white md:p-4 lg:p-6 shadow-xl max-w-screen-full mx-auto px-4 md:px-10 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-left">Resumes</h2>
            <p className="mt-2 text-gray-600 text-left">
              Streamline your resume management process efficiently.
            </p>
          </div>
          <div className="text-right">
            <button
              className="group relative inline-flex bg-green-500 items-center overflow-hidden rounded-lg border border-current px-3 py-1 text-white focus:outline-green hover:rounded-lg"
              onClick={handleCreateNewResumeClick}
            >
              <span className="absolute -end-6 transition-all group-hover:end-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 font-bold"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </span>
              <span className="text-md transition-all group-hover:me-4">
                New Resume
              </span>
            </button>
            <ResumeModal
              open={isNewResumeModalOpen}
              setOpen={setIsNewResumeModalOpen}
              showPopupCallback={() => {
                setShowPopup(true);
                setNewResumeAdded(true);
              }}
            />
          </div>
        </div>

        <div className="pb-2 md:pb-1">
          {resumes.length === 0 ? (
            <div className="mt-5">
              <p className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                No resumes available
              </p>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <li key={resume.resumeId} className="border rounded-lg">
                  <div className="flex items-start justify-between p-2">
                    <div className="space-y-5">
                      <img
                        className="flex-none h-6 w-6 rounded-full object-cover"
                        src={profilePhoto}
                        alt="Profile"
                      />
                      <h4 className="text-gray-800 text-left font-semibold text-sm md:text-base">
                        {resume.resumeName}
                      </h4>
                      <span className="text-xs font-medium text-gray-600 mr-3">
                        Created{" "}
                        {formatDistanceToNow(new Date(resume.creationDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteResume(resume.resumeId)}
                        className="text-red-600 hover:text-red-500 text-sm font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex grid grid-cols-2 border-t">
                    <div className="flex items-start py-4 px-2">
                      {resume.githubAddress && (
                        <a
                          href={resume.githubAddress}
                          className=" mr-1 text-xs font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon
                            color="black"
                            size="xl"
                            icon={faGithub}
                          />
                        </a>
                      )}
                      {resume.linkedinAddress && (
                        <a
                          href={resume.linkedinAddress}
                          className="mr-1 text-xs font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon
                            color="black"
                            size="xl"
                            icon={faLinkedinIn}
                          />
                        </a>
                      )}
                      {resume.personalWebsite && (
                        <a
                          href={resume.personalWebsite}
                          className="mr-1 text-xs font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon
                            color="black"
                            size="lg"
                            icon={faLink}
                          />
                        </a>
                      )}
                    </div>

                    <div className="py-3 px-2 text-right">
                      <Link
                        to={`/employee/${currentUser.id}/resume/${resume.resumeId}`}
                      >
                        <button className="text-gray-700 text-xs md:text-sm border rounded-lg px-2 md:px-3 py-1 duration-150 hover:bg-gray-100">
                          Edit
                        </button>
                      </Link>
                      <button className="ml-1 text-gray-700 text-xs md:text-sm border rounded-lg px-2 md:px-3 py-1 duration-150 hover:bg-gray-100">
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
