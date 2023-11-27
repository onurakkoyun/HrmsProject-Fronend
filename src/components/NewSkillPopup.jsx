import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Divider, Label, Modal } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'
import SkillService from '../services/skillService'
import ResumeSubmitPopup from './ResumeSubmitPopup'

const skillService = new SkillService()

export default function NewSkillPopup({ open, setOpen, showPopupCallback }) {
  const { resumeId } = useParams()
  const [skills, setSkills] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
      formik.resetForm()
    }
    setModalOpen(value)
    setOpen(value)
    formik.setFieldValue('skillName', '')
  }

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value)
  }

  const initialValues = {
    resume: { resumeId: resumeId },
    skillName: '',
  }

  const validationSchema = Yup.object({
    skillName: Yup.string().required('Required Field'),
  })

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)

    skillService.addSkill(values).then(
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
          <div>Skill</div>
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
                  className="grid justify-items-start font-poppins font-medium text-md text-gray-800ml-0.5 mb-1"
                  htmlFor="skillName"
                >
                  <span>
                    Skill name&nbsp;
                    <span className="text-red-500 select-none">*</span>
                  </span>
                </label>
                <input
                  name="skillName"
                  type="text"
                  className="w-auto lg:w-[512px] rounded-md border-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                  placeholder="Enter skill name"
                  onChange={(event) =>
                    handleChange('skillName', event.target.value)
                  }
                  value={formik.values.skillName}
                />
              </div>
              <div className="grid justify-items-center">
                {formik.errors.skillName && formik.touched.skillName && (
                  <span>
                    <Label
                      basic
                      pointing
                      color="red"
                      className="orbitron"
                      content={formik.errors.skillName}
                    />
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
