import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ContentTitle from "../components/ContentTitle";
import JobPostingService from "./../services/jobPostingService";

import JobTitleService from "./../services/jobTitleService";
import CityService from "./../services/cityService";
import WorkingTypeService from "./../services/workingTypeService";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Container, Grid, Label, Form, Button } from "semantic-ui-react";
import MessageModal from "../components/MessageModal";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

let jobPostingService = new JobPostingService();
let jobTitleService = new JobTitleService();
let cityService = new CityService();
let workingTypeService = new WorkingTypeService();

export default function JobPostingForm() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [jobTitles, setJobTitles] = useState([]); // Renamed state to jobTitles
  const [cities, setCities] = useState([]);
  const [workingTypes, setWorkingTypes] = useState([]);
  const [wageCurrency, setWageCurrency] = useState("₺");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser && currentUser.roles.includes("ROLE_EMPLOYER")) {
      // Kullanıcı ROLE_EMPLOYER rolüne sahipse, devam et
      jobTitleService
        .getJobTitles()
        .then((result) => setJobTitles(result.data.data));
      cityService.getCities().then((result) => setCities(result.data.data));
      workingTypeService
        .getWorkingTypes()
        .then((result) => setWorkingTypes(result.data.data));
      return;
    } else {
      // Kullanıcı ROLE_EMPLOYER rolüne sahip değilse, anasayfaya yönlendir
      navigate("/");
    }
  }, [currentUser, navigate]);

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

  const workingTypeOptions = workingTypes.map((workingType) => {
    return {
      key: workingType.workingTypeId,
      value: workingType.workingTypeId,
      text: workingType.typeName,
    };
  });

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
    jobTitle: "",
    city: "",
    workingType: "",
    salaryMin: "",
    salaryMax: "",
    availablePosition: "",
    applicationDeadline: "",
    jobSummary: "",
    jobDescription: "",
    active: true,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.object().required("Required Field"),
    city: Yup.object().required("Required Field"),
    workingType: Yup.object().required("Required Field"),
    availablePosition: Yup.number()
      .positive("Not a Positive Number")
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
    const jobPostingData = {
      ...values,
      salaryMin: `${wageCurrency}${values.salaryMin}`,
      salaryMax: `${wageCurrency}${values.salaryMax}`,
    };

    jobPostingService.addJobPosting(jobPostingData).then(
      (response) => {
        setSuccess(response.data.success);
        setMessage(response.data.message);
        handleModal(true);
        setTimeout(() => {
          resetForm();
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
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <div>
      <ContentTitle content="Create a Job Posting" />

      <Container className="content">
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign="left">
              <div className="ui breadcrumb">
                <div className="ui breadcrumb">
                  <a className="section" href="/home">
                    Home
                  </a>
                  <i className="right chevron icon divider"></i>
                  <a
                    className="section"
                    href={`/employer/${currentUser.id}/jobPosting/add`}
                  >
                    Post a Job
                  </a>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="ui segment">
          <Grid centered>
            <Grid.Row>
              <Grid.Column width="3" />
              <Grid.Column width="6">
                <Formik>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Select
                      className="left-aligned-label"
                      name="jobTitle"
                      options={jobTitleOptions}
                      placeholder="Please select a title"
                      label="Title"
                      onChange={(event, data) =>
                        handleChange("jobTitle.titleId", data.value)
                      }
                      value={formik.values.jobTitle.titleId}
                      compact
                      scrolling
                      selection
                      clearable
                      search
                      fluid
                    />
                    {formik.errors.jobTitle && formik.touched.jobTitle && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.jobTitle}
                        />
                        <br />
                      </span>
                    )}
                    <br />

                    <Form.Select
                      className="left-aligned-label"
                      name="city"
                      options={cityOptions}
                      label="City"
                      placeholder="Please select a city"
                      onChange={(event, data) =>
                        handleChange("city.cityId", data.value)
                      }
                      value={formik.values.city.cityId}
                      compact
                      scrolling
                      selection
                      clearable
                      search
                      fluid
                    />
                    {formik.errors.city && formik.touched.city && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.city}
                        />
                        <br />
                      </span>
                    )}
                    <br />

                    <Form.Select
                      className="left-aligned-label"
                      name="workingType"
                      options={workingTypeOptions}
                      label="Working type"
                      placeholder="Please select a working type"
                      onChange={(event, data) =>
                        handleChange("workingType.workingTypeId", data.value)
                      }
                      value={formik.values.workingType.workingTypeId}
                      compact
                      scrolling
                      selection
                      clearable
                      search
                      fluid
                    />
                    {formik.errors.workingType &&
                      formik.touched.workingType && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.workingType}
                          />
                          <br />
                        </span>
                      )}
                    <br />

                    <Form.Input
                      name="availablePosition"
                      label="Available position"
                      type="number"
                      placeholder="1"
                      onChange={(event, data) =>
                        handleChange("availablePosition", data.value)
                      }
                      value={formik.values.availablePosition}
                    />
                    <br />

                    <Form.Input
                      label="Application Deadline"
                      type="date"
                      min={new Date().toISOString().split("T")[0]} // Geçerli tarihi ve saati ayarlayın
                      onChange={(event, data) =>
                        handleChange("applicationDeadline", data.value)
                      }
                      value={formik.values.applicationDeadline}
                    />
                    {formik.errors.applicationDeadline &&
                      formik.touched.applicationDeadline && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.applicationDeadline}
                          />
                          <br />
                          <br />
                        </span>
                      )}
                    <br />

                    <Form.Group widths="equal">
                      <Form.Input
                        className="left-aligned-label"
                        name="salaryMin"
                        label="Min wage"
                        type="number"
                        placeholder="Enter min wage"
                        onChange={formik.handleChange}
                        value={formik.values.salaryMin}
                        width={6}
                      />

                      <Form.Input
                        className="left-aligned-label"
                        name="salaryMax"
                        type="number"
                        label="Max wage"
                        placeholder="Enter max wage"
                        onChange={formik.handleChange}
                        value={formik.values.salaryMax}
                        width={6}
                      />

                      <Form.Select
                        className="left-aligned-label"
                        style={{ marginTop: 23 }}
                        name="Wage currency"
                        options={[
                          { key: "₺", text: "₺", value: "₺" },
                          { key: "$", text: "$", value: "$" },
                          { key: "€", text: "€", value: "€" },
                          { key: "£", text: "£", value: "£" },
                        ]}
                        onChange={(event, data) => setWageCurrency(data.value)}
                        value={wageCurrency}
                        compact
                        scrolling
                        search
                        fluid
                        width={3}
                      />
                    </Form.Group>

                    <br />

                    <Form.TextArea
                      className="field"
                      name="jobSummary"
                      label="Subtitle"
                      onChange={(event, data) =>
                        handleChange("jobSummary", data.value)
                      }
                      value={formik.values.jobSummary}
                    />
                    {formik.errors.jobSummary && formik.touched.jobSummary && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.jobSummary}
                        />
                        <br />
                        <br />
                      </span>
                    )}
                    <br />

                    <label className="font-bold text-sm">Description</label>
                    <br />

                    <div className="mt-1">
                      <Editor
                        apiKey="d00hn5i11zkj8gtivr0erf33k621kt5x120e7qnsz2eo7g94"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        label="asdsa"
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
                      {formik.errors.jobDescription &&
                        formik.touched.jobDescription && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.jobDescription}
                            />
                            <br />
                            <br />
                          </span>
                        )}
                    </div>

                    <Button
                      style={{ marginTop: 5, borderRadius: 7 }}
                      fluid
                      type="submit"
                      color="violet"
                      content="Create new job"
                    />
                  </Form>
                </Formik>
              </Grid.Column>
              <Grid.Column width="3" />
            </Grid.Row>
          </Grid>
        </div>
        {message && (
          <MessageModal
            onClose={() => handleModal(false)}
            open={open}
            content={message}
            success={success}
          />
        )}
      </Container>
    </div>
  );
}
