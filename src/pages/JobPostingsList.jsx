import React, { useState, useEffect } from "react";
import JobPostingService from "./../services/jobPostingService";
import JobTitleService from "./../services/jobTitleService";
import CityService from "./../services/cityService";
import { Form } from "semantic-ui-react";
import ContentTitle from "../components/ContentTitle";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import UserService from "../services/userService";

const userService = new UserService();
const jobPostingService = new JobPostingService();
const jobTitleService = new JobTitleService();

export default function JobPostingsList() {
  const [jobPostings, setJobPostings] = useState([]);
  const [jobTitles, setJobTitles] = useState([]); // Renamed state to jobTitles
  const [titleId, setTitleId] = useState("");
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [favoriteButtonClick, setFavoriteButtonClick] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      const jobPostingsResult = await jobPostingService.getJobPostings();
      const jobTitlesResult = await jobTitleService.getJobTitles();
      const citiesResult = await new CityService().getCities();

      const sortedJobPostings = jobPostingsResult.data.data.sort((a, b) => {
        const dateA = new Date(a.publicationDate);
        const dateB = new Date(b.publicationDate);
        return dateB - dateA;
      });

      // Apply filter for expired application deadlines
      const filteredJobPostings = sortedJobPostings.filter((jobPosting) => {
        const applicationDeadline = new Date(jobPosting.applicationDeadline);
        const today = new Date();
        return applicationDeadline >= today; // Include only job postings with future application deadlines
      });

      setJobPostings(filteredJobPostings);
      setJobTitles(jobTitlesResult.data.data);
      setCities(citiesResult.data.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        // Kullanıcılardan alınan ID'leri bir diziye topla
        const employerIds = jobPostings.map(
          (jobPosting) => jobPosting?.employer.id
        );

        // Toplu istek ile profil fotoğraflarını al
        const userPhotoResponses = await Promise.all(
          employerIds.map((employerId) =>
            userService.getUserPhotoById(employerId)
          )
        );

        // Her fotoğraf için URL oluştur ve iş ilanlarına ekleyerek set işlemini gerçekleştir
        const jobsWithPhotos = jobPostings.map((jobPosting, index) => {
          const userPhotoResponse = userPhotoResponses[index];

          if (userPhotoResponse.status === 200) {
            const imageBlob = userPhotoResponse.data;
            const imageUrl = URL.createObjectURL(imageBlob);
            return {
              ...jobPosting,
              profilePhoto: imageUrl,
            };
          }

          return jobPosting;
        });

        setJobPostings(jobsWithPhotos);
      } catch (error) {
        console.error("An error occurred while retrieving jobs", error);
      }
    };

    // Yalnızca jobPostings değiştiğinde fetchAppliedJobs'i çağır
    if (jobPostings.length > 0) {
      fetchAppliedJobs();
    }
  }, [jobPostings]);

  const handleFiltered = () => {
    setFiltered(true);
  };

  const handleFavoriteButtonClick = () => {
    setFavoriteButtonClick(!favoriteButtonClick);
  };

  const currentJobPostings = jobPostings.filter((jobPosting) => {
    if (!filtered) {
      return true;
    }

    // Filter by selected job title (if a job title is selected)
    if (titleId && jobPosting.jobTitle?.titleId !== titleId) {
      return false;
    }

    // Filter by selected city (if a city is selected)
    if (cityId && jobPosting.city?.cityId !== cityId) {
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
      <ContentTitle content="List of Job Postings" />
      <div className="ml-9.5 text-left">
        <div className="ui breadcrumb">
          <a className="section" href="/">
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
                    className="px-4 py-5 duration-150 border rounded-xl shadow-sm hover:border-white hover:rounded-xl hover:bg-gray-50"
                  >
                    <a
                      href={`/jobPosting/${jobPosting.jobPostingId}`}
                      className="space-y-3"
                    >
                      <div>
                        <div className="justify-between sm:flex">
                          <div className="bg-white w-6 h-6 mr-2 border rounded-xl flex items-center justify-center">
                            <div>
                              {jobPosting.profilePhoto ? (
                                <img
                                  className="w-5 h-5 rounded-lg object-cover"
                                  src={jobPosting.profilePhoto}
                                  alt="Profile"
                                />
                              ) : (
                                <img
                                  className="w-5 h-5 rounded-lg object-cover"
                                  src={defaultProfilePhoto}
                                  alt="Profile"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-mulish text-black text-left text-xl font-bold">
                              {jobPosting.jobTitle?.jobTitleName}
                            </div>
                            <span className="block text-left text-sm text-blue-500 font-bold">
                              {jobPosting.employer?.companyName}
                            </span>
                            <p className="font-mulish text-left text-gray-700 mt-2 pr-2">
                              {jobPosting.jobSummary}
                            </p>
                          </div>
                        </div>
                        <div className="justify-between space-y-4 text-sm sm:flex sm:space-x-4 sm:space-y-0">
                          <div className="flex mt-4">
                            <div className="mr-2 font-mulish flex items-center text-gray-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                  clipRule="evenodd"
                                />
                                <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                              </svg>
                              &nbsp;
                              {jobPosting.workingType?.typeName}
                            </div>

                            <div className="font-mulish flex items-center text-gray-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {jobPosting.city?.cityName}
                            </div>
                          </div>
                          <div className="space-y-4 text-sm sm:mt-0 sm:space-y-2">
                            <div className="flex items-center font-mulish text-gray-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
            </ul>
            <div className="font-mulish flex mt-2 justify-between items-center">
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
