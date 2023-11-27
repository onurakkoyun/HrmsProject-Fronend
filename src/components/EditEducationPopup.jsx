import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Divider, Label, Modal } from 'semantic-ui-react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Editor } from '@tinymce/tinymce-react'
import EducationService from '../services/educationService'
import { useRef } from 'react'
import ResumeSubmitPopup from './ResumeSubmitPopup'
import 'semantic-ui-css/semantic.min.css'

const educationService = new EducationService()

export default function EditEducationPopup({
  educationId,
  open,
  setOpen,
  showPopupCallback,
}) {
  const [education, setEducation] = useState({})
  const [showEndingDate, setShowEndingDate] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (educationId !== '' && educationId !== undefined) {
      loadEducation()
    }
    setModalOpen(open)
  }, [open])

  const loadEducation = async () => {
    try {
      const result = await educationService.getEducationById(educationId)
      const resumeData = result.data.data

      formik.setFieldValue('educationId', resumeData.educationId || '')
      formik.setFieldValue('educationLevel', resumeData.educationLevel || '')
      formik.setFieldValue('universityName', resumeData.universityName || '')
      formik.setFieldValue('faculty', resumeData.faculty || '')
      formik.setFieldValue('department', resumeData.department || '')
      formik.setFieldValue('cityName', resumeData.cityName || '')
      formik.setFieldValue('description', resumeData.description || '')
      formik.setFieldValue('degreeType', resumeData.degreeType || '')
      formik.setFieldValue(
        'graduationDegree',
        resumeData.graduationDegree || '',
      )
      formik.setFieldValue('educationType', resumeData.educationType || '')
      formik.setFieldValue(
        'educationLanguage',
        resumeData.educationLanguage || '',
      )
      formik.setFieldValue('startingDate', resumeData.startingDate || '')
      formik.setFieldValue('endingDate', resumeData.endingDate || '')
      formik.setFieldValue('continue', resumeData.continue || '')
      if (resumeData.continue === true) {
        setShowEndingDate(false)
      } else {
        setShowEndingDate(true)
      }

      setEducation(resumeData)
    } catch (error) {
      console.error('An error occurred while loading resume data:', error)
    }
  }

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
      formik.resetForm()
    }
    setModalOpen(value)
    setOpen(value)

    formik.setFieldValue('educationLevel', '')

    formik.setFieldValue('universityName', '')

    formik.setFieldValue('faculty', '')

    formik.setFieldValue('department', '')

    formik.setFieldValue('cityName', '')

    formik.setFieldValue('description', '')

    formik.setFieldValue('degreeType', '')

    formik.setFieldValue('graduationDegree', '')

    formik.setFieldValue('educationType', '')

    formik.setFieldValue('educationLanguage', '')

    formik.setFieldValue('startingDate', '')

    formik.setFieldValue('endingDate', '')

    formik.setFieldValue('continue', false)
  }

  const handleDismissPopup = () => {
    setShowPopup(false)
  }

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value)
    if (fieldName === 'continue') {
      if (value === true) {
        formik.setFieldValue('endingDate', '')
      }
      setShowEndingDate(!value)
      formik.validateForm()
    }
  }

  const validationSchema = Yup.object({
    educationLevel: Yup.string().required('Required Field'),
    universityName: Yup.string().required('Required Field'),
    faculty: Yup.string().required('Required Field'),
    department: Yup.string().required('Required Field'),
    cityName: Yup.string().required('Required Field'),
    description: Yup.string().required('Required Field'),
    degreeType: Yup.string().when('continue', {
      is: false,
      then: () =>
        Yup.number()
          .required('Required Field')
          .oneOf([4, 5, 10, 100], 'Invalid Degree Type'),
    }),
    graduationDegree: Yup.number()
      .when('continue', {
        is: false,
        then: () =>
          Yup.number()
            .positive('Must be a positive number')
            .required('Required Field'),
      })
      .when('degreeType', {
        is: 4,
        then: () =>
          Yup.number()
            .max(4, 'Maximum graduation degree is 4')
            .positive('Must be a positive number')
            .required('Required Field'),
      })
      .when('degreeType', {
        is: 5,
        then: () =>
          Yup.number()
            .max(5, 'Maximum graduation degree is 5')
            .positive('Must be a positive number')
            .required('Required Field'),
      })
      .when('degreeType', {
        is: 10,
        then: () =>
          Yup.number()
            .max(10, 'Maximum graduation degree is 10')
            .positive('Must be a positive number')
            .required('Required Field'),
      })
      .when('degreeType', {
        is: 100,
        then: () =>
          Yup.number()
            .max(100, 'Maximum graduation degree is 100')
            .positive('Must be a positive number')
            .required('Required Field'),
      }),
    educationType: Yup.string().required('Required Field'),
    educationLanguage: Yup.string().required('Required Field'),
    continue: Yup.boolean(),
    startingDate: Yup.date()
      .max(new Date(), 'Starting date must be in the past')
      .required('Required Field'),
    endingDate: Yup.date()
      .min(Yup.ref('startingDate'), 'Ending date must be after starting date')
      .when('continue', {
        is: false,
        then: () =>
          Yup.date()
            .required('Required Field')
            .min(
              Yup.ref('startingDate'),
              'Ending date must be after starting date',
            ),
      }),
  })

  const initialValues = {
    educationId: educationId,
    educationLevel: '',
    universityName: '',
    faculty: '',
    department: '',
    cityName: '',
    description: '',
    degreeType: '',
    graduationDegree: '',
    educationType: '',
    educationLanguage: '',
    startingDate: '',
    endingDate: '',
    continue: false,
  }

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)
    educationService.updateEducation(values).then(
      (response) => {
        setSuccess(response.data.success)
        setMessage(response.data.message)
        setShowPopup(true)
        setShowEndingDate(true)
        setTimeout(() => {
          showPopupCallback()
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  })

  return (
    <div>
      <Modal
        onClose={() => handleModal(false)}
        onOpen={() => handleModal(true)}
        open={modalOpen}
        size="large"
        className="ui menu"
      >
        <div className="header">
          <div className="flex justify-between">
            <div>Edit education</div>
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
            <div className="scrolling content flex justify-left gap-5 sm:grid-cols-1 mt-5 mb-5 ml-7">
              <div className="w-1/2 grid justify-items-start">
                <div className="mb-4">
                  <div className="flex flex-col">
                    <label
                      className="font-poppins font-medium text-md text-gray-800"
                      htmlFor="educationLevel"
                    >
                      <span>Education Level</span>
                    </label>
                    <select
                      name="educationLevel"
                      onChange={(event) =>
                        handleChange('educationLevel', event.target.value)
                      }
                      value={formik.values.educationLevel || ''}
                      className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                    >
                      <option value="">Education level</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Master">Master</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  <div className="grid justify-items-center">
                    {formik.errors.educationLevel &&
                      formik.touched.educationLevel && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.educationLevel}
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
                        htmlFor="educationType"
                      >
                        <span>Education Type</span>
                      </label>

                      <select
                        name="educationType"
                        onChange={(event) =>
                          handleChange('educationType', event.target.value)
                        }
                        value={formik.values.educationType || ''}
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                      >
                        <option value="">Education Type</option>
                        <option value="Evening Education">
                          Evening Education
                        </option>
                        <option value="Distance Education">
                          Distance Education
                        </option>
                        <option value="Formal Education">
                          Formal Education
                        </option>
                        <option value="Open Education">Open Education</option>
                      </select>
                    </div>
                    <div className="grid justify-items-center">
                      {formik.errors.educationType &&
                        formik.touched.educationType && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.educationType}
                            />
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="educationLanguage"
                      >
                        <span>Education Language</span>
                      </label>
                      <select
                        name="educationLanguage"
                        onChange={(event) =>
                          handleChange('educationLanguage', event.target.value)
                        }
                        value={formik.values.educationLanguage || ''}
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                      >
                        <option value="">Select a language...</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                    <div className="grid justify-items-center">
                      {formik.errors.educationLanguage &&
                        formik.touched.educationLanguage && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.educationLanguage}
                            />
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row mb-4">
                  <div className="w-1/3">
                    <div className="flex flex-col mr-[18px]">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="startingDate"
                      >
                        <span>Starting Date</span>
                      </label>

                      <input
                        name="startingDate"
                        type="date"
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                        onChange={(event) =>
                          handleChange('startingDate', event.target.value)
                        }
                        value={formik.values.startingDate}
                      />
                    </div>
                    <div className="grid justify-items-center">
                      {formik.errors.startingDate &&
                        formik.touched.startingDate && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.startingDate}
                            />
                          </span>
                        )}
                    </div>
                  </div>
                  {showEndingDate && (
                    <div>
                      <div className="flex flex-col mr-[32px] ml-[24px]">
                        <label
                          className="font-poppins font-medium text-md text-gray-800"
                          htmlFor="endingDate"
                        >
                          <span>Ending Date</span>
                        </label>

                        <input
                          name="endingDate"
                          type="date"
                          className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                          onChange={(event) =>
                            handleChange('endingDate', event.target.value)
                          }
                          value={formik.values.endingDate}
                        />
                      </div>
                      <div className="grid justify-items-center">
                        {formik.errors.endingDate &&
                          formik.touched.endingDate && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.endingDate}
                              />
                            </span>
                          )}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      showEndingDate ? '' : 'ml-[136px]'
                    }`}
                  >
                    <label
                      className="mb-3 font-poppins font-medium text-md text-center text-gray-800"
                      htmlFor="continue"
                    >
                      <span>Still continue</span>
                    </label>
                    <input
                      name="continue"
                      type="checkbox"
                      className="rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                      onChange={(event) =>
                        handleChange('continue', event.target.checked)
                      }
                      checked={formik.values.continue}
                    />
                  </div>
                  <div className="grid justify-items-center">
                    {formik.errors.continue && formik.touched.continue && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.continue}
                        />
                      </span>
                    )}
                  </div>
                </div>

                {showEndingDate && (
                  <div className="flex flex-row mb-4">
                    <div className="w-1/2">
                      <div className="flex flex-col mr-[10px]">
                        <label
                          className="font-poppins font-medium text-md text-gray-800"
                          htmlFor="degreeType"
                        >
                          <span>Degree Type</span>
                        </label>

                        <select
                          name="degreeType"
                          onChange={(event) =>
                            handleChange('degreeType', event.target.value)
                          }
                          value={formik.values.degreeType || ''}
                          className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                        >
                          <option value="">Degree Type</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                      <div className="grid justify-items-center">
                        {formik.errors.degreeType &&
                          formik.touched.degreeType && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.degreeType}
                              />
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex flex-col mr-[8px]">
                        <label
                          className="font-poppins font-medium text-md text-gray-800"
                          htmlFor="graduationDegree"
                        >
                          <span>Graduation Degree</span>
                        </label>

                        <input
                          name="graduationDegree"
                          type="number"
                          className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                          placeholder="Enter graduation degree"
                          onChange={(event) =>
                            handleChange('graduationDegree', event.target.value)
                          }
                          value={formik.values.graduationDegree}
                        />
                      </div>
                      <div className="grid justify-items-center">
                        {formik.errors.graduationDegree &&
                          formik.touched.graduationDegree && (
                            <span>
                              <Label
                                basic
                                pointing
                                color="red"
                                className="orbitron"
                                content={formik.errors.graduationDegree}
                              />
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-row mb-4">
                  <div className="w-1/2">
                    <div className="flex flex-col mr-[8px]">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="universityName"
                      >
                        <span>University</span>
                      </label>

                      <input
                        name="universityName"
                        type="text"
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                        placeholder="Enter a university name"
                        onChange={(event) =>
                          handleChange('universityName', event.target.value)
                        }
                        value={formik.values.universityName}
                      />
                    </div>
                    <div className="grid justify-items-center">
                      {formik.errors.universityName &&
                        formik.touched.universityName && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.universityName}
                            />
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="faculty"
                      >
                        <span>Faculty</span>
                      </label>

                      <input
                        name="faculty"
                        type="text"
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                        placeholder="Enter a faculty"
                        onChange={(event) =>
                          handleChange('faculty', event.target.value)
                        }
                        value={formik.values.faculty}
                      />
                    </div>
                    <div className="grid justify-items-center">
                      {formik.errors.faculty && formik.touched.faculty && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.faculty}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col mr-[8px] ml-[8px]">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="department"
                      >
                        <span>Department</span>
                      </label>

                      <input
                        name="department"
                        type="text"
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                        placeholder="Enter a department"
                        onChange={(event) =>
                          handleChange('department', event.target.value)
                        }
                        value={formik.values.department}
                      />
                    </div>
                    <div className="grid justify-items-center">
                      {formik.errors.department &&
                        formik.touched.department && (
                          <span>
                            <Label
                              basic
                              pointing
                              color="red"
                              className="orbitron"
                              content={formik.errors.department}
                            />
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col mr-[8px]">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="cityName"
                      >
                        <span>City</span>
                      </label>

                      <input
                        name="cityName"
                        type="text"
                        className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                        placeholder="Enter a city"
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
                </div>
                <div className="w-1/2 grid">
                  <div>
                    <div
                      className="font-poppins font-medium text-md text-gray-800 ml-0.5 mb-1"
                      htmlFor="description"
                    >
                      Description:
                    </div>
                    <div className="w-[872px]">
                      <Editor
                        apiKey="d00hn5i11zkj8gtivr0erf33k621kt5x120e7qnsz2eo7g94"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        label="asdsa"
                        maxHeight="50"
                        init={{
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
                          formik.setFieldValue('description', content)
                        }
                        value={formik.values.description}
                      />
                    </div>
                  </div>
                  <div className="grid justify-items-center">
                    {formik.errors.description &&
                      formik.touched.description && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.description}
                          />
                          <br />
                          <br />
                        </span>
                      )}
                  </div>
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
                  title: success ? 'Edit saved' : 'Edit failed',
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
  )
}
