import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Divider, Label, Modal } from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import ResumeService from "../services/resumeService";
import ResumeSubmitPopup from "./ResumeSubmitPopup";
import { useSelector } from "react-redux";

const resumeService = new ResumeService();

export default function EditResumeModal({
  resumeId,
  open,
  setOpen,
  showPopupCallback,
}) {
  const [resume, setResume] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [showEditResumePopup, setShowEditResumePopup] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (resumeId !== "" && resumeId !== undefined) {
      loadResume();
    }
    setModalOpen(open);
  }, [open]);

  const loadResume = async () => {
    try {
      const result = await resumeService.getResumeById(resumeId);
      const resumeData = result.data.data;

      formik.setFieldValue("resumeId", resumeData.resumeId || "");
      formik.setFieldValue("resumeName", resumeData.resumeName || "");

      setResume(resumeData);
    } catch (error) {
      console.error("An error occurred while loading resume data:", error);
    }
  };

  const handleModal = (value) => {
    if (!value) {
      setMessage("");
    }
    setModalOpen(value);
    setOpen(value);
    formik.setFieldValue("resumeId", "");
    formik.setFieldValue("resumeName", "");
  };

  const initialValues = {
    resumeId: resumeId,
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

    resumeService.updateResumeName(values).then(
      (response) => {
        setSuccess(response.data.success);
        setMessage(response.data.message);
        setShowEditResumePopup(true);
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
    setShowEditResumePopup(false);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <div className="bg-blue-500 opacity-10">
      <Modal
        onClose={() => handleModal(false)}
        onOpen={() => handleModal(true)}
        open={modalOpen}
        size="tiny"
        className="ui modal"
      >
        <div className="header">
          <div className="flex justify-between">
            <div>Update Resume</div>
            <div className="hover:cursor-pointer hover:text-red-500">
              <i
                onClick={() => {
                  handleModal(false);
                }}
                className="close icon"
              />
            </div>
          </div>
        </div>

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

            <div className="flex justify-end mt-2 mb-2 mr-[12px]">
              <button
                type="submit"
                className="font-mulish font-bold inline-block rounded px-3 py-2 text-medium text-white hover:bg-shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-600 hover:bg-green-800"
              >
                Update resume
              </button>
            </div>

            {showEditResumePopup && (
              <ResumeSubmitPopup
                message={{
                  title: "Changes saved",
                  content: message,
                }}
                success={success}
                handleDismissPopup={handleDismissPopup}
              />
            )}
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}
