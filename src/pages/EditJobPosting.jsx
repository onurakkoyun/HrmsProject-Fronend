import React, { useEffect, useRef, useState } from "react";
import ContentTitle from "../components/ContentTitle";
import { Formik, useFormik } from "formik";
import { Form, Label } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import JobPostingService from "../services/jobPostingService";
import JobTitleService from "../services/jobTitleService";
import CityService from "../services/cityService";
import WorkingTypeService from "../services/workingTypeService";
import * as Yup from "yup";
import { Editor } from "@tinymce/tinymce-react";
import MessageModal from "../components/MessageModal";

let jobPostingService = new JobPostingService();
let jobTitleService = new JobTitleService();
let cityService = new CityService();
let workingTypeService = new WorkingTypeService();
export default function EditJobPosting() {
  const { id } = useParams();
  const { jobPostingId } = useParams();
  const [jobPosting, setJobPosting] = useState({});
  const [open, setOpen] = useState(false);
  const [jobTitles, setJobTitles] = useState([]); // Renamed state to jobTitles
  const [cities, setCities] = useState([]);
  const [workingTypes, setWorkingTypes] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(jobPostingId);
    loadJobPosting();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const hasEmployerRole = currentUser.roles.includes("ROLE_EMPLOYER");
      const hasAdminRole = currentUser.roles.includes("ROLE_ADMIN");
      if (hasEmployerRole || hasAdminRole) {
        jobTitleService
          .getJobTitles()
          .then((result) => setJobTitles(result.data.data));
        cityService.getCities().then((result) => setCities(result.data.data));
        workingTypeService
          .getWorkingTypes()
          .then((result) => setWorkingTypes(result.data.data));
      } else {
        navigate("/unauthorized");
      }
    } else {
      navigate("/unauthorized");
    }
  }, [currentUser, navigate]);

  const loadJobPosting = async () => {
    try {
      const result = await jobPostingService.getJobPostingById(jobPostingId);
      const jobPostingData = result.data.data;

      formik.setFieldValue("jobTitle", jobPostingData.jobTitle || "");
      formik.setFieldValue("city", jobPostingData.city || "");
      formik.setFieldValue("workingType", jobPostingData.workingType || "");
      formik.setFieldValue("salaryMin", jobPostingData.salaryMin || "");
      formik.setFieldValue("salaryMax", jobPostingData.salaryMax || "");
      formik.setFieldValue(
        "salaryCurrency",
        jobPostingData.salaryCurrency || ""
      );
      formik.setFieldValue(
        "availablePosition",
        jobPostingData.availablePosition || ""
      );
      formik.setFieldValue(
        "applicationDeadline",
        jobPostingData.applicationDeadline || ""
      );
      formik.setFieldValue("jobSummary", jobPostingData.jobSummary || "");
      formik.setFieldValue(
        "jobDescription",
        jobPostingData.jobDescription || ""
      );
      formik.setFieldValue("active", jobPostingData.active || "");

      setJobPosting(jobPostingData);
    } catch (error) {
      console.error("An error occurred while loading job posting data:", error);
    }
  };

  const handleModal = (value) => {
    if (!value) {
      setMessage("");
    }
    setOpen(value);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  const initialValues = {
    employer: { id: id },
    jobPostingId: jobPostingId,
    jobTitle: { titleId: "", jobTitleName: "" },
    city: { cityId: "", cityName: "" },
    workingType: { workingTypeId: "", typeName: "" },
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "",
    availablePosition: "",
    applicationDeadline: "",
    jobSummary: "",
    jobDescription: "",
    active: true,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.object().shape({
      titleId: Yup.number().required("Required Field"),
    }),
    city: Yup.object().shape({
      cityId: Yup.number().required("Required Field"),
    }),
    workingType: Yup.object().shape({
      workingTypeId: Yup.number().required("Required Field"),
    }),
    availablePosition: Yup.number()
      .positive("Enter positive number")
      .required("Required Field"),
    applicationDeadline: Yup.date().required("Required Field"),
    jobSummary: Yup.string()
      .max(200, "Over 200 Characters")
      .min(100, "Less than 100 Characters")
      .required("Required Field"),
    jobDescription: Yup.string()
      .max(20000, "Over 20000 Characters")
      .required("Required Field"),
  });

  const onSubmit = async (values, { resetForm }) => {
    setMessage("");
    setSuccess(false);

    if (currentUser.id.toString() === id) {
      jobPostingService.updateJobPosting(values).then(
        (response) => {
          setSuccess(response.data.success);
          setMessage(response.data.message);
          handleModal(true);
          setTimeout(() => {
            resetForm();
            formik.setFieldValue("jobTitle", "");
            formik.setFieldValue("city", "");
            formik.setFieldValue("workingType", "");
          }, 100);
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
    } else {
      navigate("/unauthorized");
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <div className="mx-auto md:mx-auto lg:px-[202px]">
      <div className="mr-8 w-full">
        <ContentTitle content="Edit Job Posting" />
      </div>
      <section className="rounded-lg bg-white sm:p-2 md:p-3 lg:p-7 shadow-xl border-2 justify-items-center max-w-screen-full mx-auto">
        <div>
          <Formik>
            <Form onSubmit={formik.handleSubmit}>
              <div className="grid grid-rows-8 justify-center text-left space-y-4">
                <div className="flex flex-col w-[432px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="jobTitle"
                  >
                    <span>
                      Job Title&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>

                  <select
                    name="jobTitle"
                    onChange={(event) =>
                      handleChange("jobTitle.titleId", event.target.value)
                    }
                    value={formik.values.jobTitle?.titleId || ""}
                    className="w-full mt-1 rounded-lg border-indigo-300 text-gray-700"
                  >
                    <option value="">Select a job title...</option>
                    {jobTitles.map((jobTitle) => (
                      <option key={jobTitle.titleId} value={jobTitle.titleId}>
                        {jobTitle.jobTitleName}
                      </option>
                    ))}
                  </select>

                  <div className="grid justify-items-start">
                    {(formik.errors.jobTitle?.titleId || "") &&
                      (formik.touched.jobTitle?.titleId || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.jobTitle?.titleId || ""}
                          />
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col w-[432px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="city"
                  >
                    <span>
                      City&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>

                  <select
                    name="City"
                    onChange={(event) =>
                      handleChange("city.cityId", event.target.value)
                    }
                    value={formik.values.city?.cityId || ""}
                    className="w-full mt-1 rounded-lg border-indigo-300 text-gray-700"
                  >
                    <option value="">Select a city...</option>
                    {cities.map((city) => (
                      <option key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>

                  <div className="grid justify-items-start">
                    {(formik.errors.city?.cityId || "") &&
                      (formik.touched.city?.cityId || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.city?.cityId || ""}
                          />
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col w-[432px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="workingType"
                  >
                    <span>
                      Working Type&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>

                  <select
                    name="WorkingType"
                    onChange={(event) =>
                      handleChange(
                        "workingType.workingTypeId",
                        event.target.value
                      )
                    }
                    value={formik.values.workingType?.workingTypeId || ""}
                    className="w-full mt-1 rounded-lg border-indigo-300 text-gray-700"
                  >
                    <option value="">Select a working type...</option>
                    {workingTypes.map((workingType) => (
                      <option
                        key={workingType.workingTypeId}
                        value={workingType.workingTypeId}
                      >
                        {workingType.typeName}
                      </option>
                    ))}
                  </select>

                  <div className="grid justify-items-start">
                    {(formik.errors.workingType?.workingTypeId || "") &&
                      (formik.touched.workingType?.workingTypeId || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={
                              formik.errors.workingType?.workingTypeId || ""
                            }
                          />
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex flex-col w-[432px]">
                  <label
                    className="font-poppins mb-1 font-medium text-md text-gray-800"
                    htmlFor="availablePosition"
                  >
                    <span>
                      Available Position&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>
                  <input
                    className="w-full text-gray-700"
                    type="number"
                    value={formik.values.availablePosition}
                    onChange={(event) =>
                      handleChange("availablePosition", event.target.value)
                    }
                  />
                  <div className="grid justify-items-start">
                    {(formik.errors.availablePosition || "") &&
                      (formik.touched.availablePosition || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.availablePosition || ""}
                          />
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex flex-col w-[432px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800 mb-1"
                    htmlFor="applicationDeadline"
                  >
                    <span>
                      Application deadline&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>
                  <input
                    name="applicationDeadline"
                    type="date"
                    className="mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                    onChange={(event) =>
                      handleChange("applicationDeadline", event.target.value)
                    }
                    value={formik.values.applicationDeadline}
                    min={new Date().toISOString().split("T")[0]} // Bugünün tarihini alır
                  />
                  <div className="grid justify-items-start">
                    {(formik.errors.applicationDeadline || "") &&
                      (formik.touched.applicationDeadline || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.applicationDeadline || ""}
                          />
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex flex-row w-[432px]">
                  <div className="w-[212px] mr-2">
                    <div className="mb-1">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="salaryMin"
                      >
                        <span>Min wage&nbsp;</span>
                      </label>
                    </div>

                    <input
                      name="salaryMin"
                      type="text"
                      className="w-[118px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                      placeholder="Enter min wage"
                      onChange={(event) =>
                        handleChange("salaryMin", event.target.value)
                      }
                      value={formik.values.salaryMin}
                    />
                  </div>
                  <div className="w-[212px] mr-2">
                    <div className="mb-1">
                      <label
                        className="font-poppins font-medium text-md text-gray-800 mb-1"
                        htmlFor="salaryMax"
                      >
                        <span>Max wage&nbsp;</span>
                      </label>
                    </div>

                    <input
                      name="salaryMax"
                      type="text"
                      className="rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                      placeholder="Enter max wage"
                      onChange={(event) =>
                        handleChange("salaryMax", event.target.value)
                      }
                      value={formik.values.salaryMax}
                    />
                  </div>
                  <div className="w-[86px]">
                    <label className="font-poppins font-medium text-md text-gray-800 mb-1">
                      Currency
                    </label>
                    <select
                      name="salaryCurrency"
                      onChange={(event) =>
                        handleChange("salaryCurrency", event.target.value)
                      }
                      value={formik.values.salaryCurrency}
                      className="mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                    >
                      <option value="₺">₺</option>
                      <option value="$">$</option>
                      <option value="€">€</option>
                      <option value="£">£</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col w-[432px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800 mb-1"
                    htmlFor="jobSummary"
                  >
                    <span>
                      Subtitle&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>

                  <textarea
                    name="jobSummary"
                    className="mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                    placeholder="Enter subtitle"
                    onChange={(event) =>
                      handleChange("jobSummary", event.target.value)
                    }
                    value={formik.values.jobSummary}
                  />
                  <div className="grid justify-items-start">
                    {(formik.errors.jobSummary || "") &&
                      (formik.touched.jobSummary || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.jobSummary || ""}
                          />
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col w-[432px]">
                  <label className="font-poppins font-medium text-md text-gray-800 mb-1">
                    Description&nbsp;
                    <span className="text-red-500 select-none">*</span>
                  </label>

                  <Editor
                    apiKey="d00hn5i11zkj8gtivr0erf33k621kt5x120e7qnsz2eo7g94"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    maxHeight="50"
                    init={{
                      height: 300,
                      menubar: true,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
                    }}
                    onEditorChange={(content) =>
                      formik.setFieldValue("jobDescription", content)
                    }
                    value={formik.values.jobDescription}
                  />
                  <div className="grid justify-items-start">
                    {(formik.errors.jobDescription || "") &&
                      (formik.touched.jobDescription || "") && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.jobDescription || ""}
                          />
                        </span>
                      )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-2 inline-block rounded-lg w-full h-[42px] text-medium text-white font-mulish font-bold hover:bg-shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#4832a8] hover:bg-[#3240a8]"
                >
                  Update
                </button>
              </div>
            </Form>
          </Formik>
        </div>

        {message && (
          <MessageModal
            onClose={() => handleModal(false)}
            open={open}
            content={message}
            success={success}
          />
        )}
      </section>
    </div>
  );
}
