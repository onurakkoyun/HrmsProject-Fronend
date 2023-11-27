import React, { Fragment, useEffect, useState } from "react";
import ApplyService from "./../services/applyService";
import { useSelector } from "react-redux";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import { Link } from "react-router-dom";
import EditCoverLetterModal from "../components/EditCoverLetterModal";
import ContentTitle from "../components/ContentTitle";
import { Menu, Transition } from "@headlessui/react";
import UserService from "../services/userService";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const userService = new UserService();
const applyService = new ApplyService();

export default function AppliedJobList() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [letterUpdated, setLetterUpdated] = useState(false);
  const [refId, setRefId] = useState("");

  useEffect(() => {
    applyService.getApplicationsByEmployeeId(currentUser.id).then((result) => {
      setAppliedJobs(result.data.data);
    });

    if (letterUpdated) {
      setLetterUpdated(false);
    }
  }, [letterUpdated]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const result = await applyService.getApplicationsByEmployeeId(
          currentUser.id
        );
        const fetchedAppliedJobs = result.data.data;

        const jobsWithPhotos = await Promise.all(
          fetchedAppliedJobs.map(async (appliedJob) => {
            const userPhotoResponse = await userService.getUserPhotoById(
              appliedJob.jobPosting?.employer.id
            );

            if (userPhotoResponse.status === 200) {
              const imageBlob = userPhotoResponse.data;
              const imageUrl = URL.createObjectURL(imageBlob);
              return {
                ...appliedJob,
                profilePhoto: imageUrl,
              };
            }

            return appliedJob;
          })
        );

        setAppliedJobs(jobsWithPhotos);
      } catch (error) {
        console.error("An error occurred while fetching applied jobs", error);
      }
    };

    fetchAppliedJobs();
  }, []); // No dependencies, so it runs once on mount

  const deleteAppliedJobPosting = async (applicationId) => {
    try {
      await applyService.deleteApplication(applicationId);
      setAppliedJobs((prevAppliedJobs) =>
        prevAppliedJobs.filter(
          (appliedJob) => appliedJob.applicationId !== applicationId
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the application.", error);
    }
  };

  const handleUpdateClick = (newLetterId) => {
    setRefId(newLetterId);
    setUpdateModalOpen(true);
  };

  const formatDateTime = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Intl.DateTimeFormat("tr-TR", options).format(date);
  };

  return (
    <div className="container mx-auto mt-8 lg:px-[156px]">
      <div className="mr-8 w-full">
        <ContentTitle content="List of Jobs Applied for" />
      </div>
      <section className="rounded-lg border-2 bg-white sm:p-2 md:p-3 lg:p-7 shadow-xl max-w-screen-full mx-auto">
        <div className="max-w-screen-lg mx-auto px-3 md:px-6">
          <div className="text-left">
            <div className="text-lg font-bold font-mulish mb-2">
              Jobs Applied
            </div>
            <div className="font-medium font-mulish text-gray-800 mb-2">
              List of all job applications, including company name, status,
              resume, and cover letter.
            </div>
          </div>
          <div className="font-mulish shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm text-left">
              <thead className="text-[15px] font-bold border-b bg-white">
                <tr>
                  <th className="py-2 px-3">Company & Job</th>
                  <th className="py-2 px-3">Listing Status</th>
                  <th className="py-2 px-3">Resume</th>
                  <th className="py-2 px-3">Letter</th>
                  <th className="py-2 px-3">Applied at</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody className="text-[14px] font-medium divide-y">
                {appliedJobs.map((appliedJob, idx) => (
                  <tr
                    className="text-gray-700 odd:bg-gray-50 even:bg-white"
                    key={idx}
                  >
                    <td className="flex px-3 py-2 whitespace-nowrap">
                      <img
                        className="w-5 h-5 rounded-full object-cover"
                        src={appliedJob.profilePhoto || defaultProfilePhoto}
                        alt="Profile"
                      />

                      <div className="ml-1">
                        <div className="grid">
                          {appliedJob.jobPosting.employer.companyName}
                          <a
                            href={`/jobPosting/${appliedJob.jobPosting.jobPostingId}`}
                            className="text-blue-600 hover:text-blue-500"
                          >
                            {appliedJob.jobPosting.jobTitle.jobTitleName}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-[7px] py-[3px] font-bold text-sm ${
                          appliedJob.jobPosting.active === true
                            ? "text-green-600 bg-green-50/60 ring-1 ring-green-600/30 tracking-wide"
                            : "text-red-700 bg-red-50/60 ring-1 ring-red-900/20 tracking-wide"
                        }`}
                      >
                        {appliedJob.jobPosting.active === true ? (
                          <span>Active</span>
                        ) : (
                          <span>Passive</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span>{appliedJob.resume?.resumeName}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span>{appliedJob.coverLetter?.letterName}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatDateTime(new Date(appliedJob.appliedDate))}
                    </td>
                    <td className="px-3 whitespace-nowrap">
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
                          <Menu.Items className="absolute right-[8px] p-[4px] z-10 w-[148px] origin-top-right divide-y-[1px] divide-gray-500/10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-[2px]">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block rounded-lg px-1 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    )}
                                    to={`/employee/${appliedJob.employee.employeeId}/resume/${appliedJob.resume?.resumeId}`}
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
                                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                                          />
                                        </svg>
                                      </span>
                                      <span> Edit resume</span>
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
                                      "block rounded-lg px-1 py-1 text-sm text-gray-500 hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700"
                                    )}
                                    onClick={() => {
                                      handleUpdateClick(
                                        appliedJob.coverLetter.letterId
                                      );
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
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                          />
                                        </svg>
                                      </span>
                                      <span> Edit letter</span>
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
                                      "block rounded-lg px-1 py-1 text-sm text-gray-500 hover:bg-red-50 hover:cursor-pointer"
                                    )}
                                    onClick={() =>
                                      deleteAppliedJobPosting(
                                        appliedJob.applicationId
                                      )
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
                                      <span>Delete application</span>
                                    </div>
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      </section>
    </div>
  );
}
