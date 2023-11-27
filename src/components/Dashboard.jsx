import React from "react";
import { Routes, Route } from "react-router-dom";
import Navi2 from "./Navi2";
import Home from "../pages/Home";
import RegisterEmployee from "../pages/RegisterEmployee";
import RegisterEmployer from "../pages/RegisterEmployer";
import Login from "./Login";
import JobPostingsList from "../pages/JobPostingsList";
import JobPostingForm from "../pages/JobPostingForm";
import JobPostingDetail from "../pages/JobPostingDetail";
import ApplyToJobPosting from "../pages/ApplyToJobPosting";
import EditResume from "../pages/EditResume";
import Footer from "./Footer";
import AboutUs from "../pages/AboutUs";
import EmployeeProfile from "../pages/EmployeeProfile";
import EmployerJobPostingsList from "../pages/EmployerJobPostingsList";
import ResumeList from "../pages/ResumeList";
import AppliedJobList from "../pages/AppliedJobList";
import UnauthorizedPage from "./UnauthorizedPage";
import CoverLetterList from "../pages/CoverLetterList";
import JobPostingApplicantsList from "../pages/JobPostingApplicantsList";
import ApplicationPreview from "../pages/ApplicationPreview";
import EmployerProfile from "../pages/EmployerProfile";

export default function Dashboard() {
  return (
    <div>
      <Navi2 />

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route
            path="/application/:applicationId/resume/:resumeId/preview"
            element={<ApplicationPreview />}
          />
          <Route
            path="/employee/:id/appliedJobs"
            element={<AppliedJobList />}
          />
          <Route path="/employee/:id/resumes" element={<ResumeList />} />
          <Route
            path="/employee/:id/resume/:resumeId"
            element={<EditResume />}
          />
          <Route path="/employee/:id/letters" element={<CoverLetterList />} />
          <Route path="/employee/add" element={<RegisterEmployee />} />
          <Route path="/employee/:id/profile" element={<EmployeeProfile />} />
          <Route path="/employer/add" element={<RegisterEmployer />} />
          <Route
            path="/employer/:id/jobPosting/add"
            element={<JobPostingForm />}
          />
          <Route
            path="/employer/:id/jobPostingsList"
            element={<EmployerJobPostingsList />}
          />
          <Route path="/employer/:id/profile" element={<EmployerProfile />} />
          <Route
            path="jobPosting/:id/applicantsList"
            element={<JobPostingApplicantsList />}
          />
          <Route path="/apply/jobposting/:id" element={<ApplyToJobPosting />} />
          <Route path="/jobPostings/listall" element={<JobPostingsList />} />
          <Route path="/jobPosting/:id" element={<JobPostingDetail />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
