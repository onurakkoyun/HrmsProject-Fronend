import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ContentTitle from "../components/ContentTitle";
import JobPostingService from "../services/jobPostingService";
import ApplyService from "../services/applyService";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const jobPostingService = new JobPostingService();
const applyService = new ApplyService();

export default function EmployerJobPostingsList() {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [jobPostings, setJobPostings] = useState([]);
  const [jobPostingId, setJobPostingId] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (
        currentUser &&
        currentUser.roles &&
        (currentUser.roles.includes("ROLE_EMPLOYER") ||
          currentUser.roles.includes("ROLE_ADMIN"))
      ) {
        try {
          const jobPostingsResult =
            await jobPostingService.getJobPostingsByEmployerId(currentUser.id);
          setJobPostings(jobPostingsResult.data.data);

          const appliedJobsData = await Promise.all(
            jobPostingsResult.data.data.map(async (jobPosting) => {
              const applicationsResult =
                await applyService.getApplicationsByJobPostingId(
                  jobPosting.jobPostingId
                );
              return applicationsResult.data.data;
            })
          );

          setAppliedJobs(appliedJobsData);
        } catch (error) {
          console.error(
            "An error occurred while fetching job postings.",
            error
          );
        }
      } else {
        navigate("/unauthorized");
      }
    };

    fetchAppliedJobs();
  }, [currentUser.id]);

  const deleteJobPosting = async (jobPostingId) => {
    try {
      await jobPostingService.deleteJobPosting(jobPostingId);
      setJobPostings((prevJobPosting) =>
        prevJobPosting.filter(
          (jobPosting) => jobPosting.jobPostingId !== jobPostingId
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the job posting.", error);
    }
  };

  const deactivateJobPosting = async (jobPostingId) => {
    try {
      await jobPostingService.deactivateJobPosting(jobPostingId);
      setJobPostings((prevJobPosting) =>
        prevJobPosting.filter(
          (jobPosting) => jobPosting.jobPostingId !== jobPostingId
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the job posting.", error);
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
    <div className="mx-auto md:mx-auto lg:px-[202px]">
      <div className="mr-8 w-full">
        <ContentTitle content="Published Job Postings" />
      </div>
      <section className="rounded-lg bg-white sm:p-2 md:p-3 lg:p-7 shadow-xl border-2 justify-items-center max-w-screen-full mx-auto">
        <div className="flex flex-col justify-between sm:flex-row sm:flex-wrap">
          <div className="text-left">
            <div className="text-lg font-bold font-mulish mb-2">
              All published job postings
            </div>
            <div className="font-medium font-mulish text-gray-800 mb-2">
              A list of all job postings in your account including their titles,
              statuses, cities, and salaries.
            </div>
          </div>
          <div className="text-left sm:text-right mt-1 sm:mb-1">
            <button
              className="group relative inline-flex bg-[#5a2bdb] items-center overflow-hidden rounded-lg border border-current px-[18px] py-[9px] text-white focus:outline-green hover:rounded-lg  transition ease-in-out delay-0 hover:-translate-y-0 hover:scale-110 hover:bg-opacity-95 duration-300"
              onClick={() =>
                navigate(`/employer/${currentUser.id}/jobPosting/add`)
              }
            >
              <span className="absolute text-2xl -start-5 transition-all group-hover:start-2">
                +
              </span>
              <span className="font-mulish font-bold text-md transition-all group-hover:ms-3">
                Create new job
              </span>
            </button>
          </div>
        </div>

        <div className="font-mulish shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="text-[15px] font-bold border-b bg-white">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">Job Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Release at</th>
                <th className="px-3 py-2">Applications</th>
                <th className="px-3 py-2">Deadline</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-[14px] font-medium divide-y">
              {jobPostings.map((jobPosting, idx) => (
                <tr
                  className="text-gray-700 odd:bg-gray-50 even:bg-white"
                  key={idx}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    {jobPosting.jobTitle?.jobTitleName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {jobPosting.city?.cityName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {jobPosting.workingType?.typeName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-md px-[7px] py-[3px] font-bold text-sm ${
                        jobPosting.active === true
                          ? "text-green-600 bg-green-50/60 ring-1 ring-green-600/30 tracking-wide"
                          : "text-red-700 bg-red-50/60 ring-1 ring-red-900/20 tracking-wide"
                      }`}
                    >
                      {jobPosting.active === true ? (
                        <span>Active</span>
                      ) : (
                        <span>Passive</span>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatDateTime(new Date(jobPosting.publicationDate))}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link
                      to={`/jobPosting/${jobPosting.jobPostingId}/applicantsList`}
                    >
                      {appliedJobs.length >= 0 && appliedJobs.length <= 999 ? (
                        <div className="ml-3">
                          View&nbsp;(&nbsp;{appliedJobs[idx]?.length || 0}
                          &nbsp;)
                        </div>
                      ) : (
                        <div>999+</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatDateTime(new Date(jobPosting.applicationDeadline))}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <Menu as="div" className="relative inline-block text-left">
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
                                    "block rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  )}
                                  to={`/jobPosting/${jobPosting.jobPostingId}`}
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
                                    <span>Edit</span>
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
                                    deleteJobPosting(jobPosting.jobPostingId)
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
                                    <span>Delete post</span>
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
      </section>
    </div>
  );
}
