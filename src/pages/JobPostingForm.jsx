import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ContentTitle from '../components/ContentTitle'
import JobPostingService from './../services/jobPostingService'

import JobTitleService from './../services/jobTitleService'
import CityService from './../services/cityService'
import WorkingTypeService from './../services/workingTypeService'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Container, Grid, Label, Form } from 'semantic-ui-react'
import MessageModal from '../components/MessageModal'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

let jobPostingService = new JobPostingService()
let jobTitleService = new JobTitleService()
let cityService = new CityService()
let workingTypeService = new WorkingTypeService()

export default function JobPostingForm() {
  const { id } = useParams()
  const [open, setOpen] = useState(false)
  const [jobTitles, setJobTitles] = useState([]) // Renamed state to jobTitles
  const [cities, setCities] = useState([])
  const [workingTypes, setWorkingTypes] = useState([])
  const [wageCurrency, setWageCurrency] = useState('₺')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const editorRef = useRef(null)

  const { user: currentUser } = useSelector((state) => state.auth)

  useEffect(() => {
    if (currentUser) {
      const hasEmployerRole = currentUser.roles.includes('ROLE_EMPLOYER')
      const hasAdminRole = currentUser.roles.includes('ROLE_ADMIN')
      if (hasEmployerRole || hasAdminRole) {
        jobTitleService
          .getJobTitles()
          .then((result) => setJobTitles(result.data.data))
        cityService.getCities().then((result) => setCities(result.data.data))
        workingTypeService
          .getWorkingTypes()
          .then((result) => setWorkingTypes(result.data.data))
      } else {
        navigate('/unauthorized')
      }
    } else {
      navigate('/unauthorized')
    }
  }, [currentUser, navigate])

  const handleModal = (value) => {
    if (!value) {
      setMessage('')
    }
    setOpen(value)
  }

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value)
  }

  const handleCurrencyChange = (event) => {
    setWageCurrency(event.target.value)
  }

  const initialValues = {
    employer: { id: id },
    jobTitle: '',
    city: '',
    workingType: '',
    salaryMin: '',
    salaryMax: '',
    availablePosition: '',
    applicationDeadline: '',
    jobSummary: '',
    jobDescription: '',
    active: true,
  }

  const validationSchema = Yup.object({
    jobTitle: Yup.object().required('Required Field'),
    city: Yup.object().required('Required Field'),
    workingType: Yup.object().required('Required Field'),
    availablePosition: Yup.number()
      .positive('Not a Positive Number')
      .required('Required Field'),
    applicationDeadline: Yup.date().required('Required Field'),
    jobSummary: Yup.string()
      .max(200, 'Over 200 Characters')
      .min(100, 'Less than 100 Characters')
      .required('Required Field'),
    jobDescription: Yup.string()
      .max(20000, 'Over 20000 Characters')
      .required('Required Field'),
  })

  const onSubmit = async (values, { resetForm }) => {
    setMessage('')
    setSuccess(false)
    const jobPostingData = {
      ...values,
      salaryMin: `${wageCurrency}${values.salaryMin}`,
      salaryMax: `${wageCurrency}${values.salaryMax}`,
    }

    if (currentUser.id.toString() === id) {
      jobPostingService.addJobPosting(jobPostingData).then(
        (response) => {
          setSuccess(response.data.success)
          setMessage(response.data.message)
          handleModal(true)
          setTimeout(() => {
            resetForm()
            formik.setFieldValue('jobTitle', '')
            formik.setFieldValue('city', '')
            formik.setFieldValue('workingType', '')
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  })

  return (
    <div>
      <ContentTitle content="Create a Job Posting" />

      <Container className="content">
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign="left">
              <div className="ui breadcrumb">
                <div className="ui breadcrumb">
                  <a className="section" href="/home">
                    Home
                  </a>
                  <i className="right chevron icon divider"></i>
                  <a
                    className="section"
                    href={`/employer/${currentUser.id}/jobPosting/add`}
                  >
                    Post a Job
                  </a>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="ui segment">
          <Grid centered>
            <Grid.Row>
              <Grid.Column width="3" />
              <Grid.Column width="6">
                <Formik>
                  <Form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col mb-1">
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
                          <option
                            key={jobTitle.titleId}
                            value={jobTitle.titleId}
                          >
                            {jobTitle.jobTitleName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formik.errors.jobTitle && formik.touched.jobTitle && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.jobTitle}
                        />
                        <br />
                      </span>
                    )}
                    <br />

                    <div className="flex flex-col mb-1">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="city"
                      >
                        <span>
                          City&nbsp;
                          <span className="text-red-500 select-none">*</span>
                        </span>
                      </label>

                      <select
                        name="city"
                        onChange={(event) =>
                          handleChange('city.cityId', event.target.value)
                        }
                        value={formik.values.city?.cityId || ''}
                        className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                      >
                        <option value="">Select a city...</option>
                        {cities.map((city) => (
                          <option key={city.cityId} value={city.cityId}>
                            {city.cityName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formik.errors.city && formik.touched.city && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.city}
                        />
                        <br />
                      </span>
                    )}
                    <br />

                    <div className="flex flex-col mb-1">
                      <label
                        className="font-poppins font-medium text-md text-gray-800"
                        htmlFor="workingType"
                      >
                        <span>
                          Working type&nbsp;
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
                        className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 text-md shadow-sm"
                      >
                        <option value="">Select a working type...</option>
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
                          <br />
                        </span>
                      )}
                    <br />

                    <div className="flex flex-col mb-1">
                      <label
                        className="font-poppins font-medium text-md text-gray-800  mb-1"
                        htmlFor="availablePosition"
                      >
                        <span>
                          Available position&nbsp;
                          <span className="text-red-500 select-none">*</span>
                        </span>
                      </label>

                      <input
                        name="availablePosition"
                        type="text"
                        className="w-[432px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                        placeholder="Enter available position"
                        onChange={(event) =>
                          handleChange('availablePosition', event.target.value)
                        }
                        value={formik.values.availablePosition}
                      />
                    </div>
                    {formik.errors.availablePosition &&
                      formik.touched.availablePosition && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.availablePosition}
                          />
                          <br />
                        </span>
                      )}
                    <br />
                    <div className="w-[394px] flex flex-col mb-1 mr-[18px]">
                      <label
                        className="font-poppins font-medium text-md text-gray-800 mb-1"
                        htmlFor="applicationDeadline"
                      >
                        <span>
                          Application deadline&nbsp;
                          <span className="text-red-500 select-none">*</span>
                        </span>
                      </label>
                      <input
                        name="applicationDeadline"
                        type="date"
                        className="mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                        onChange={(event) =>
                          handleChange(
                            'applicationDeadline',
                            event.target.value,
                          )
                        }
                        value={formik.values.applicationDeadline}
                        min={new Date().toISOString().split('T')[0]} // Bugünün tarihini alır
                      />
                    </div>

                    {formik.errors.applicationDeadline &&
                      formik.touched.applicationDeadline && (
                        <span>
                          <Label
                            basic
                            pointing
                            color="red"
                            className="orbitron"
                            content={formik.errors.applicationDeadline}
                          />
                          <br />
                          <br />
                        </span>
                      )}
                    <br />
                    <div className="flex flex-row mb-1">
                      <div className="w-[212px] mr-2">
                        <div className="mb-1">
                          <label
                            className="font-poppins font-medium text-md text-gray-800"
                            htmlFor="salaryMin"
                          >
                            <span>Min wage&nbsp;</span>
                          </label>
                        </div>

                        <input
                          name="salaryMin"
                          type="text"
                          className="w-[118px] mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                          placeholder="Enter min wage"
                          onChange={(event) =>
                            handleChange('salaryMin', event.target.value)
                          }
                          value={formik.values.salaryMin}
                        />
                      </div>
                      <div className="w-[212px] mr-2">
                        <div className="mb-1">
                          <label
                            className="font-poppins font-medium text-md text-gray-800 mb-1"
                            htmlFor="salaryMax"
                          >
                            <span>Max wage&nbsp;</span>
                          </label>
                        </div>

                        <input
                          name="salaryMax"
                          type="text"
                          className="rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shafow-sm"
                          placeholder="Enter max wage"
                          onChange={(event) =>
                            handleChange('salaryMax', event.target.value)
                          }
                          value={formik.values.salaryMax}
                        />
                      </div>
                      <div className="w-[86px]">
                        <label className="font-poppins font-medium text-md text-gray-800 mb-1">
                          Currency
                        </label>
                        <select
                          name="wageCurrency"
                          onChange={handleCurrencyChange} // onChange olayını burada tanımladığımız event handler ile eşleştiriyoruz
                          value={wageCurrency}
                          className="mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                        >
                          <option value="₺">₺</option>
                          <option value="$">$</option>
                          <option value="€">€</option>
                          <option value="£">£</option>
                        </select>
                      </div>
                    </div>

                    <br />

                    <div className="w-[394px] flex flex-col mb-1">
                      <label
                        className="font-poppins font-medium text-md text-gray-800 mb-1"
                        htmlFor="jobSummary"
                      >
                        <span>
                          Subtitle&nbsp;
                          <span className="text-red-500 select-none">*</span>
                        </span>
                      </label>

                      <textarea
                        name="jobSummary"
                        className="mt-1 rounded-md border border-gray-500 bg-transparent focus:outline-none focus:border-blue-600 focus:ring-0.5 focus:ring-blue-400 p-2 pr-3 pe-12 text-md shadow-sm"
                        placeholder="Enter subtitle"
                        onChange={(event) =>
                          handleChange('jobSummary', event.target.value)
                        }
                        value={formik.values.jobSummary}
                      />
                    </div>
                    {formik.errors.jobSummary && formik.touched.jobSummary && (
                      <span>
                        <Label
                          basic
                          pointing
                          color="red"
                          className="orbitron"
                          content={formik.errors.jobSummary}
                        />
                        <br />
                        <br />
                      </span>
                    )}
                    <br />
                    <div>
                      <label className="font-poppins font-medium text-md text-gray-800">
                        Description&nbsp;
                        <span className="text-red-500 select-none">*</span>
                      </label>
                      <br />

                      <div className="mt-1">
                        <Editor
                          apiKey="d00hn5i11zkj8gtivr0erf33k621kt5x120e7qnsz2eo7g94"
                          onInit={(evt, editor) => (editorRef.current = editor)}
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
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help',
                          }}
                          onEditorChange={(content) =>
                            formik.setFieldValue('jobDescription', content)
                          }
                          value={formik.values.jobDescription}
                        />
                      </div>
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
                    <button
                      type="submit"
                      className="mt-2 inline-block rounded-lg w-[394px] h-[42px] text-medium text-white font-mulish font-bold hover:bg-shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#4832a8] hover:bg-[#3240a8]"
                    >
                      Create Job Posting
                    </button>
                  </Form>
                </Formik>
              </Grid.Column>
              <Grid.Column width="3" />
            </Grid.Row>
          </Grid>
        </div>
        {message && (
          <MessageModal
            onClose={() => handleModal(false)}
            open={open}
            content={message}
            success={success}
          />
        )}
      </Container>
    </div>
  )
}
