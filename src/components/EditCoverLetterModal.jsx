import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Divider, Label, Modal } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'
import CoverLetterService from '../services/coverLetterService'
import ResumeSubmitPopup from './ResumeSubmitPopup'

let letterService = new CoverLetterService()
export default function EditCoverLetterModal({
  letterId,
  open,
  setOpen,
  showPopupCallback,
}) {
  const { id } = useParams()
  const [letter, setLetter] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (letterId !== '' && letterId !== undefined) {
      loadLetter()
    }
    setModalOpen(open)
  }, [open])

  const loadLetter = async () => {
    try {
      const result = await letterService.getLetterById(letterId)
      const letterData = result.data.data

      formik.setFieldValue('letterId', letterData.letterId || '')
      formik.setFieldValue('letterName', letterData.letterName || '')
      formik.setFieldValue('letterContent', letterData.letterContent || '')

      setLetter(letterData)
    } catch (error) {
      console.error('An error occurred while loading letter data:', error)
    }
  }

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
      formik.resetForm()
    }
    setModalOpen(value)
    setOpen(value)

    formik.setFieldValue('letterId', '')
    formik.setFieldValue('letterName', '')
  }

  const handleDismissPopup = () => {
    setShowPopup(false)
  }

  const initialValues = {
    employee: { id: id },
    letterId: letterId,
    letterName: '',
    letterContent: '',
  }

  const validationSchema = Yup.object({
    letterName: Yup.string()
      .max(30, 'Over 30 Characters')
      .min(3, 'Less than 3 Characters')
      .required('Required Field'),
    letterContent: Yup.string().required('Required Field'),
  })

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)

    letterService.updateLetter(values).then(
      (response) => {
        setSuccess(response.data.success)
        setMessage(response.data.message)
        setShowPopup(true)
        setTimeout(() => {
          resetForm()
          showPopupCallback()
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
    <Modal
      onClose={() => handleModal(false)}
      onOpen={() => handleModal(true)}
      open={modalOpen}
      size="tiny"
      className="ui modal"
    >
      <div className="header">
        <div className="flex justify-between">
          <div>Cover Letter</div>
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
          <div className="flex justify-center mt-5">
            <div className="content">
              <div className="w-[394px] flex flex-col mb-3">
                <label
                  className="font-poppins font-medium text-md text-gray-800 mb-1"
                  htmlFor="letterName"
                >
                  <span>
                    Cover letter name&nbsp;
                    <span className="text-red-500 select-none">*</span>
                  </span>
                </label>
                <input
                  name="letterName"
                  type="text"
                  className="rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                  placeholder="Enter cover letter name"
                  onChange={formik.handleChange}
                  value={formik.values.letterName}
                />
              </div>

              <div className="grid justify-items-center">
                {formik.errors.letterName && formik.touched.letterName && (
                  <span>
                    <Label
                      basic
                      pointing
                      color="red"
                      className="orbitron"
                      content={formik.errors.letterName}
                    />
                  </span>
                )}
              </div>

              <div className="w-[394px] flex flex-col mb-1">
                <label
                  className="font-poppins font-medium text-md text-gray-800 mb-1"
                  htmlFor="letterContent"
                >
                  <span>
                    Cover letter content&nbsp;
                    <span className="text-red-500 select-none">*</span>
                  </span>
                </label>

                <textarea
                  name="letterContent"
                  className="rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                  placeholder="Enter letter content"
                  onChange={formik.handleChange}
                  value={formik.values.letterContent}
                />
              </div>
              <div className="grid justify-items-center">
                {formik.errors.letterContent &&
                  formik.touched.letterContent && (
                    <span>
                      <Label
                        basic
                        pointing
                        color="red"
                        className="orbitron"
                        content={formik.errors.letterContent}
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
              Update letter
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
