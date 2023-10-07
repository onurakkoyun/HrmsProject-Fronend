import React, { useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "./../services/authUser.service";
import MessageModal from "./../components/MessageModal";
import { Container, Grid, Label, Form, Button, Image } from "semantic-ui-react";
import employerImage from "../images/employer3.png";
import ContentTitle from "../components/ContentTitle";

export default function RegisterEmployee() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const initialValues = {
    companyName: "",
    website: "",
    phoneNumber: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    userName: Yup.string().required("Required Field"),
    email: Yup.string()
      .email("Not a valid email address")
      .required("Required Field"),
    companyName: Yup.string().required("Required Field"),
    website: Yup.string()
      .url("Not a valid website address")
      .required("Required Field"),
    phoneNumber: Yup.string()
      .matches(/^\d{11}$/, "Geçerli bir telefon numarası girin.") // 10 haneli sayı olmalı
      .required("Required Field"),
    password: Yup.string().required("Required Field"),
    confirmPassword: Yup.string()
      .required("Required Field")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  });

  const onSubmit = (values, { resetForm }) => {
    setMessage("");
    setSuccess(false);
    const { userName, email, password, companyName, website, phoneNumber } =
      values;

    AuthService.registerEmployer(
      userName,
      email,
      password,
      companyName,
      website,
      phoneNumber
    ).then(
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

  const handleModal = (value) => {
    setOpen(value);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <div>
      <Container className="content">
        <ContentTitle content="Sign Up Employer" />
        <Grid>
          <Grid.Row>
            <Grid.Column width="10" style={{ marginTop: 40 }}>
              <Image src={employerImage} size="big" rounded />
            </Grid.Column>
            <Grid.Column width="6" style={{ marginTop: 10 }}>
              <Formik>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group widths="equal">
                    <Form.Input
                      className="left-aligned-label"
                      name="companyName"
                      label="Company name"
                      placeholder="Enter company name"
                      onChange={(event, data) =>
                        handleChange("companyName", data.value)
                      }
                      value={formik.values.companyName}
                    />
                    <Form.Input
                      className="left-aligned-label"
                      name="website"
                      placeholder="https://www.example.com"
                      label="Website address"
                      onChange={(event, data) =>
                        handleChange("website", data.value)
                      }
                      value={formik.values.website}
                    />
                  </Form.Group>
                  <Grid>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        {formik.errors.companyName &&
                          formik.touched.companyName && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.companyName}
                              />
                            </span>
                          )}
                      </Grid.Column>
                      <Grid.Column>
                        {formik.errors.website && formik.touched.website && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.website}
                            />
                          </span>
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <br />
                  <Form.Input
                    className="left-aligned-label"
                    name="userName"
                    placeholder="Enter your username"
                    label="Username"
                    onChange={(event, data) =>
                      handleChange("userName", data.value)
                    }
                    value={formik.values.userName}
                  />
                  {formik.errors.userName && formik.touched.userName && (
                    <span>
                      <Label
                        basic
                        pointing
                        color="red"
                        className="orbitron"
                        content={formik.errors.userName}
                      />
                    </span>
                  )}
                  <br />

                  <Form.Input
                    className="left-aligned-label"
                    name="email"
                    label="E-mail"
                    placeholder="example@example.com"
                    onChange={(event, data) =>
                      handleChange("email", data.value)
                    }
                    value={formik.values.email}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <span>
                      <Label
                        basic
                        pointing
                        color="red"
                        className="orbitron"
                        content={formik.errors.email}
                      />
                    </span>
                  )}
                  <br />
                  <Form.Input
                    className="left-aligned-label"
                    name="phoneNumber"
                    type="tel"
                    maxLength="11"
                    label="Phone number"
                    placeholder="Enter company's phone"
                    onChange={(event, data) =>
                      handleChange("phoneNumber", data.value)
                    }
                    value={formik.values.phoneNumber}
                  />
                  {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                    <span>
                      <Label
                        basic
                        pointing
                        color="red"
                        className="orbitron"
                        content={formik.errors.phoneNumber}
                      />
                      <br />
                    </span>
                  )}
                  <br />
                  <Form.Group widths="equal">
                    <Form.Input
                      className="left-aligned-label"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      onChange={(event, data) =>
                        handleChange("password", data.value)
                      }
                      value={formik.values.password}
                    />

                    <Form.Input
                      className="left-aligned-label"
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      onChange={(event, data) =>
                        handleChange("confirmPassword", data.value)
                      }
                      value={formik.values.confirmPassword}
                    />
                  </Form.Group>
                  <Grid>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        {formik.errors.password && formik.touched.password && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.password}
                            />
                          </span>
                        )}
                      </Grid.Column>
                      <Grid.Column>
                        {formik.errors.confirmPassword &&
                          formik.touched.confirmPassword && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.confirmPassword}
                              />
                            </span>
                          )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Button
                    style={{ marginTop: 5 }}
                    circular
                    fluid
                    type="submit"
                    color="violet"
                    content="Sign up"
                  />
                </Form>
              </Formik>
            </Grid.Column>
            <Grid.Column width="3" />
          </Grid.Row>
        </Grid>

        <MessageModal
          onClose={() => handleModal(false)}
          onOpen={() => handleModal(true)}
          open={open}
          content={message}
          success={success}
        />
      </Container>
    </div>
  );
}
