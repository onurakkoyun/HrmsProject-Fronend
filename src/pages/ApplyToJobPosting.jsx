import React, { useEffect, useState, Fragment } from "react";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import ApplyService from "../services/applyService";
import JobPostingService from "../services/jobPostingService";
import ResumeService from "../services/resumeService";
import CoverLetterService from "../services/coverLetterService";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Label } from "semantic-ui-react";
import ResumeSubmitPopup from "../components/ResumeSubmitPopup";
import EditCoverLetterModal from "../components/EditCoverLetterModal";
import ContentTitle from "../components/ContentTitle";

const applyService = new ApplyService();
const jobPostingService = new JobPostingService();
const resumeService = new ResumeService();
const letterService = new CoverLetterService();

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ApplyToJobPosting(open, setOpen, showPopupCallback) {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [jobPosting, setJobPosting] = useState({});
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [letterEdited, setLetterEdited] = useState(false);
  const [letterEditModalOpen, setLetterEditModalOpen] = useState(false);
  const [letterEditRefId, setLetterEditRefId] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditLetterPopup, setShowEditLetterPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.roles.includes("ROLE_EMPLOYEE")) {
      navigate("/unauthorized");
    } else {
      loadJobPosting();
      resumeService.getResumesByEmployeeId(currentUser.id).then((result) => {
        setResumes(result.data.data);
      });
      letterService.getLettersByEmployeeId(currentUser.id).then((result) => {
        setCoverLetters(result.data.data);
      });
      if (letterEdited) {
        setLetterEdited(false);
      }
    }
  }, [letterEdited]);

  const loadJobPosting = async () => {
    const result = await jobPostingService.getJobPostingById(id);
    const resultData = result.data.data;
    setJobPosting(resultData);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  const handleDismissPopup = () => {
    setShowPopup(false);
  };

  const handleLetterEditClick = (newLetterId) => {
    setLetterEditRefId(newLetterId);
    setLetterEditModalOpen(true);
  };

  const formatDateTime = (date) => {
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("tr-TR", options).format(date);
  };

  const initialValues = {
    employee: { id: currentUser.id },
    jobPosting: { jobPostingId: id },
    resume: "",
    coverLetter: "",
  };

  const validationSchema = Yup.object().shape({
    resume: Yup.object().required("Required Field"),
    coverLetter: Yup.object().required("Required Field"),
  });

  const onSubmit = async (values, { resetForm }) => {
    setMessage("");
    setSuccess(false);

    applyService.addApplication(values).then(
      (response) => {
        setSuccess(response.data.success);
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          resetForm();
        }, 3000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccess(false);
      }
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });
  return (
    <div className="p-2 bg-gray-50">
      <Formik>
        <Form onSubmit={formik.handleSubmit}>
          <div className="max-w-screen-lg mx-auto px-2 md:px-[216px] mt-[72px]">
            <div className="mr-8 w-full">
              <ContentTitle content="Apply to a Job Posting" />
            </div>
            <div className="text-left">
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
                <i className="right chevron icon divider"></i>
                <a
                  className="section"
                  href={`/apply/jobPosting/${jobPosting.jobPostingId}`}
                >
                  Apply
                </a>
              </div>
            </div>
            <h5 className="text-left">Apply to Job Posting</h5>
            <section className="rounded-sm bg-white border justify-items-center p-3 mb-3">
              <div className="max-w-full">
                {/* Buraya employer fotoğrafi eklenecek sütun olarak */}
                <div className="font-mulish text-left grid-rows-3">
                  <div className="font-bold text-[15px] mb-1">
                    {jobPosting.jobTitle?.jobTitleName}
                  </div>
                  <div className="text-[13px] text-sm mb-1">
                    {jobPosting.employer?.companyName}
                  </div>
                  <div className="text-[12px] text-gray-600">
                    {jobPosting.city?.cityName} &bull;{" "}
                    {jobPosting.workingType?.typeName}
                  </div>
                </div>
              </div>
            </section>
            <section className="rounded-sm bg-white border justify-items-center p-3">
              <div>
                <Listbox
                  value={formik.values.resume.resumeId || ""}
                  onChange={(value) => handleChange("resume.resumeId", value)}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label>
                        <div className="font-mulish font-bold text-left text-[15px] mb-1">
                          <span>Resume&nbsp;*</span>
                        </div>
                      </Listbox.Label>
                      <div className="relative mt-2 mb-4">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-2 pr-5 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5a2bdb] sm:text-sm sm:leading-6">
                          <div className="">
                            {formik.values.resume?.resumeId ? (
                              <div className="flex justify-between items-center ml-1 truncate">
                                <div>
                                  {
                                    resumes.find(
                                      (resume) =>
                                        resume.resumeId ===
                                        formik.values.resume.resumeId
                                    )?.resumeName
                                  }
                                </div>
                                <div className="flex w-7 ml-3">
                                  <div className="border-e-2 border-gray-400">
                                    <Link
                                      to={`/employee/${id}/resume/${formik.values.resume.resumeId}`}
                                      className="font-bold text-[13.5px] text-green-500 hover:text-green-700 mr-3"
                                    >
                                      Edit
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              "--- Select a resume ---"
                            )}
                          </div>
                          <span className="pointer-events-none absolute inset-y-[0px] right-1 ml-[0px] flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-3 w-3 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 max-h-11 w-full overflow-auto rounded-md py-1 bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {resumes.map((resume) => (
                              <Listbox.Option
                                key={resume.resumeId}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-[#5a2bdb] text-white"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-1 pl-2 pr-4"
                                  )
                                }
                                value={resume.resumeId}
                                onChange={(event) =>
                                  handleChange("resume.resumeId", {
                                    resumeId: event,
                                  })
                                }
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-bold"
                                            : "font-normal",
                                          "ml-3 block truncate"
                                        )}
                                      >
                                        {resume.resumeName}&nbsp;&mdash;&nbsp;
                                        {formatDateTime(
                                          new Date(resume.creationDate)
                                        )}
                                      </span>
                                    </div>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-[#5a2bdb]",
                                          "absolute inset-y-[0px] right-[0px] flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-3 w-3"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                        {formik.errors.resume && formik.touched.resume && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.resume}
                            />
                            <br />
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div>
                <div>
                  <Listbox
                    value={formik.values.coverLetter.letterId || ""}
                    onChange={(value) =>
                      handleChange("coverLetter.letterId", value)
                    }
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label>
                          <div className="font-mulish font-bold text-left text-[15px] mb-1">
                            <span>Cover letter&nbsp;*</span>
                          </div>
                        </Listbox.Label>
                        <div className="relative mt-2 mb-4">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-2 pr-5 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5a2bdb] sm:text-sm sm:leading-6">
                            <div className="">
                              {formik.values.coverLetter?.letterId ? (
                                <div className="flex justify-between items-center ml-1 truncate">
                                  <div>
                                    {
                                      coverLetters.find(
                                        (coverLetter) =>
                                          coverLetter.letterId ===
                                          formik.values.coverLetter.letterId
                                      )?.letterName
                                    }
                                  </div>
                                  <div className="flex w-7 ml-3">
                                    <div className="border-e-2 border-gray-400">
                                      <Link
                                        className="font-bold text-[13.5px] text-green-500 hover:cursor-pointer hover:text-green-700 mr-3"
                                        onClick={() => {
                                          handleLetterEditClick(
                                            formik.values.coverLetter.letterId
                                          );
                                        }}
                                      >
                                        Edit
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                "--- Select a cover letter ---"
                              )}
                            </div>
                            <span className="pointer-events-none absolute inset-y-[0px] right-1 ml-[0px] flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-3 w-3 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 max-h-11 w-full overflow-auto rounded-md py-1 bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {coverLetters.map((coverLetter) => (
                                <Listbox.Option
                                  key={coverLetter.letterId}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "bg-[#5a2bdb] text-white"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-1 pl-2 pr-4"
                                    )
                                  }
                                  value={coverLetter.letterId}
                                  onChange={(event) =>
                                    handleChange("coverLetter.letterId", {
                                      letterId: event,
                                    })
                                  }
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-bold"
                                              : "font-normal",
                                            "ml-3 block truncate"
                                          )}
                                        >
                                          {coverLetter.letterName}
                                          &nbsp;&mdash;&nbsp;
                                          {formatDateTime(
                                            new Date(coverLetter.creationDate)
                                          )}
                                        </span>
                                      </div>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-[#5a2bdb]",
                                            "absolute inset-y-[0px] right-[0px] flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-3 w-3"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                          {formik.errors.coverLetter &&
                            formik.touched.coverLetter && (
                              <span>
                                <Label
                                  basic
                                  pointing
                                  color="red"
                                  className="orbitron"
                                  content={formik.errors.coverLetter}
                                />
                                <br />
                              </span>
                            )}
                        </div>
                      </>
                    )}
                  </Listbox>
                  <EditCoverLetterModal
                    letterId={letterEditRefId}
                    open={letterEditModalOpen}
                    setOpen={setLetterEditModalOpen}
                    showPopupCallback={() => {
                      setShowEditLetterPopup(true);
                      setLetterEdited(true);
                    }}
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-3 py-2 font-bold rounded-lg text-white transition ease-in-out delay-0 bg-[#5a2bdb] hover:-translate-y-0 hover:scale-110 hover:bg-opacity-90 duration-300"
                >
                  Complete
                </button>
                {showPopup && (
                  <ResumeSubmitPopup
                    message={{
                      title: success ? "Apply saved" : "Apply failed",
                      content: message,
                    }}
                    success={success}
                    handleDismissPopup={handleDismissPopup}
                  />
                )}
              </div>
            </section>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
