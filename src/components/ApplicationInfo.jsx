import React from "react";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function calculateExperienceDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffInMilliseconds = Math.abs(end - start);
  const years = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365);
  const yearsRoundDown = Math.floor(years);
  const months = (years - yearsRoundDown) * 12;
  const monthsRoundDown = Math.floor(months);

  if (yearsRoundDown >= 1) {
    return `${yearsRoundDown} ${
      yearsRoundDown === 1 ? "year" : "years"
    } ${monthsRoundDown} ${monthsRoundDown === 1 ? "month" : "months"}`;
  } else {
    return `${monthsRoundDown} ${monthsRoundDown === 1 ? "month" : "months"}`;
  }
}

export default function ApplicationInfo({
  employeePhoto,
  application,
  coverLetter,
  experiences,
  educations,
  languages,
  skills,
}) {
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
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Contact informations
          </div>
          <div className="grid grid-cols-1 gap-4 md:flex md:grid-cols-3 bg-gray-50 p-2 md:p-3 lg:p-5">
            <div className="rounded-full grid grid-rows-2 h-8 w-8 p-[3px] border-[3px] border-blue-200 md:h-9 md:w-9">
              {employeePhoto ? (
                <img
                  className="rounded-full w-auto h-auto"
                  src={employeePhoto}
                  alt="Profile"
                />
              ) : (
                <img
                  className="rounded-full w-auto h-auto"
                  src={defaultProfilePhoto}
                  alt="Profile"
                />
              )}
            </div>
            <div className="ml-5 text-left">
              <div>
                <div className="font-bold text-left text-2xl mb-1">
                  {application.employee?.firstName}&nbsp;
                  {application.employee?.lastName}
                </div>
                <div className="mb-1">
                  <span className="text-xs text-gray-700">E-Mail Address</span>
                  <div className="font-bold text-sm">
                    {application.employee?.email}
                  </div>
                </div>
                {application.employee?.phoneNumber ? (
                  <div className="mb-1">
                    <span className="text-xs text-gray-700">Phone</span>
                    <div className="font-bold text-sm text-gray-900">
                      {application.employee?.phoneNumber}
                    </div>
                  </div>
                ) : null}
                {application.employee?.country ||
                application.employee?.province ||
                application.employee?.city ? (
                  <div className="mb-4">
                    <span className="text-xs text-gray-700">Address</span>
                    <div className="font-bold text-sm">
                      {application.employee?.address ? (
                        <span>{application.employee?.address}&nbsp;</span>
                      ) : null}
                    </div>
                    <div className="font-bold text-sm">
                      {application.employee?.city ? (
                        <span>{application.employee?.city}&nbsp;</span>
                      ) : null}
                      {application.employee?.province ? (
                        <span>{application.employee?.province}&nbsp;</span>
                      ) : null}
                      {application.employee?.postalCode ? (
                        <span>{application.employee?.postalCode}&nbsp;</span>
                      ) : null}
                      {application.employee?.country ? (
                        <span>{application.employee?.country}&nbsp;</span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {application.resume?.linkedinAddress ||
                application.resume?.githubAddress ||
                application.resume?.personalWebsite ? (
                  <div className="mb-1">
                    <div className="font-bold text-xl mb-3">Social Media</div>

                    {application.resume?.linkedinAddress ? (
                      <div className="flex grid-cols-2 gap-1 items-center mb-2 ml-3">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 448 512"
                            className="w-4 h-4"
                          >
                            <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-700">LinkedIn</div>
                          <div className="font-bold text-sm">
                            <Link
                              className="text-gray-800 hover:text-gray-800"
                              to={application.resume?.linkedinAddress}
                              target="_blank"
                            >
                              {application.resume?.linkedinAddress}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {application.resume?.githubAddress ? (
                      <div className="flex grid-cols-2 gap-1 items-center mb-2 ml-3">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="0.625em"
                            viewBox="0 0 496 512"
                            className="w-4 h-4"
                          >
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-700">Github</div>
                          <div className="font-bold text-sm">
                            <Link
                              className="text-gray-800 hover:text-gray-800"
                              to={application.resume?.githubAddress}
                              target="_blank"
                            >
                              {application.resume?.githubAddress}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {application.resume?.personalWebsite ? (
                      <div className="flex grid-cols-2 gap-1 items-center ml-3">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 640 512"
                            className="w-4 h-4"
                          >
                            <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-700">
                            Personal Web site
                          </div>
                          <div className="font-bold text-sm">
                            <Link
                              className="text-gray-800 hover:text-gray-800"
                              to={application.resume?.personalWebsite}
                              target="_blank"
                            >
                              {application.resume?.personalWebsite}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="ml-5 text-left">
              <div>
                <div className="mb-1">
                  <span className="text-xs text-gray-700">Birth year</span>
                  <div className="font-bold text-sm">
                    {application.employee?.yearOfBirth}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Personal informations
          </div>
          {application.resume?.gender ||
          application.resume?.drivingLicence ||
          application.resume?.postponedDate ||
          application.resume?.militaryStatus ? (
            <div className="text-left bg-gray-50 sm:p-2 md:p-3 lg:p-5">
              <div className="grid grid-rows-2">
                <div className="flex grid-cols-3 gap-x-8 md:grid-cols-1">
                  {application.resume?.gender ? (
                    <div className="mb-1">
                      <span className="text-xs text-gray-700">Gender</span>
                      <div className="font-bold text-md">
                        {application.resume?.gender}
                      </div>
                    </div>
                  ) : null}
                  {application.resume?.drivingLicence ? (
                    <div className="mb-1">
                      <span className="text-xs text-gray-700">
                        Driving Licence
                      </span>
                      <div className="font-bold text-md">
                        {application.resume?.drivingLicence}
                      </div>
                    </div>
                  ) : null}
                  {application.resume?.militaryStatus ? (
                    <div className="mb-1">
                      <span className="text-xs text-gray-700">
                        Military Services
                      </span>
                      <div className="font-bold text-md">
                        {application.resume?.militaryStatus}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div>
                  {application.resume?.postponedDate ? (
                    <div className="mb-1">
                      <span className="text-xs text-gray-700">
                        Postponed Date
                      </span>
                      <div className="font-bold text-md">
                        {application.resume?.postponedDate}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-gray-50 sm:p-2 md:p-3 lg:p-5">
              <p className="inline-flex font-mulish font-medium items-center rounded-full bg-blue-50 px-8.5 py-2 text-md text-blue-800 ring-1 ring-inset ring-blue-600/20">
                No personal information is included in the resume
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Cover letter
          </div>
          <div className="text-left bg-gray-50 sm:p-2 md:p-3 lg:p-5 whitespace-pre-wrap">
            <div>
              {application.letterContent ? (
                <span>{application.letterContent}</span>
              ) : (
                <div className="text-center sm:p-2 md:p-3 lg:p-5">
                  <p className="inline-flex font-mulish font-medium items-center rounded-full bg-blue-50 px-8.5 py-2 text-md text-blue-800 ring-1 ring-inset ring-blue-600/20">
                    No cover letter is included in the resume
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Experiences
          </div>
          <div className="text-left bg-gray-50 sm:p-2 md:p-3 lg:p-5 whitespace-pre-wrap">
            {experiences.length === 0 ? (
              <div className="text-center sm:p-2 md:p-3 lg:p-5">
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-blue-50 px-8.5 py-2 text-md text-blue-800 ring-1 ring-inset ring-blue-600/20">
                  No experience is included in the resume
                </p>
              </div>
            ) : (
              <div>
                {experiences.map((experience) => (
                  <div
                    key={experience.experienceId}
                    className="relative font-mulish font-medium flex flex-col md:flex-row gap-5 rounded-xl p-3 border border-gray-300 group mb-3"
                  >
                    <div className="flex flex-col">
                      <div className="mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 ml-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                          />
                        </svg>
                      </div>
                      <div className="w-[64px] text-left">
                        <div className="text-sm text-gray-700">Duration</div>
                        {calculateExperienceDuration(
                          experience.experienceStart,
                          experience.experienceEnd
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3">
                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li key="jobTitleName" className="text-left">
                          <div className="text-sm text-gray-700">Title</div>
                          <div className="font-bold">
                            {experience.jobTitle.jobTitleName}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li key="companyName" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">
                            Company Name
                          </div>
                          <div className="font-bold">
                            {experience.companyName}
                          </div>
                        </li>
                        <li
                          key="experienceCityName"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">City</div>
                          <div className="font-bold">{experience.cityName}</div>
                        </li>
                        <li key="companySector" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">
                            Company Sector
                          </div>
                          <div className="font-bold">
                            {experience.companySector}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li
                          key="experienceStart"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">
                            Start Date
                          </div>
                          <div className="font-bold">
                            {experience.experienceStart}
                          </div>
                        </li>
                        <li key="experienceEnd" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">
                            Ending Date
                          </div>
                          <div className="font-bold">
                            {experience.experienceEnd}
                          </div>
                        </li>
                        <li key="typeName" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">
                            Working Type
                          </div>
                          <div className="font-bold">
                            {experience.workingType.typeName}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mr-2">
                        <li
                          key="experienceJobDescription"
                          className="w-full text-left"
                        >
                          <div className="text-sm text-gray-700 mb-1">
                            Job Definition
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: experience.jobDescription,
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Educations
          </div>
          <div className="text-left bg-gray-50 sm:p-2 md:p-3 lg:p-5 whitespace-pre-wrap">
            {educations.length === 0 ? (
              <div className="text-center sm:p-2 md:p-3 lg:p-5">
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-blue-50 px-8.5 py-2 text-md text-blue-800 ring-1 ring-inset ring-blue-600/20">
                  No education is included in the resume
                </p>
              </div>
            ) : (
              <div>
                {educations.map((education) => (
                  <div
                    key={education.educationId}
                    className="relative font-mulish font-medium flex flex-col md:flex-row gap-5 rounded-xl p-3 border border-gray-300  group mb-3"
                  >
                    <div className="flex flex-col text-center">
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

                          <div className="text-sm text-gray-700">
                            Graduation Degree
                          </div>
                          <div className="font-bold">-</div>
                        </div>
                      )}
                      {!education.continue && (
                        <div>
                          <div className="w-[102px] font-bold text-center mt-2 mb-1">
                            {education.educationLevel}
                          </div>

                          <div className="text-sm text-gray-700">
                            Graduation Degree
                          </div>
                          <div className="font-bold text-center">
                            {education.graduationDegree} /{" "}
                            {education.degreeType}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3">
                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li
                          key="universityName"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">
                            University
                          </div>
                          <div className="font-bold">
                            {education.universityName}
                          </div>
                        </li>
                        <li key="faculty" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">Faculty</div>
                          <div className="font-bold">{education.faculty}</div>
                        </li>
                        <li key="department" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">
                            Department
                          </div>
                          <div className="font-bold">
                            {education.department}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mb-3">
                        <li
                          key="educationCityName"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">City</div>
                          <div className="font-bold">{education.cityName}</div>
                        </li>
                        <li
                          key="educationStartingDate"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">
                            Starting Date
                          </div>
                          <div className="font-bold">
                            {education.startingDate}
                          </div>
                        </li>
                        <li
                          key="educationEndingDate"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">
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
                        <li key="educationType" className="w-[196px] text-left">
                          <div className="text-sm text-gray-700">
                            Education Type
                          </div>
                          <div className="font-bold">
                            {education.educationType}
                          </div>
                        </li>
                        <li
                          key="educationLanguage"
                          className="w-[196px] text-left"
                        >
                          <div className="text-sm text-gray-700">
                            Education Language
                          </div>
                          <div className="font-bold">
                            {education.educationLanguage}
                          </div>
                        </li>
                      </ul>

                      <ul className="flex flex-row sm:grid-rows-1 mr-2">
                        <li
                          key="educationDescription"
                          className="w-full text-left"
                        >
                          <div className="text-sm text-gray-700 mb-1">
                            Description
                          </div>
                          <div
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
          </div>
        </div>
      </section>
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Foreign Languages
          </div>
          <div className="text-left bg-gray-50 sm:p-2 md:p-3 lg:p-5 whitespace-pre-wrap">
            {languages.length === 0 ? (
              <div className="text-center sm:p-2 md:p-3 lg:p-5">
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-blue-50 px-8 py-2 text-md text-blue-800 ring-1 ring-inset ring-blue-600/20">
                  No foreign language is included in the resume
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 mb-2">
                  <div className="flex justify-center font-bold text-lg text-orange-500 ml-3">
                    Language
                  </div>
                  <div className="flex justify-center font-bold text-lg text-orange-500 mr-3">
                    Level
                  </div>
                </div>
                {languages.map((language) => (
                  <div
                    key={language.languageId}
                    className="relative h-8 font-mulish font-medium gap-5 rounded-xl p-3 border border-gray-300 group mb-3"
                  >
                    <div className="grid grid-cols-2 text-center">
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
          </div>
        </div>
      </section>
      <section className="rounded-lg border font-mulish bg-white shadow-lg justify-items-center mt-3 max-w-screen-full mx-auto">
        <div>
          <div className="text-left text-xl text-gray-600 leading-8 p-1 md:p-2 lg:p-3">
            Skills
          </div>
          <div className="text-left bg-gray-50 sm:p-2 md:p-3 lg:p-5 whitespace-pre-wrap">
            {skills.length === 0 ? (
              <div className="text-center sm:p-2 md:p-3 lg:p-5">
                <p className="inline-flex font-mulish font-medium items-center rounded-full bg-blue-50 px-8.5 py-2 text-md text-blue-800 ring-1 ring-inset ring-blue-600/20">
                  No skill is included in the resume
                </p>
              </div>
            ) : (
              <div className="relative grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:max-w-10 font-mulish font-medium rounded-xl">
                {skills.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="inline-flex text-sm text-center items-center justify-center rounded-full text-green-700 bg-green-50 mx-1 my-1 px-[6px] py-[2px] ring-1 ring-inset ring-green-600/20 overflow-hidden line-clamp-2"
                    title={skill.skillName}
                  >
                    <p className="text-sm">{skill.skillName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
