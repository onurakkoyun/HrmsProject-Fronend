import React from "react";
import { Routes, Route } from "react-router-dom";
import Navi from "./Navi";
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
import ResumeList from "../pages/ResumeList";

export default function Dashboard() {
  return (
    <div>
      <Navi />

      <div className="mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/employee/:id/resumes" element={<ResumeList />} />
          <Route
            path="/employee/:id/resume/:resumeId"
            element={<EditResume />}
          />
          {/* Buraya resume id eklenecek /employee/:id/edit/resume/:id*/}
          <Route path="/employee/add" element={<RegisterEmployee />} />
          <Route path="/employee/:id/profile" element={<EmployeeProfile />} />
          <Route path="/employer/add" element={<RegisterEmployer />} />
          <Route
            path="/employer/:id/jobPosting/add"
            element={<JobPostingForm />}
          />
          <Route path="/:id/jobPosting/:id" element={<ApplyToJobPosting />} />
          <Route path="/jobPostings/listall" element={<JobPostingsList />} />
          <Route path="/jobPosting/:id" element={<JobPostingDetail />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
