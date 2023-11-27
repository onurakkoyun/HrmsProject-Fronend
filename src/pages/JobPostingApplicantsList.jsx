import React, { Fragment, useEffect, useState } from "react";
import ApplyService from "../services/applyService";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import { Link, useParams } from "react-router-dom";
import UserService from "../services/userService";
import ContentTitle from "../components/ContentTitle";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const userService = new UserService();
const applyService = new ApplyService();

export default function EmployerApplicantsList() {
  const { id } = useParams();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const applicationsResult =
          await applyService.getApplicationsByJobPostingId(id);
        const applications = applicationsResult.data.data;

        const jobsWithPhotos = await Promise.all(
          applications.map(async (appliedJob) => {
            setJobTitle(appliedJob.jobPosting.jobTitle.jobTitleName);

            const userPhotoResponse = await userService.getUserPhotoById(
              appliedJob.employee.id
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
  }, [id]);

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
        <ContentTitle content="List of Applicants" />
      </div>
      <section className="rounded-lg border-2 bg-white sm:p-2 md:p-3 lg:p-7 shadow-xl max-w-screen-full mx-auto">
        {appliedJobs.length !== 0 ? (
          <div className="max-w-screen-lg mx-auto px-3 md:px-6">
            <div className="flex justify-between text-left mb-2">
              <div className="text-lg font-medium font-mulish mb-2">
                <strong className="text-xl">{jobTitle}</strong>
                &nbsp;application list
              </div>
              <div className="flex gap-x-2">
                <span className="hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-2 py-1 text-md font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 -ml-[4px] mr-[6px] text-gray-600"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                    Edit
                  </button>
                </span>

                <span className="hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-2 py-1 text-md font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 -ml-[4px] mr-[6px] text-gray-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View
                  </button>
                </span>

                <span className="hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 -ml-[4px] mr-[6px]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Publish
                  </button>
                </span>
              </div>
            </div>
            <div className="font-mulish shadow-sm border rounded-lg overflow-x-auto">
              <table className="w-full table-auto text-sm text-left">
                <thead className="text-[15px] font-bold border-b bg-white">
                  <tr>
                    <th className="py-2 px-3">Fullname</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Resume</th>
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
                      <td className="flex items-center px-3 py-2 gap-x-1 whitespace-nowrap">
                        <img
                          className="w-5 h-5 rounded-full object-cover"
                          src={appliedJob.profilePhoto || defaultProfilePhoto}
                          alt="Profile"
                        />
                        <div>
                          <span className="block font-medium">
                            {appliedJob.employee.firstName}&nbsp;
                            {appliedJob.employee.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {appliedJob.employee.email}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {appliedJob.resume.resumeName}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatDateTime(new Date(appliedJob.appliedDate))}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
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
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="font-mulish text-left text-gray-700 mt-1">
              Total applications is{" "}
              <strong className="text-lg">{appliedJobs.length}</strong>
            </div>
          </div>
        ) : (
          <div>
            <p className="inline-flex font-mulish font-medium items-center rounded-full bg-yellow-50 px-8.5 py-2 text-md text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              No applications have been made yet
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
