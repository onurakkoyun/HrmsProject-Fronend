import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Divider, Label, Modal } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'
import LanguageService from '../services/languageService'
import ResumeSubmitPopup from './ResumeSubmitPopup'
import { useRef } from 'react'
import axios from 'axios'
import authHeader from '../services/auth-header'

const languageService = new LanguageService()

export default function NewLanguagePopup({ open, setOpen, showPopupCallback }) {
  const { resumeId } = useParams()
  const [languages, setLanguages] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    setModalOpen(open)
    axios
      .get('http://localhost:8080/api/language-list/getAllLanguageList', {
        headers: authHeader(),
      })
      .then((response) => {
        setLanguages(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching language options: ', error)
      })
  }, [open])

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
      formik.resetForm()
    }
    setModalOpen(value)
    setOpen(value)
    formik.setFieldValue('languageName', '')
    formik.setFieldValue('languageLevel', '')
  }

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value)
  }

  const initialValues = {
    resume: { resumeId: resumeId },
    languageName: '',
    languageLevel: '',
  }

  const validationSchema = Yup.object({
    languageName: Yup.string().required('Required Field'),
    languageLevel: Yup.string().required('Required Field'),
  })

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)

    languageService.addLanguage(values).then(
      (response) => {
        setSuccess(response.data.success)
        setMessage(response.data.message)
        setShowPopup(true)
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
      size="tiny"
      className="ui modal"
    >
      <div className="header">
        <div className="flex justify-between">
          <div>Language</div>
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
          <div className="scrolling content flex justify-center gap-5 sm:grid-cols-1 mt-5 mb-5">
            <div className="flex flex-row mb-4">
              <div className="w-1/2">
                <div className="flex flex-col mr-[18px]">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="languageName"
                  >
                    <span>
                      Language&nbsp;
                      <span className="text-red-500 select-none ">*</span>
                    </span>
                  </label>

                  <select
                    name="languageName"
                    onChange={(event) =>
                      handleChange('languageName', event.target.value)
                    }
                    value={formik.values.languageName || ''}
                    className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                  >
                    <option value="">Select language...</option>
                    {languages.map((language) => (
                      <option
                        key={language.languageId}
                        value={language.languageName}
                      >
                        {language.languageName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid justify-items-center">
                  {formik.errors.languageName &&
                    formik.touched.languageName && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.languageName}
                        />
                      </span>
                    )}
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex flex-col">
                  <label
                    className="font-poppins font-medium text-md text-gray-800"
                    htmlFor="languageLevel"
                  >
                    <span>
                      Level&nbsp;
                      <span className="text-red-500 select-none ">*</span>
                    </span>
                  </label>
                  <select
                    name="languageLevel"
                    onChange={(event) =>
                      handleChange('languageLevel', event.target.value)
                    }
                    value={formik.values.languageLevel || ''}
                    className="w-[212px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                  >
                    <option value="">Select a language...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Pre Intermediate">Pre Intermediate</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Upper Intermediate">
                      Upper Intermediate
                    </option>
                    <option value="Advanced">Advanced</option>
                    <option value="Advanced (Native)">Advanced (Native)</option>
                  </select>
                </div>
                <div className="grid justify-items-center">
                  {formik.errors.languageLevel &&
                    formik.touched.languageLevel && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.languageLevel}
                        />
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
