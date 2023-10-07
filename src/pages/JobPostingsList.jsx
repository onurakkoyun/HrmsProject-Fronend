import React, { useState, useEffect } from "react";
import JobPostingService from "./../services/jobPostingService";
import JobTitleService from "./../services/jobTitleService";
import CityService from "./../services/cityService";
import { Form } from "semantic-ui-react";
import ContentTitle from "../components/ContentTitle";

export default function JobPostingsList() {
  const [jobPostings, setJobPostings] = useState([]);
  const [jobTitles, setJobTitles] = useState([]); // Renamed state to jobTitles
  const [titleId, setTitleId] = useState("");
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [filtered, setFiltered] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    let jobPostingService = new JobPostingService();
    jobPostingService
      .getJobPostingsSortByDate()
      .then((result) => setJobPostings(result.data.data));

    let jobTitleService = new JobTitleService();
    jobTitleService
      .getJobTitles()
      .then((result) => setJobTitles(result.data.data));

    let cityService = new CityService();
    cityService.getCities().then((result) => setCities(result.data.data));
  }, []);

  const handleFiltered = () => {
    setFiltered(true); // Set filterClicked to true when the "Filter" button is clicked
  };

  const currentJobPostings = jobPostings.filter((jobPosting) => {
    const applicationDeadline = new Date(jobPosting.applicationDeadline);
    const today = new Date();

    if (!filtered) {
      return true;
    }

    // Filter by application deadline
    if (applicationDeadline < today) {
      return false; // Exclude job postings with expired application deadline
    }

    // Filter by selected job title (if a job title is selected)
    if (titleId && jobPosting.titleId !== titleId) {
      return false;
    }

    // Filter by selected city (if a city is selected)
    if (cityId && jobPosting.cityId !== cityId) {
      return false;
    }

    // If no filters are applied or the job posting matches all filters, include it
    return true;
  });

  const pageCount = Math.ceil(currentJobPostings.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onChangeTitleId = (e, data) => {
    const titleId = data.value;
    setTitleId(titleId);
    setFiltered(false);
  };

  const onChangeCityId = (e, data) => {
    const cityId = data.value;
    setCityId(cityId);
    setFiltered(false);
  };

  const jobTitleOptions = jobTitles.map((jobTitle) => {
    return {
      key: jobTitle.titleId,
      value: jobTitle.titleId,
      text: jobTitle.jobTitleName,
    };
  });

  const cityOptions = cities.map((city) => {
    return {
      key: city.cityId,
      value: city.cityId,
      text: city.cityName,
    };
  });

  return (
    <div className="container">
      <ContentTitle content="Job Postings List" />
      <div className="ml-9.5 text-left">
        <div className="ui breadcrumb">
          <a className="section" href="/home">
            Home
          </a>
          <i className="right chevron icon divider"></i>
          <a className="section" href="/jobPostings/listall">
            Find Jobs
          </a>
        </div>
      </div>
      <div className="flex">
        <div className="flex-initial w-12 h-12 mt-8 ml-9.5">
          <Form>
            <Form.Select
              name="titleId"
              className="left-aligned-label"
              label="Title"
              placeholder="Please select a title"
              options={jobTitleOptions}
              onChange={onChangeTitleId}
              value={titleId}
              scrolling
              selection
              clearable
              search
            />

            <Form.Select
              name="cityId"
              className="left-aligned-label"
              label="City"
              placeholder="Please select a city"
              options={cityOptions}
              onChange={onChangeCityId}
              value={cityId}
              scrolling
              selection
              clearable
              search
            />
            <button
              className="px-4 py-2 w-[256px] text-white font-['Oswald'] font-semibold duration-150 bg-[#FF0000] rounded-full hover:bg-red-500"
              onClick={handleFiltered}
            >
              Filter
            </button>
          </Form>
        </div>
        <div className="flex-initial w-14 h-14">
          <section className="mt-5 max-w-screen-lg mx-auto px-4 md:px-8 sm:px-4">
            <div>
              <h1 className="text-left text-3xl font-semibold">
                Explore The Jobs
              </h1>
            </div>

            <ul className="mt-5 divide-y space-y-3">
              {currentJobPostings
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((jobPosting) => (
                  <li
                    key={jobPosting.jobPostingId}
                    className="px-4 py-5 duration-150 hover:border-white hover:rounded-xl hover:bg-gray-50"
                  >
                    <a
                      href={`/jobPosting/${jobPosting.jobPostingId}`}
                      className="space-y-3"
                    >
                      <div>
                        <div className="justify-between sm:flex">
                          <div className="flex-1">
                            <h3 className="text-left text-xl font-bold text-blue-800">
                              {jobPosting.jobTitleName}
                            </h3>
                            <p className="text-left text-gray-700 mt-2 pr-2">
                              {jobPosting.jobSummary}
                            </p>
                          </div>
                          <div className="mt-5 space-y-4 text-sm sm:mt-0 sm:space-y-2">
                            <span className="flex items-center text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {new Date(
                                jobPosting.applicationDeadline
                              ).toDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="items-center space-y-4 text-sm sm:flex sm:space-x-4 sm:space-y-0">
                          <span className="mt-4 flex items-center text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-3 h-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1 2.75A.75.75 0 011.75 2h10.5a.75.75 0 010 1.5H12v13.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5H2v-13h-.25A.75.75 0 011 2.75zM4 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM4.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM8 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM8.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM14.25 6a.75.75 0 00-.75.75V17a1 1 0 001 1h3.75a.75.75 0 000-1.5H18v-9h.25a.75.75 0 000-1.5h-4zm.5 3.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            &nbsp;
                            {jobPosting.companyName}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {jobPosting.cityName}
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
            </ul>
            <div className="flex mt-2 justify-between items-center">
              <p className="text-sm text-gray-700">
                Showed{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, currentJobPostings.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{currentJobPostings.length}</span>{" "}
                results
              </p>
              <ol className="flex justify-center gap-1 text-xs font-medium">
                <li>
                  <button
                    className="inline-flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180"
                    onClick={goToPreviousPage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                {Array.from({ length: pageCount }).map((_, index) => {
                  if (pageCount <= 5) {
                    // Sayfa sayısı 5 veya daha az ise tüm sayfaları göster
                    return (
                      <li key={index}>
                        <button
                          className={`block h-5 w-5 rounded ${
                            currentPage === index + 1
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border border-gray-300 bg-white text-center leading-8 text-gray-900"
                          }`}
                          onClick={() => goToPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    );
                  } else {
                    // Sayfa sayısı 5'ten büyükse özel düzenleme yap
                    if (
                      index === 0 ||
                      index === pageCount - 1 ||
                      index === 1 ||
                      index === currentPage - 1 ||
                      index === currentPage ||
                      index === currentPage + 1
                    ) {
                      // İlk sayfa, son sayfa, 1, mevcut sayfa ve bir sonraki sayfayı göster
                      return (
                        <li key={index}>
                          <button
                            className={`block h-5 w-5 rounded ${
                              currentPage === index + 1
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border border-gray-300 bg-white text-center leading-8 text-gray-900"
                            }`}
                            onClick={() => goToPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      );
                    } else if (index === 2 && currentPage > 4) {
                      return (
                        <li key={index}>
                          <span className="block h-5 w-5 text-center leading-8 text-gray-900">
                            ...
                          </span>
                        </li>
                      );
                    }
                  }
                })}

                <li>
                  <button
                    className="inline-flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180"
                    onClick={goToNextPage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
