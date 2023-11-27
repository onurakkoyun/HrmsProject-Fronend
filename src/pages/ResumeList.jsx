import React, { useEffect, useState, Fragment } from "react";
import ResumeService from "../services/resumeService";
import UserService from "../services/userService";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import NewResumeModal from "../components/NewResumeModal";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import EditResumeModal from "../components/EditResumeModal";
import ContentTitle from "../components/ContentTitle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const resumeService = new ResumeService();
const userService = new UserService();

export default function ResumeList() {
  const [resumeId, setResumeId] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);
  const [resumes, setResumes] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showEditResumePopup, setShowEditResumePopup] = useState(false);
  const [isNewResumeModalOpen, setIsNewResumeModalOpen] = useState(false);
  const [newResumeAdded, setNewResumeAdded] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [resumeUpdated, setResumeUpdated] = useState(false);

  let navigate = useNavigate();

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
    if (!currentUser || !currentUser.roles.includes("ROLE_EMPLOYEE")) {
      navigate("/unauthorized");
    } else {
      loadUserPhoto();
      resumeService.getResumesByEmployeeId(currentUser.id).then((result) => {
        setResumes(result.data.data);
      });
      if (newResumeAdded) {
        setNewResumeAdded(false);
      }
      if (resumeUpdated) {
        setResumeUpdated(false);
      }
    }
  }, [currentUser.id, newResumeAdded, resumeUpdated]);

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

  const handleUpdateClick = (newResumeId) => {
    setResumeId(newResumeId);
    setUpdateModalOpen(true);
  };

  return (
    <div className="mx-auto mt-8 lg:px-[192px]">
      <div className="mr-8 w-full">
        <ContentTitle content="List of Resumes" />
      </div>
      <section className="rounded-lg border-2 bg-white md:p-4 lg:p-6 shadow-xl max-w-screen-full mx-auto px-4 md:px-10 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-left">Resumes</h2>
            <p className="font-mulish mt-2 text-gray-600 text-left">
              Be careful when deleting a resume because if you have applied for
              a job with the resume you want to delete, companies will no longer
              be able to access your application!
            </p>
          </div>
          <div className="text-right">
            <button
              className="group relative inline-flex bg-[#5a2bdb] items-center overflow-hidden rounded-lg border border-current px-[18px] py-[9px] text-white focus:outline-green hover:rounded-lg  transition ease-in-out delay-0 hover:-translate-y-0 hover:scale-110 hover:bg-opacity-90 duration-300"
              onClick={handleCreateNewResumeClick}
            >
              <span className="absolute text-2xl -start-5 transition-all group-hover:start-2">
                +
              </span>
              <span className="font-mulish font-bold text-md transition-all group-hover:ms-3">
                New resume
              </span>
            </button>
            <NewResumeModal
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
                      <h4 className="font-mulish text-gray-800 text-left font-semibold text-sm md:text-base">
                        {resume.resumeName}
                      </h4>
                      <span className="font-mulish text-xs font-medium text-gray-600 mr-3">
                        Created{" "}
                        {formatDistanceToNow(new Date(resume.creationDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
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
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
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
                          <Menu.Items className="absolute right-[8px] p-[4px] z-10 w-[148px] origin-top-right divide-y-[1px] divide-gray-500/10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-[2px]">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                      </span>
                                      <span>View</span>
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block rounded-lg px-2 py-1 text-sm text-gray-500 hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700"
                                    )}
                                    onClick={() =>
                                      handleUpdateClick(resume.resumeId)
                                    }
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
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                          />
                                        </svg>
                                      </span>
                                      <span>Rename</span>
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                            <div className="py-[2px]">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:cursor-pointer"
                                    )}
                                    onClick={() =>
                                      deleteResume(resume.resumeId)
                                    }
                                  >
                                    <div className="flex text-red-500">
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
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                        </svg>
                                      </span>
                                      <span>Delete resume</span>
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <EditResumeModal
                        resumeId={resumeId}
                        open={updateModalOpen}
                        setOpen={setUpdateModalOpen}
                        showPopupCallback={() => {
                          setShowEditResumePopup(true);
                          setResumeUpdated(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t">
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

                    <div className="flex py-3 px-2 justify-end divide-horizantal relative">
                      <Link
                        to={`/employee/${currentUser.id}/resume/${resume.resumeId}`}
                      >
                        <button className="text-gray-700 text-xs md:text-sm border rounded-lg px-2 md:px-3 py-1 duration-150 hover:bg-gray-100">
                          Edit
                        </button>
                      </Link>
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
