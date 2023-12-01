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
  const [letterUpdated, setLetterUpdated] = useState(false);
  const [letterEditRefId, setLetterEditRefId] = useState("");
  const [letterEditModalOpen, setLetterEditModalOpen] = useState(false);

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
              Applied Job Postings
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
                      <span>{appliedJob.letterName}</span>
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
                                    to={`/application/${appliedJob.applicationId}/resume/${appliedJob.resume.resumeId}/preview`}
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
          </div>
        </div>
      </section>
    </div>
  );
}
