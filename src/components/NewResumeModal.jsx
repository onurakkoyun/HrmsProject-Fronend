import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Divider, Label, Modal } from 'semantic-ui-react'
import { useNavigate, useParams } from 'react-router-dom'
import ResumeService from '../services/resumeService'
import ResumeSubmitPopup from './ResumeSubmitPopup'
import { useSelector } from 'react-redux'

export default function NewResumeModal({ open, setOpen, showPopupCallback }) {
  const { id } = useParams()
  const { user: currentUser } = useSelector((state) => state.auth)
  const [resumeName, setResumeName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  let navigate = useNavigate()

  let resumeService = new ResumeService()

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
    }
    setModalOpen(value)
    setResumeName('')
    setOpen(value)
  }

  const initialValues = {
    employee: { id: id },
    resumeName: '',
  }

  const validationSchema = Yup.object({
    resumeName: Yup.string()
      .max(50, 'Over 50 Characters')
      .min(3, 'Less than 3 Characters')
      .required('Required Field'),
  })

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)
    console.log(currentUser.id, id)

    if (currentUser.id === parseInt(id)) {
      resumeService.addResume(values).then(
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
    } else {
      navigate('/unauthorized')
    }
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
          <div>Create Resume</div>
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
          <div className="flex justify-center mt-5 mb-5">
            <div className="content">
              <div className="grid grid-rows-1">
                <label
                  className="grid justify-items-start text-sm text-gray-800 font-bold ml-0.5 mb-1"
                  htmlFor="resumeName"
                >
                  <span>Name your resume</span>
                </label>
                <input
                  name="resumeName"
                  type="text"
                  className="w-auto lg:w-[512px] rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-sm shafow-sm"
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
              Create resume
            </button>
          </div>

          {showPopup && (
            <ResumeSubmitPopup
              message={{
                title: 'Changes saved',
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
