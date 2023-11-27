import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ContentTitle from "../components/ContentTitle";
import { clearMessage } from "../actions/message";
import JobPostingService from "../services/jobPostingService";
import ApplyService from "../services/applyService";
import { Container, Header, Grid, Divider } from "semantic-ui-react";
import {
  BriefcaseIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import ApplyPopup from "../components/ApplyPopup";

const jobPostingService = new JobPostingService();
const applyService = new ApplyService();
export default function JobPostingDetail() {
  const { id } = useParams();
  const [applications, setApplications] = useState(false);
  const [showEmployeeBoard, setShowEmployeeBoard] = useState(false);
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const navigate = useNavigate();
  const [jobPosting, setJobPosting] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let location = useLocation();

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  useEffect(() => {
    loadJobPosting();
    applyService
      .getApplicationsByJobPostingId(id)
      .then((result) => setApplications(result.data.data));
    if (currentUser) {
      setShowEmployeeBoard(currentUser.roles.includes("ROLE_EMPLOYEE"));
      setIsLoggedIn(true);
    } else {
      setShowEmployeeBoard(false);
    }
  }, [currentUser]);

  const handleApplyClick = () => {
    if (isLoggedIn) {
      if (showEmployeeBoard) {
        navigate(`/apply/jobPosting/${jobPosting.jobPostingId}`);
      } else {
        setShowApplyPopup(true);
      }
    } else {
      // Eğer oturum açılmamışsa, giriş sayfasına yönlendir
      navigate("/login");
    }
  };

  const loadJobPosting = async () => {
    jobPostingService
      .getJobPostingById(id)
      .then((result) => setJobPosting(result.data.data));
  };

  return (
    <div>
      <Container>
        <ContentTitle content="Job Posting Detail" />
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign="left">
              <div className="ui breadcrumb">
                <a className="section" href="/">
                  Home
                </a>
                <i className="right chevron icon divider"></i>
                <a className="section" href="/jobPostings/listall">
                  Find Jobs
                </a>
                <i className="right chevron icon divider"></i>
                <a className="section" href={`/jobPosting/${id}`}>
                  {jobPosting.jobTitle?.jobTitleName}
                </a>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className="ui segment">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={2} />
              <Grid.Column width={12} textAlign="left">
                <div className="lg:flex lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-2xl font-mulish font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
                          {jobPosting.jobTitle?.jobTitleName}
                        </div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          Published on&nbsp;
                          {new Date(jobPosting.publicationDate).toDateString()}
                        </div>
                      </div>
                      <div className="px-[16px] py-[8px]">
                        <div className="font-bold text-lg text-center text-[14px] mr-1">
                          Applicants
                        </div>
                        <div className="text-sm text-gray-500">
                          {applications.length >= 0 &&
                          applications.length <= 999 ? (
                            <div>{applications.length}&nbsp;applications</div>
                          ) : (
                            <div>999+ applications</div>
                          )}
                        </div>
                        {!jobPosting.active && (
                          <div className="font-bold text-red-500">
                            Passive Post
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col font-mulish font-bold text-sm rounded-lg sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-4 p-4 bg-gray-50">
                      <div className="flex items-center">
                        <BriefcaseIcon
                          className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-900">
                          {jobPosting.workingType?.typeName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon
                          className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-900">
                          {jobPosting.city?.cityName}
                        </span>
                      </div>
                      <div>
                        {jobPosting.salaryMin !== "0" &&
                          jobPosting.salaryMax !== "0" &&
                          jobPosting.salaryMin !== null &&
                          jobPosting.salaryMax !== null && (
                            <div className="flex items-center">
                              <CurrencyDollarIcon
                                className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                                aria-hidden="true"
                              />
                              <span className="text-gray-900">
                                {jobPosting.salaryMin} &ndash;&nbsp;
                                {jobPosting.salaryMax}
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="flex items-center">
                        <CalendarIcon
                          className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-900">
                          Closing on&nbsp;
                          {new Date(
                            jobPosting.applicationDeadline
                          ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="ui list flex mt-2 text-gray-600"
                  style={{ marginTop: 32 }}
                >
                  <div className="font-semibold">
                    <div className="flex mb-1 space-x-1">
                      <div>
                        <i className="building icon" />
                      </div>
                      <div className="flex text-gray-900 space-x-1">
                        <div>Company</div>
                        <div>:</div>
                      </div>
                    </div>

                    <div className="flex mb-1 space-x-1">
                      <span>
                        <i className="mail icon" />
                      </span>
                      <div className="flex text-gray-900 space-x-[27px]">
                        <span>E-mail</span>
                        <span>:</span>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <span>
                        <i className="linkify icon" />
                      </span>
                      <div className="flex text-gray-900 space-x-[15px]">
                        <span>Website</span>
                        <span>:</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link className="block text-left text-md text-blue-500 font-bold mb-1 ml-1">
                      {jobPosting.employer?.companyName}
                    </Link>
                    <div className="block text-left text-md text-blue-500 font-bold mb-1 ml-1">
                      <Link to={"mailto:" + jobPosting.employer?.email}>
                        {jobPosting.employer?.email}
                      </Link>
                    </div>
                    <div className="block text-left text-md text-blue-500 font-bold mb-1 ml-1">
                      <Link to={jobPosting.employer?.website} target="_blank">
                        {jobPosting.employer?.website &&
                          jobPosting.employer.website.replace(
                            /^https?:\/\//,
                            ""
                          )}
                      </Link>
                    </div>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign="left">
              <Grid.Column width={2} />
              <Grid.Column width={12}>
                <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-6 pb-5 mb-6 ring-1 ring-slate-900/5 shadow-xl font-sans font-normal md:font-medium text-left ">
                  {jobPosting.jobDescription && (
                    <div>
                      <Header content="Job Description" />
                      <Divider />

                      <div
                        className="font-mulish font-medium"
                        dangerouslySetInnerHTML={{
                          __html: jobPosting.jobDescription,
                        }}
                      />
                      <div className="text-right mt-6">
                        <div>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-full text-white transition ease-in-out delay-0 bg-blue-800 hover:-translate-y-0 hover:scale-110 hover:bg-blue-600 duration-300"
                            onClick={() => {
                              handleApplyClick();
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      {showApplyPopup && (
                        <ApplyPopup
                          jobPostingId={id}
                          onClose={() => setShowApplyPopup(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Container>
    </div>
  );
}
