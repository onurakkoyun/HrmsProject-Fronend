import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Divider, Label, Modal } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'
import ExperienceService from '../services/experienceService'
import ResumeSubmitPopup from './ResumeSubmitPopup'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import JobTitleService from '../services/jobTitleService'
import WorkingTypeService from '../services/workingTypeService'

let jobTitleService = new JobTitleService()
const experienceService = new ExperienceService()
let workingTypeService = new WorkingTypeService()

export default function NewExperiencePopup({
  open,
  setOpen,
  showPopupCallback,
}) {
  const { resumeId } = useParams()
  const [modalOpen, setModalOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [jobTitles, setJobTitles] = useState([])
  const [workingTypes, setWorkingTypes] = useState([])
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [content, setContent] = useState('')
  const editorRef = useRef(null)

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  useEffect(() => {
    setModalOpen(open)
    jobTitleService
      .getJobTitles()
      .then((result) => setJobTitles(result.data.data))
    workingTypeService
      .getWorkingTypes()
      .then((result) => setWorkingTypes(result.data.data))
  }, [open])

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
      formik.resetForm()
    }
    setModalOpen(value)
    setOpen(value)
    formik.setFieldValue('companyName', '')
    formik.setFieldValue('companySector', '')
    formik.setFieldValue('cityName', '')
    formik.setFieldValue('jobDescription', '')
    formik.setFieldValue('experienceStart', '')
    formik.setFieldValue('experienceEnd', '')
    formik.setFieldValue('workingType', '')
    formik.setFieldValue('jobTitle', '')
  }

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value)
  }

  const initialValues = {
    resume: { resumeId: resumeId },
    companyName: '',
    companySector: '',
    cityName: '',
    jobDescription: '',
    experienceStart: '',
    experienceEnd: '',
    workingType: '',
    jobTitle: '',
  }

  const validationSchema = Yup.object({
    companyName: Yup.string()
      .max(50, 'Over 50 Characters')
      .min(3, 'Less than 3 Characters')
      .required('Required Field'),
    companySector: Yup.string().required('Required Field'),
    cityName: Yup.string().required('Required Field'),
    jobDescription: Yup.string()
      .max(20000, 'Over 20000 Characters')
      .min(3, 'Less than 3 Characters')
      .required('Required Field'),
    experienceStart: Yup.date().required('Required Field'),
    experienceEnd: Yup.date().required('Required Field'),
    workingType: Yup.object().required('Required Field'),
    jobTitle: Yup.object().required('Required Field'),
  })

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)

    experienceService.addExperience(values).then(
      (response) => {
        setSuccess(response.data.success)
        setMessage(response.data.message)
        setShowPopup(true)
        setTimeout(() => {
          showPopupCallback()
          formik.setFieldValue('workingType', '')
          formik.setFieldValue('jobTitle', '')
          resetForm()
        }, 100)
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()

        setMessage(resMessage)
        setSuccess(false)
      },
    )
  }

  const handleDismissPopup = () => {
    setShowPopup(false)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  })

  return (
    <Modal
      onClose={() => handleModal(false)}
      onOpen={() => handleModal(true)}
      open={modalOpen}
      size="large"
      className="ui modal"
    >
      <div className="header">
        <div className="flex justify-between">
          <div> Experience</div>
          <div className="hover:cursor-pointer hover:text-red-500">
            <i
              onClick={() => {
                handleModal(false)
              }}
              className="close icon"
            />
          </div>
        </div>
      </div>

      <Formik>
        <Form onSubmit={formik.handleSubmit}>
          <div className="scrolling content flex justify-center gap-5 sm:grid-cols-1 mt-5 mb-5 ml-7">
            <div className="w-1/2 grid justify-items-start">
              <div className="mb-4">
                <div className="flex flex-col">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="companyName"
                  >
                    <span>
                      Company Name&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>

                  <input
                    name="companyName"
                    type="text"
                    className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                    placeholder="Enter company name"
                    onChange={(event) =>
                      handleChange('companyName', event.target.value)
                    }
                    value={formik.values.companyName}
                  />
                </div>
                <div className="grid justify-items-center">
                  {formik.errors.companyName && formik.touched.companyName && (
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
                </div>
              </div>
              <div className="mb-4">
                <div className="flex flex-col">
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
                      handleChange('jobTitle.titleId', event.target.value)
                    }
                    value={formik.values.jobTitle?.titleId || ''}
                    className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                  >
                    <option value="">Select a job title...</option>
                    {jobTitles.map((jobTitle) => (
                      <option key={jobTitle.titleId} value={jobTitle.titleId}>
                        {jobTitle.jobTitleName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid justify-items-center">
                  {formik.errors.companyName && formik.touched.companyName && (
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
                </div>
              </div>
              <div className="flex flex-row mb-4">
                <div className="w-1/2">
                  <div className="flex flex-col mr-[18px]">
                    <label
                      className="font-poppins font-medium text-md text-gray-800"
                      htmlFor="experienceStart"
                    >
                      <span>
                        Starting Date&nbsp;
                        <span className="text-red-500 select-none">*</span>
                      </span>
                    </label>

                    <input
                      name="experienceStart"
                      type="date"
                      className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                      onChange={(event) =>
                        handleChange('experienceStart', event.target.value)
                      }
                      value={formik.values.experienceStart}
                    />
                  </div>
                  <div className="grid justify-items-center">
                    {formik.errors.experienceStart &&
                      formik.touched.experienceStart && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.experienceStart}
                          />
                        </span>
                      )}
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="flex flex-col">
                    <label
                      className="font-poppins font-medium text-md text-gray-800"
                      htmlFor="experienceEnd"
                    >
                      <span>
                        Ending Date&nbsp;
                        <span className="text-red-500 select-none">*</span>
                      </span>
                    </label>

                    <input
                      name="experienceEnd"
                      type="date"
                      className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                      onChange={(event) =>
                        handleChange('experienceEnd', event.target.value)
                      }
                      value={formik.values.experienceEnd}
                    />
                  </div>
                  <div className="grid justify-items-center">
                    {formik.errors.experienceEnd &&
                      formik.touched.experienceEnd && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.experienceEnd}
                          />
                        </span>
                      )}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex flex-col mr-[10px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="companySector"
                  >
                    <span>
                      Company Sector&nbsp;
                      <span className="text-red-500 select-none">*</span>
                    </span>
                  </label>

                  <input
                    name="companySector"
                    type="text"
                    className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                    placeholder="Enter company sector"
                    onChange={(event) =>
                      handleChange('companySector', event.target.value)
                    }
                    value={formik.values.companySector}
                  />
                </div>
                <div className="grid justify-items-center">
                  {formik.errors.companySector &&
                    formik.touched.companySector && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.companySector}
                        />
                      </span>
                    )}
                </div>
              </div>
              <div className="flex flex-row mb-4">
                <div className="w-1/2">
                  <div className="flex flex-col mr-[18px]">
                    <label
                      className="font-poppins font-medium text-md text-gray-800"
                      htmlFor="cityName"
                    >
                      <span>
                        City&nbsp;
                        <span className="text-red-500 select-none">*</span>
                      </span>
                    </label>

                    <input
                      name="cityName"
                      type="text"
                      className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                      placeholder="Enter city"
                      onChange={(event) =>
                        handleChange('cityName', event.target.value)
                      }
                      value={formik.values.cityName}
                    />
                  </div>
                  <div className="grid justify-items-center">
                    {formik.errors.cityName && formik.touched.cityName && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.cityName}
                        />
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="flex flex-col">
                    <label
                      className="font-poppins font-medium text-md text-gray-800"
                      htmlFor="jobTitle"
                    >
                      <span>
                        Working Type&nbsp;
                        <span className="text-red-500 select-none">*</span>
                      </span>
                    </label>

                    <select
                      name="workingType"
                      onChange={(event) =>
                        handleChange(
                          'workingType.workingTypeId',
                          event.target.value,
                        )
                      }
                      value={formik.values.workingType?.workingTypeId || ''}
                      className="w-[212px] mt-1 rounded-md border border-gray-500 focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                    >
                      <option value="">Select a job title</option>
                      {workingTypes.map((workingType) => (
                        <option
                          key={workingType.workingTypeId}
                          value={workingType.workingTypeId}
                        >
                          {workingType.typeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid justify-items-center">
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
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 grid justify-items-start">
              <div className="w-[462px]">
                <div
                  className="font-poppins font-medium text-md text-gray-800 ml-0.5 mb-1"
                  htmlFor="companyName"
                >
                  Job Description&nbsp;
                  <span className="text-red-500 select-none">*</span>
                </div>
                <Editor
                  apiKey="d00hn5i11zkj8gtivr0erf33k621kt5x120e7qnsz2eo7g94"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  label="asdsa"
                  maxHeight="50"
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help',
                  }}
                  onEditorChange={(content) =>
                    formik.setFieldValue('jobDescription', content)
                  }
                  value={formik.values.jobDescription}
                />
              </div>
              <div className="grid justify-items-center">
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
            </div>
          </div>
          <Divider />

          <div className="flex justify-end p-2">
            <button
              type="cancel"
              className="inline-block rounded mr-2 px-3 py-2 text-medium font-medium text-white hover:bg-shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-red-600 hover:bg-red-800"
              onClick={() => {
                handleModal(false)
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-block rounded px-3 py-2 text-medium font-medium text-white hover:bg-shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-600 hover:bg-green-800"
            >
              Save
            </button>
          </div>
          {showPopup && (
            <ResumeSubmitPopup
              message={{
                title: success ? 'Saved' : 'Failed',
                content: message,
              }}
              success={success}
              handleDismissPopup={handleDismissPopup}
            />
          )}
        </Form>
      </Formik>
    </Modal>
  )
}
