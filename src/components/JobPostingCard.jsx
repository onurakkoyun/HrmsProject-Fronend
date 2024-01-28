import React, { useEffect, useState } from "react";
import defaultProfilePhoto from "../images/default-profile.svg.png";
import JobPostingService from "./../services/jobPostingService";
import FavoriteJobPostingService from "./../services/favoriteJobPostingService";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/userService";
import axios from "axios";
import { useSelector } from "react-redux";
import authHeader from "../services/auth-header";

let jobPostingService = new JobPostingService();
let favoriteJobPostingService = new FavoriteJobPostingService();
let userService = new UserService();
let sortedJobPostings;

export default function JobPostingCard({
  selectedCities,
  selectedJobTitles,
  selectedWorkingTypes,
  sortOption,
}) {
  const [jobPostings, setJobPostings] = useState([]);
  const [favoriteJobPostings, setFavoriteJobPostings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    jobPostingService
      .getJobPostingsSortByPublicationDate()
      .then((result) => setJobPostings(result.data.data));
    if (currentUser && currentUser.roles.includes("ROLE_EMPLOYEE")) {
      favoriteJobPostingService
        .getFavoriteJobPostingsByEmployeeId(currentUser.id)
        .then((result) => setFavoriteJobPostings(result.data.data));
    }
  }, []);

  const filteredJobPostings = jobPostings.filter((jobPosting) => {
    const cityMatches =
      selectedCities.length === 0 ||
      selectedCities.includes(jobPosting.city?.cityName);
    const titleMatches =
      selectedJobTitles.length === 0 ||
      selectedJobTitles.includes(jobPosting.jobTitle?.jobTitleName);
    const workingTypeMatches =
      selectedWorkingTypes.length === 0 ||
      selectedWorkingTypes.includes(jobPosting.workingType?.typeName);

    return cityMatches && titleMatches && workingTypeMatches;
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const jobPostingsResult =
        await jobPostingService.getJobPostingsSortByPublicationDate();

      if (sortOption === "newest") {
        sortedJobPostings = jobPostingsResult.data.data.sort((a, b) => {
          const dateA = new Date(a.publicationDate);
          const dateB = new Date(b.publicationDate);
          return dateB - dateA;
        });
      } else if (sortOption === "oldest") {
        sortedJobPostings = jobPostingsResult.data.data.sort((a, b) => {
          const dateA = new Date(a.publicationDate);
          const dateB = new Date(b.publicationDate);
          return dateA - dateB;
        });
      }

      try {
        // Kullanıcılardan alınan ID'leri bir diziye topla
        const employerIds = sortedJobPostings.map(
          (jobPosting) => jobPosting?.employer.id
        );

        // Toplu istek ile profil fotoğraflarını al
        const userPhotoResponses = await Promise.all(
          employerIds.map((employerId) =>
            userService.getUserPhotoById(employerId)
          )
        );

        // Her fotoğraf için URL oluştur ve iş ilanlarına ekleyerek set işlemini gerçekleştir
        const jobsWithPhotos = sortedJobPostings.map((jobPosting, index) => {
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
      fetchJobs();
    }
  }, [jobPostings]);

  const handleToggleFavorite = async (jobPostingId) => {
    try {
      setMessage("");
      setSuccess(false);
      const isFavorite = favoriteJobPostings.some(
        (favorite) => favorite.jobPosting.jobPostingId === jobPostingId
      );

      if (isFavorite) {
        // If it's already a favorite, remove it
        await favoriteJobPostingService.removeFavoriteJobPosting(
          currentUser.id,
          jobPostingId
        );
      } else {
        // If it's not a favorite, add it
        await favoriteJobPostingService.addFavoriteJobPosting(
          currentUser.id,
          jobPostingId
        );
      }

      // Refresh the favorite job postings list
      const updatedFavorites =
        await favoriteJobPostingService.getFavoriteJobPostingsByEmployeeId(
          currentUser.id
        );
      setFavoriteJobPostings(updatedFavorites.data.data);

      setSuccess(true);
      setMessage(isFavorite ? "Removed from favorites" : "Added to favorites");

      // Toggle the favorite status
    } catch (error) {
      console.error("Error toggling favorite status", error);
      setMessage("An error occurred while toggling favorite status");
      setSuccess(false);
    }
  };

  const pageCount = Math.ceil(filteredJobPostings.length / itemsPerPage);

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

  return (
    <div>
      <div>
        {filteredJobPostings
          .slice(indexOfFirstItem, indexOfLastItem)
          .map((jobPosting) => (
            <ul
              key={jobPosting.jobPostingId}
              className="bg-white mt-3 divide-y space-y-3 rounded-lg"
            >
              {jobPosting.active && (
                <li
                  className="px-4 py-5 duration-150 border-2 hover:border-2 rounded-xl shadow-lg shadow-blue-50 hover:border-white hover:rounded-xl hover:shadow-blue-100 hover:shadow-lg hover:cursor-pointer"
                  onClick={() =>
                    navigate(`/jobPosting/${jobPosting.jobPostingId}`)
                  }
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
                        <div className="flex justify-between">
                          <div className="font-mulish text-black text-left text-xl font-bold">
                            {jobPosting.jobTitle?.jobTitleName}
                          </div>
                          {currentUser &&
                            currentUser.roles.includes("ROLE_EMPLOYEE") && (
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Stop the event propagation
                                    handleToggleFavorite(
                                      jobPosting.jobPostingId
                                    );
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={`${
                                      favoriteJobPostings.some(
                                        (favorite) =>
                                          favorite.jobPosting.jobPostingId ===
                                          jobPosting.jobPostingId
                                      )
                                        ? "w-[20px] h-[20px] text-gray-700 fill-gray-800 hover:fill-gray-600"
                                        : "w-[20px] h-[20px] text-gray-700 hover:fill-gray-800"
                                    }`}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
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
                </li>
              )}
            </ul>
          ))}
      </div>

      <div className="font-mulish flex mt-2 justify-between items-center">
        <p className="text-sm text-gray-700">
          Showed <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastItem, filteredJobPostings.length)}
          </span>{" "}
          of <span className="font-medium">{filteredJobPostings.length}</span>{" "}
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
    </div>
  );
}
