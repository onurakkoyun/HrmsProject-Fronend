import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Divider, Label, Modal } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import ResumeService from "../services/resumeService";
import ResumeSubmitPopup from "./ResumeSubmitPopup";

export default function ResumeModal({ open, setOpen, showPopupCallback }) {
  const { id } = useParams();
  const [resumeName, setResumeName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  let resumeService = new ResumeService();

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  const handleModal = (value) => {
    if (!value) {
      setMessage("");
    }
    setModalOpen(value);
    setResumeName("");
    setOpen(value);
  };

  const initialValues = {
    employee: { id: id },
    resumeName: "",
  };

  const validationSchema = Yup.object({
    resumeName: Yup.string()
      .max(50, "Over 50 Characters")
      .min(3, "Less than 3 Characters")
      .required("Required Field"),
  });

  const onSubmit = async (values, { resetForm }) => {
    setMessage("");
    setSuccess(false);

    resumeService.addResume(values).then(
      (response) => {
        setSuccess(response.data.success);
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          resetForm();
          showPopupCallback();
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
  const handleDismissPopup = () => {
    setShowPopup(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <Modal
      onClose={() => handleModal(false)}
      onOpen={() => handleModal(true)}
      open={modalOpen}
      size="small"
      className="ui modal"
    >
      <div className="header">Create Resume</div>

      <Formik>
        <Form onSubmit={formik.handleSubmit}>
          <div className="flex justify-center mt-5 mb-5">
            <div className="content">
              <div className="grid grid-rows-1">
                <label
                  className="grid justify-items-start text-md text-gray-800 font-bold ml-0.5 mb-1"
                  htmlFor="resumeName"
                >
                  <span>Name your resume</span>
                </label>
                <input
                  name="resumeName"
                  type="text"
                  className="w-auto lg:w-[512px] rounded-md border-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                  placeholder="Enter resume name"
                  onChange={formik.handleChange}
                  value={formik.values.resumeName}
                />
              </div>
              <div className="grid justify-items-center">
                {formik.errors.resumeName && formik.touched.resumeName && (
                  <span>
                    <Label
                      basic
                      pointing
                      color="red"
                      className="orbitron"
                      content={formik.errors.resumeName}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
          <Divider />

          <div className="flex justify-end mt-2 mb-2 mr-[106px]">
            <button
              type="submit"
              className="inline-block rounded px-3 py-2 text-medium font-medium text-white hover:bg-shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-600 hover:bg-green-800"
            >
              Create Resume
            </button>
          </div>

          {showPopup && (
            <ResumeSubmitPopup
              message={{
                title: "Changes saved",
                content: "Resume created successfully",
              }}
              handleDismissPopup={handleDismissPopup}
            />
          )}
        </Form>
      </Formik>
    </Modal>
  );
}
