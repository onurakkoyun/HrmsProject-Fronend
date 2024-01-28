import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import WorkingTypeService from "../services/workingTypeService";
import JobTitleService from "../services/jobTitleService";
import CityService from "../services/cityService";
import JobPostingCard from "../components/JobPostingCard";
import SelectedFilterBadge from "../components/SelectedFilterBadge";

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

let cityService = new CityService();
let jobTitleService = new JobTitleService();
let workingTypeService = new WorkingTypeService();

export default function JobPostingsList() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [workingTypes, setWorkingTypes] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [selectedWorkingTypes, setSelectedWorkingTypes] = useState([]);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    cityService.getCities().then((result) => setCities(result.data.data));

    jobTitleService
      .getJobTitles()
      .then((result) => setJobTitles(result.data.data));

    workingTypeService
      .getWorkingTypes()
      .then((result) => setWorkingTypes(result.data.data));
  }, []);

  const handleCityChange = (cityName) => {
    setSelectedCities((prevCities) =>
      prevCities.includes(cityName)
        ? prevCities.filter((city) => city !== cityName)
        : [...prevCities, cityName]
    );
  };

  const handleJobTitleChange = (jobTitleName) => {
    setSelectedJobTitles((prevTitles) =>
      prevTitles.includes(jobTitleName)
        ? prevTitles.filter((title) => title !== jobTitleName)
        : [...prevTitles, jobTitleName]
    );
  };

  const handleWorkingTypeChange = (typeName) => {
    setSelectedWorkingTypes((prevWorkingTypes) =>
      prevWorkingTypes.includes(typeName)
        ? prevWorkingTypes.filter((workingType) => workingType !== typeName)
        : [...prevWorkingTypes, typeName]
    );
  };

  const handleClearFilters = (e) => {
    e.preventDefault(); // Add this line to prevent the default form submission behavior
    setSelectedCities([]);
    setSelectedJobTitles([]);
    setSelectedWorkingTypes([]);
  };

  const handleSortOptions = (value) => {
    setSortOption(value);
  };

  return (
    <div className="bg-gray-50 mt-7">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-[0px] bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-[0px] z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-2 pb-6 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-1 flex h-5 w-5 items-center justify-center rounded-md bg-white p-1 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters job titles*/}
                  <form className="mt-2 border-t border-gray-200 divide-y p-0.5">
                    <div>
                      <h3 className="sr-only">Cities</h3>
                      <div className="font-bold text-sm text-left ml-1 mt-1 mb-1">
                        City
                      </div>
                      <div className="absolute mb-2 ml-1">
                        <label htmlFor="Search" className="sr-only">
                          {" "}
                          Search{" "}
                        </label>

                        <input
                          type="text"
                          id="MobileSearchCity"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="Search city"
                          className="w-[212px] border-2 border-gray-200 py-[6px] pl-2 shadow-sm sm:text-sm"
                        />

                        <span className="absolute inset-y-[0px] end-[0px] grid place-content-center">
                          <button
                            type="button"
                            className="text-gray-600 hover:text-gray-700 p-1"
                          >
                            <span className="sr-only">Search</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-3 w-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                              />
                            </svg>
                          </button>
                        </span>
                      </div>
                      <ul
                        role="list"
                        className="px-1 py-[48px] font-medium text-left overflow-y-auto max-h-11"
                      >
                        {cities
                          .filter((city) =>
                            city.cityName
                              .toLowerCase()
                              .includes(citySearch.toLowerCase())
                          )
                          .map((city) => (
                            <li className="mb-2" key={city.cityId}>
                              <label className="flex items-center hover:cursor-pointer hover:underline">
                                <input
                                  type="checkbox"
                                  id={city.cityId}
                                  className="h-3 w-3 rounded border-gray-300"
                                  onChange={() =>
                                    handleCityChange(city.cityName)
                                  }
                                  checked={selectedCities.includes(
                                    city.cityName
                                  )}
                                />
                                <span className="ml-2 text-sm text-gray-800 font-mulish">
                                  {city.cityName}
                                </span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="sr-only">Job Titles</h3>
                      <div className="font-bold text-sm text-left ml-1 mt-1 mb-1">
                        Job Title
                      </div>
                      <div className="absolute mb-2 ml-1">
                        <label htmlFor="Search" className="sr-only">
                          {" "}
                          Search{" "}
                        </label>

                        <input
                          type="text"
                          id="MobileSearchTitle"
                          value={titleSearch}
                          onChange={(e) => setTitleSearch(e.target.value)}
                          placeholder="Search title"
                          className="w-[212px] border-2 border-gray-200 py-[6px] pl-2 shadow-sm sm:text-sm"
                        />

                        <span className="absolute inset-y-[0px] end-[0px] grid place-content-center">
                          <button
                            type="button"
                            className="text-gray-600 hover:text-gray-700 p-1"
                          >
                            <span className="sr-only">Search</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-3 w-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                              />
                            </svg>
                          </button>
                        </span>
                      </div>
                      <ul
                        role="list"
                        className="px-1 py-[48px] font-medium text-left overflow-y-auto max-h-11"
                      >
                        {jobTitles
                          .filter((jobTitle) =>
                            jobTitle.jobTitleName
                              .toLowerCase()
                              .includes(titleSearch.toLowerCase())
                          )
                          .map((jobTitle) => (
                            <li className="mb-2" key={jobTitle.titleId}>
                              <label className="flex items-center hover:cursor-pointer hover:underline">
                                <input
                                  type="checkbox"
                                  id={jobTitle.titleId}
                                  className="h-3 w-3 rounded border-gray-300"
                                  onChange={() =>
                                    handleJobTitleChange(jobTitle.jobTitleName)
                                  }
                                  checked={selectedJobTitles.includes(
                                    jobTitle.jobTitleName
                                  )}
                                />
                                <span className="ml-2 text-sm text-gray-800 font-mulish">
                                  {jobTitle.jobTitleName}
                                </span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="sr-only">Working Types</h3>
                      <ul
                        role="list"
                        className="px-1 py-2 font-medium  text-left"
                      >
                        <div className="font-bold text-sm mb-2">
                          Working Type
                        </div>
                        {workingTypes
                          .filter((workingType) =>
                            workingType.typeName
                              .toLowerCase()
                              .includes(typeSearch.toLowerCase())
                          )
                          .map((workingType) => (
                            <li
                              className="mb-2"
                              key={workingType.workingTypeId}
                            >
                              <label className="flex items-center hover:cursor-pointer hover:underline">
                                <input
                                  type="checkbox"
                                  id={workingType.workingTypeId}
                                  className="h-3 w-3 rounded border-gray-300"
                                  onChange={() =>
                                    handleWorkingTypeChange(
                                      workingType.typeName
                                    )
                                  }
                                  checked={selectedWorkingTypes.includes(
                                    workingType.typeName
                                  )}
                                />
                                <span className="ml-2 text-sm text-gray-800 font-mulish">
                                  {workingType.typeName}
                                </span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/*--------------  Desktop icerikleri    ----------------*/}
        <main className="mx-auto max-w-[1248px] px-2 sm:px-3 lg:px-4">
          <div className="flex items-baseline justify-between font-mulish border-b border-gray-300 pb-2 pt-6">
            <div className="relative">
              <span className="contentTitle-1 relative text-sm font-[800] z-10 text-gray-800 sm:text-2xl">
                Job Postings
              </span>
              <span className="hidden lg:block absolute w-full h-2 bg-gradient-to-tr from-cyan-50 to-blue-600 rounded-full top-[18px] left-[0px] z-[0px] animate-line"></span>
            </div>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="group inline-flex justify-center text-gray-700 text-sm font-bold ">
                  <div className="flex bg-white border-2 px-4 py-[4px]">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-3 w-3 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  {/*-----------   Sort icerikleri  ---------------- */}
                  <Menu.Items className="absolute right-0 z-10 mt-1 w-8 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item className="items-center" key={option.value}>
                          <label
                            htmlFor={option.value}
                            className={classNames(
                              "block w-full h-5 font-medium text-center text-sm hover:cursor-pointer",
                              option.value === sortOption
                                ? "text-gray-900 hover:bg-gray-50"
                                : "text-gray-500 hover:bg-gray-50"
                            )}
                          >
                            <input
                              type="radio"
                              id={option.value}
                              onChange={() => handleSortOptions(option.value)}
                              checked={option.value === sortOption}
                              className="hidden"
                            />
                            {option.name}
                          </label>
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-3 p-1 text-gray-400 hover:text-gray-500 sm:ml-3 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="filter-heading" className="pb-6 pt-2">
            <h2 id="filter-heading" className="sr-only">
              Filters
            </h2>

            <div className="flex grid-cols-1 gap-x-[0px] gap-y-2 lg:gap-x-6 lg:grid-cols-2">
              {/*-----------------------   Desktop Filters Icerikleri--------------------------*/}
              <div className="sm:w-1/5">
                <form className="bg-white hidden lg:block border rounded-md shadow-md divide-y p-0.5">
                  <div>
                    <h3 className="sr-only">Cities</h3>
                    <div className="font-bold text-sm text-left ml-1 mt-1 mb-1">
                      City
                    </div>
                    <div className="relative mb-2">
                      <label htmlFor="Search" className="sr-only">
                        {" "}
                        Search{" "}
                      </label>

                      <input
                        type="text"
                        id="SearchCity"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        placeholder="Search city"
                        className="w-[212px] border-2 border-gray-200 py-[6px] pl-2 shadow-sm sm:text-sm"
                      />

                      <span className="absolute inset-y-[0px] end-[0px] grid w-3 place-content-center">
                        <button
                          type="button"
                          className="text-gray-600 hover:text-gray-700 p-1 mr-5"
                        >
                          <span className="sr-only">Search</span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-2 w-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <ul
                      role="list"
                      className="px-1 py-[6px] font-medium text-left overflow-y-auto max-h-11"
                    >
                      {cities
                        .filter((city) =>
                          city.cityName
                            .toLowerCase()
                            .includes(citySearch.toLowerCase())
                        )
                        .map((city) => (
                          <li className="mb-2" key={city.cityId}>
                            <label className="flex items-center hover:cursor-pointer hover:underline">
                              <input
                                type="checkbox"
                                id={city.cityId}
                                className="h-3 w-3 rounded border-gray-300"
                                onChange={() => handleCityChange(city.cityName)}
                                checked={selectedCities.includes(city.cityName)}
                              />
                              <span className="ml-2 text-sm text-gray-800 font-mulish">
                                {city.cityName}
                              </span>
                            </label>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="sr-only">Job Titles</h3>
                    <div className="font-bold text-sm text-left ml-1 mt-1 mb-1">
                      Job Title
                    </div>
                    <div className="relative mb-2">
                      <label htmlFor="Search" className="sr-only">
                        {" "}
                        Search{" "}
                      </label>

                      <input
                        type="text"
                        id="SearchTitle"
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        placeholder="Search title"
                        className="w-[212px] border-2 border-gray-200 py-[6px] pl-2 shadow-sm sm:text-sm"
                      />

                      <span className="absolute inset-y-[0px] end-[0px] grid w-3 place-content-center">
                        <button
                          type="button"
                          className="text-gray-600 hover:text-gray-700 p-1 mr-5"
                        >
                          <span className="sr-only">Search</span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-2 w-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <ul
                      role="list"
                      className="px-1 py-[6px] font-medium text-left overflow-y-auto max-h-11"
                    >
                      {jobTitles
                        .filter((jobTitle) =>
                          jobTitle.jobTitleName
                            .toLowerCase()
                            .includes(titleSearch.toLowerCase())
                        )
                        .map((jobTitle) => (
                          <li className="mb-2" key={jobTitle.titleId}>
                            <label className="flex items-center hover:cursor-pointer hover:underline">
                              <input
                                type="checkbox"
                                id={jobTitle.titleId}
                                className="h-3 w-3 rounded border-gray-300"
                                onChange={() =>
                                  handleJobTitleChange(jobTitle.jobTitleName)
                                }
                                checked={selectedJobTitles.includes(
                                  jobTitle.jobTitleName
                                )}
                              />
                              <span className="ml-2 text-sm text-gray-800 font-mulish">
                                {jobTitle.jobTitleName}
                              </span>
                            </label>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="sr-only">Working Types</h3>
                    <ul
                      role="list"
                      className="px-1 py-2 font-medium  text-left"
                    >
                      <div className="font-bold text-sm mb-2">Working Type</div>
                      {workingTypes
                        .filter((workingType) =>
                          workingType.typeName
                            .toLowerCase()
                            .includes(typeSearch.toLowerCase())
                        )
                        .map((workingType) => (
                          <li className="mb-2" key={workingType.workingTypeId}>
                            <label className="flex items-center hover:cursor-pointer hover:underline">
                              <input
                                type="checkbox"
                                id={workingType.workingTypeId}
                                className="h-3 w-3 rounded border-gray-300"
                                onChange={() =>
                                  handleWorkingTypeChange(workingType.typeName)
                                }
                                checked={selectedWorkingTypes.includes(
                                  workingType.typeName
                                )}
                              />
                              <span className="ml-2 text-sm text-gray-800 font-mulish">
                                {workingType.typeName}
                              </span>
                            </label>
                          </li>
                        ))}
                    </ul>
                  </div>
                </form>
              </div>

              {/* Job Posting Card */}
              <div className="sm:w-4/5">
                <div>
                  {(selectedCities.length > 0 ||
                    selectedJobTitles.length > 0 ||
                    selectedWorkingTypes.length > 0) && (
                    <div className="flex justify-start space-x-3">
                      <span className="font-bold text-sm">
                        Selected filters&nbsp;(
                        {selectedCities.length +
                          selectedJobTitles.length +
                          selectedWorkingTypes.length}
                        )
                      </span>
                      <span className="text-indigo-500 text-sm">
                        <button onClick={(e) => handleClearFilters(e)}>
                          Clear filters
                        </button>
                      </span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-start">
                    {/* Display selected filters */}
                    <div className="space-y-1">
                      {selectedCities.map((city) => (
                        <SelectedFilterBadge
                          key={city}
                          filter={city}
                          onRemove={handleCityChange}
                        />
                      ))}
                      {selectedJobTitles.map((jobTitle) => (
                        <SelectedFilterBadge
                          key={jobTitle}
                          filter={jobTitle}
                          onRemove={handleJobTitleChange}
                        />
                      ))}
                      {selectedWorkingTypes.map((workingType) => (
                        <SelectedFilterBadge
                          key={workingType}
                          filter={workingType}
                          onRemove={handleWorkingTypeChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <JobPostingCard
                  selectedCities={selectedCities}
                  selectedJobTitles={selectedJobTitles}
                  selectedWorkingTypes={selectedWorkingTypes}
                  sortOption={sortOption}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
