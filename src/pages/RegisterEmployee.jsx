import React, { useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "./../services/authUser.service";
import MessageModal from "./../components/MessageModal";
import {
  Container,
  Grid,
  Label,
  Form,
  Button,
  Image,
  Dropdown,
} from "semantic-ui-react";
import employeeImage from "../images/employee.jpg";
import ContentTitle from "../components/ContentTitle";

export default function RegisterEmployee() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const currentYear = new Date().getFullYear();
  const years = [];

  const generateYearOptions = () => {
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push({ key: i, text: i.toString(), value: i });
    }
    return years;
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    identityNumber: "",
    yearOfBirth: selectedYear,
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required Field"),
    lastName: Yup.string().required("Required Field"),
    identityNumber: Yup.string()
      .length(11, "Must be 11 characters length")
      .required("Required Field"),
    yearOfBirth: Yup.date().required("Required Field"),
    userName: Yup.string().required("Required Field"),
    email: Yup.string().email("Not a Valid Email").required("Required Field"),
    password: Yup.string().required("Required Field"),
    confirmPassword: Yup.string()
      .required("Required Field")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  });

  const onSubmit = async (values, { resetForm }) => {
    const {
      userName,
      email,
      password,
      firstName,
      lastName,
      identityNumber,
      yearOfBirth,
    } = values;

    try {
      const response = await AuthService.registerEmployee(
        userName,
        email,
        password,
        firstName,
        lastName,
        identityNumber,
        yearOfBirth
      );

      if (response.data && response.data.message) {
        setSuccess(response.data.success);
        setMessage(response.data.message);
        handleModal(true);
        setTimeout(() => {
          resetForm();
        }, 100);
      } else {
        setMessage("Registration failed");
        handleModal(true);
      }
    } catch (error) {
      setMessage("An error occurred while registering");
      handleModal(true);
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

  return (
    <div>
      <Container className="content">
        <ContentTitle content="Sign Up Employee" />
        <Grid>
          <Grid.Row>
            <Grid.Column width="10" style={{ marginTop: 40 }}>
              <Image src={employeeImage} size="big" rounded />
            </Grid.Column>
            <Grid.Column width="6" style={{ marginTop: 10 }}>
              <Formik>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group widths="equal">
                    <Form.Input
                      className="left-aligned-label"
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      onChange={(event, data) =>
                        handleChange("firstName", data.value)
                      }
                      value={formik.values.firstName}
                    />
                    <Form.Input
                      className="left-aligned-label"
                      name="lastName"
                      placeholder="Enter your last name"
                      label="Last Name"
                      onChange={(event, data) =>
                        handleChange("lastName", data.value)
                      }
                      value={formik.values.lastName}
                    />
                  </Form.Group>
                  <Grid>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        {formik.errors.firstName &&
                          formik.touched.firstName && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.firstName}
                              />
                            </span>
                          )}
                      </Grid.Column>
                      <Grid.Column>
                        {formik.errors.lastName && formik.touched.lastName && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.lastName}
                            />
                          </span>
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <br />
                  <Form.Group widths="equal">
                    <Form.Input
                      className="left-aligned-label"
                      name="identityNumber"
                      label="TR Identity Number"
                      type="number"
                      placeholder="Enter your identity number"
                      onChange={(event, data) =>
                        handleChange("identityNumber", data.value)
                      }
                      value={formik.values.identityNumber}
                    />
                    <Form.Input
                      className="left-aligned-label"
                      label="Year of Birth"
                    >
                      <Dropdown
                        name="dateOfBirth"
                        label="Year of Birth"
                        search
                        placeholder="Select a year"
                        selection
                        options={generateYearOptions()}
                        onChange={(event, { value }) => {
                          formik.setFieldValue("yearOfBirth", value); // value değerini formik değerine atar
                        }}
                        value={formik.values.yearOfBirth} // formik değerini alır
                      />
                    </Form.Input>
                  </Form.Group>
                  <Grid>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        {formik.errors.identityNumber &&
                          formik.touched.identityNumber && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.identityNumber}
                              />
                            </span>
                          )}
                      </Grid.Column>
                      <Grid.Column>
                        {formik.errors.yearOfBirth &&
                          formik.touched.yearOfBirth && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.yearOfBirth}
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

        {message && ( // Only render MessageModal if there's a message to display
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
