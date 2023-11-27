import React, { Fragment, useEffect, useState } from "react";
import CoverLetterService from "../services/coverLetterService";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import CoverLetterModal from "../components/NewCoverLetterModal";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import EditCoverLetterModal from "../components/EditCoverLetterModal";
import ContentTitle from "../components/ContentTitle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const letterService = new CoverLetterService();

export default function CoverLetterList() {
  const [refId, setRefId] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);
  const [letters, setLetters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isNewLetterModalOpen, setIsNewLetterModalOpen] = useState(false);
  const [newLetterAdded, setNewLetterAdded] = useState(false);
  const [letterUpdated, setLetterUpdated] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.roles.includes("ROLE_EMPLOYEE")) {
      navigate("/unauthorized");
    } else {
      letterService.getLettersByEmployeeId(currentUser.id).then((result) => {
        setLetters(result.data.data);
      });
      if (newLetterAdded) {
        setNewLetterAdded(false);
      }
      if (letterUpdated) {
        setLetterUpdated(false);
      }
    }
  }, [currentUser.id, newLetterAdded, letterUpdated]);

  const deleteLetter = async (letterId) => {
    console.log(letterId);

    try {
      await letterService.deleteLetter(letterId);
      // Resume başarıyla silindiğinde, silinen resume'yi frontend listesinden kaldırın
      setLetters((prevLetters) =>
        prevLetters.filter((letter) => letter.letterId !== letterId)
      );
    } catch (error) {
      console.error("An error occurred while deleting the resume.", error);
    }
  };

  const handleCreateNewLetterClick = () => {
    setIsNewLetterModalOpen(true);
  };

  const handleUpdateClick = (newLetterId) => {
    setRefId(newLetterId);
    setUpdateModalOpen(true);
  };

  return (
    <div className="container mx-auto mt-8 lg:px-[156px]">
      <div className="mr-8 w-full">
        <ContentTitle content="List of Cover Letters" />
      </div>
      <section className="rounded-lg border-2 bg-white md:p-4 lg:p-6 shadow-xl max-w-screen-full mx-auto px-4 md:px-10 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-left">Cover letters</h2>
            <p className="font-mulish mt-2 text-[12px] text-gray-600 text-left">
              Be careful when deleting a cover letter because if you applied to
              a job with the cover letter you want to delete, companies will no
              longer be able to access your cover letter.
            </p>
          </div>
          <div className="text-right">
            <button
              className="group relative inline-flex bg-[#5a2bdb] items-center overflow-hidden rounded-lg border border-current px-[18px] py-[9px] text-white focus:outline-green hover:rounded-lg  transition ease-in-out delay-0 hover:-translate-y-0 hover:scale-110 hover:bg-opacity-90 duration-300"
              onClick={handleCreateNewLetterClick}
            >
              <span className="absolute text-2xl -start-5 transition-all group-hover:start-2">
                +
              </span>
              <span className="font-mulish font-bold text-md transition-all group-hover:ms-3">
                New letter
              </span>
            </button>

            <CoverLetterModal
              open={isNewLetterModalOpen}
              setOpen={setIsNewLetterModalOpen}
              showPopupCallback={() => {
                setShowPopup(true);
                setNewLetterAdded(true);
              }}
            />
          </div>
        </div>

        <div className="pb-2 md:pb-1">
          {letters.length === 0 ? (
            <div className="mt-5">
              <p className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                No letters available
              </p>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {letters.map((letter, index) => (
                <li
                  key={letter.letterId}
                  className="border rounded-lg rounded-br-xl rounded-bl-xl shadow-lg"
                >
                  <div className="flex items-start justify-between p-2">
                    <div className="space-y-5">
                      <h4 className="font-mulish text-gray-800 text-left font-semibold text-sm md:text-base">
                        {letter.letterName}
                      </h4>
                      <span className="font-mulish text-xs font-medium text-gray-600 mr-3">
                        Created{" "}
                        {formatDistanceToNow(new Date(letter.creationDate), {
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
                          <Menu.Items className="absolute right-[12px] p-[4px] z-10 w-[148px] origin-top-right divide-y-[1px] divide-gray-500/10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-[2px]">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block rounded-lg px-2 py-1 text-sm text-gray-500 hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700"
                                    )}
                                    onClick={() => {
                                      handleUpdateClick(letter.letterId);
                                    }}
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
                                      deleteLetter(letter.letterId)
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
                                      <span>Delete letter</span>
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <EditCoverLetterModal
                        letterId={refId}
                        open={updateModalOpen}
                        setOpen={setUpdateModalOpen}
                        showPopupCallback={() => {
                          setShowPopup(true);
                          setLetterUpdated(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-left mb-[9px]">
                    <span
                      className={`absolute rounded-br-2xl rounded-bl-2xl w-[325px] sm:max-w-sm h-[10px] ${
                        index % 2 === 0
                          ? "bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-400"
                          : "bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-200"
                      }`}
                    ></span>
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
