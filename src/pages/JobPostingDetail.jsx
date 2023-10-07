import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ContentTitle from "../components/ContentTitle";
import { clearMessage } from "../actions/message";
import JobPostingService from "../services/jobPostingService";
import { Container, Header, Grid, Button, Divider } from "semantic-ui-react";
import {
  BriefcaseIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import ApplyPopup from "../components/ApplyPopup";

export default function JobPostingDetail() {
  const { id } = useParams();
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
        navigate(`/${currentUser.id}/jobPosting/${jobPosting.jobPostingId}`);
      } else {
        setShowApplyPopup(true);
      }
    } else {
      // Eğer oturum açılmamışsa, giriş sayfasına yönlendir
      navigate("/login");
    }
  };

  const loadJobPosting = async () => {
    let jobPostingService = new JobPostingService();
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
                <a className="section" href="/home">
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
                    <div className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
                      {jobPosting.jobTitle?.jobTitleName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      Published on&nbsp;
                      {new Date(jobPosting.publicationDate).toDateString()}
                    </div>
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-4">
                      <div className="mt-2 flex items-center text-sm font-semibold text-gray-600">
                        <BriefcaseIcon
                          className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                        {jobPosting.workingType?.typeName}
                      </div>
                      <div className="mt-2 flex items-center text-sm font-semibold text-gray-600">
                        <MapPinIcon
                          className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
                        {jobPosting.city?.cityName}
                      </div>
                      {jobPosting.salaryMin !== "0" &&
                        jobPosting.salaryMax !== "0" &&
                        jobPosting.salaryMin !== null &&
                        jobPosting.salaryMax !== null && (
                          <div className="mt-2 flex items-center text-sm font-semibold text-gray-600">
                            <CurrencyDollarIcon
                              className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                              aria-hidden="true"
                            />
                            <span>
                              {jobPosting.salaryMin} &ndash;&nbsp;
                              {jobPosting.salaryMax}
                            </span>
                          </div>
                        )}
                      <div className="mt-2 flex items-center text-sm font-semibold text-gray-600">
                        <CalendarIcon
                          className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500"
                          aria-hidden="true"
                        />
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
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="ui list mt-2 items-center text-sm text-gray-600"
                  style={{ marginTop: 32 }}
                >
                  <div className="item">
                    <i className="building icon"></i>
                    <div
                      className="content"
                      style={{ textTransform: "capitalize" }}
                    >
                      <div>
                        &nbsp;&nbsp;
                        <h5 style={{ display: "inline" }}>Company</h5>
                        &nbsp;&nbsp;
                        <span> {jobPosting.employer?.companyName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="item">
                    <i className="mail icon"></i>
                    <div className="content">
                      <div>
                        &nbsp;&nbsp;
                        <h5 style={{ display: "inline" }}>E-mail</h5>
                        &nbsp;&nbsp;
                        <span>
                          <a href={"mailto:" + jobPosting.employer?.email}>
                            &nbsp;{jobPosting.employer?.email}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="item">
                    <i className="linkify icon"></i>
                    <div className="content">
                      <div>
                        &nbsp;&nbsp;
                        <h5 style={{ display: "inline" }}>Website</h5>
                        &nbsp;&nbsp;
                        <span>
                          <a href={jobPosting.employer?.website}>
                            &nbsp;
                            {jobPosting.employer?.website &&
                              jobPosting.employer.website.replace(
                                /^https?:\/\//,
                                ""
                              )}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign="left">
              <Grid.Column width={2} />
              <Grid.Column width={12}>
                <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-6 pb-8 mb-6 ring-1 ring-slate-900/5 shadow-xl font-sans font-normal md:font-medium text-left ">
                  {jobPosting.jobDescription && (
                    <div>
                      <Header content="Job Description" />
                      <Divider />

                      <div
                        dangerouslySetInnerHTML={{
                          __html: jobPosting.jobDescription,
                        }}
                      />
                      <Button
                        style={{ marginTop: 36 }}
                        circular
                        type="button"
                        color="blue"
                        floated="right"
                        size="medium"
                        content="Apply"
                        onClick={handleApplyClick}
                      />
                      {showApplyPopup && (
                        <ApplyPopup onClose={() => setShowApplyPopup(false)} />
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
