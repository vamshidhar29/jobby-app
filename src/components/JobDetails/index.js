import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

class JobDetails extends Component {
  state = {
    jobDetails: [],
    isLoading: false,
    lifeAtCompany: [],
    skillsList: [],
    similarJobsList: [],
    isFail: false,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({isLoading: true})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const jsonResponse = await response.json()
      const filterJobDetail = {
        companyLogoUrl: jsonResponse.job_details.company_logo_url,
        companyWebsiteUrl: jsonResponse.job_details.company_website_url,
        employmentType: jsonResponse.job_details.employment_type,
        id: jsonResponse.job_details.id,
        jobDescription: jsonResponse.job_details.job_description,
        location: jsonResponse.job_details.location,
        packagePerAnnum: jsonResponse.job_details.package_per_annum,
        rating: jsonResponse.job_details.rating,
        title: jsonResponse.job_details.title,
      }
      const filterLifeAtCompany = {
        description: jsonResponse.job_details.life_at_company.description,
        imageUrl: jsonResponse.job_details.life_at_company.image_url,
      }
      const filterSkillsList = jsonResponse.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const filterSimilarJobsList = jsonResponse.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDetails: filterJobDetail,
        lifeAtCompany: filterLifeAtCompany,
        skillsList: filterSkillsList,
        similarJobsList: filterSimilarJobsList,
        isLoading: false,
        isFail: false,
      })
    } else {
      this.setState({isLoading: false, isFail: true})
    }
  }

  retry = () => {
    this.fetchJobDetails()
  }

  failureView = () => {
    const {jobDetails, skillsList, lifeAtCompany, similarJobsList, isFail} =
      this.state

    return (
      <div>
        {isFail ? (
          <div className="jobDetails-bg">
            <Header />
            <div className="failureView-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
              />
              <h1>Oops! Something Went Wrong</h1>
              <p>We cannot seem to find the page you are looking for.</p>
              <button onClick={this.retry} className="retry-btn" type="button">
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="jobDetails-bg">
            <Header />
            <div className="card-jobDetails">
              <div className="card-company-logo-container-jobDetails">
                <img
                  className="company-logo-card-jobDetails"
                  src={jobDetails.companyLogoUrl}
                  alt="company logo-jobDetails"
                />
                <div className="card-company-title-container-jobDetails">
                  <h1 className="company-title-jobDetails">
                    {jobDetails.title}
                  </h1>
                  <p>{jobDetails.rating}</p>
                </div>
              </div>
              <div className="card-location-salary-container-jobDetails">
                <div className="card-location-type-container-jobDetails">
                  <p>{jobDetails.location}</p>
                  <p>{jobDetails.employmentType}</p>
                </div>
                <p className="package-element-jobDetails">
                  {jobDetails.packagePerAnnum}
                </p>
              </div>
              <hr className="hr-card-jobDetails" />
              <h1>Description</h1>
              <a href={jobDetails.companyWebsiteUrl}>Visit</a>
              <p>{jobDetails.jobDescription}</p>
              <h1>Skills</h1>
              <ul className="skills-ul">
                {skillsList.map(each => (
                  <li className="skills-li" key={each.name}>
                    <img
                      className="skills-img"
                      src={each.imageUrl}
                      alt={each.name}
                    />
                    <p>{each.name}</p>
                  </li>
                ))}
              </ul>
              <h1>Life at Company</h1>
              <div className="lifeAtCompany-container">
                <p>{lifeAtCompany.description}</p>
                <img
                  className="lifeAtCompany-img"
                  src={lifeAtCompany.imageUrl}
                />
              </div>
            </div>
            <h1 className="similarJobs-text">Similar Jobs</h1>
            <ul className="similarjobs-container">
              {similarJobsList.map(each => (
                <li className="similarjobs-card-container" key={each.id}>
                  <div className="card-company-logo-container-similarJobs">
                    <img
                      className="company-logo-card-similarJobs"
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                    />
                    <div className="card-company-title-container-similarJobs">
                      <h1 className="company-title-similarJobs">
                        {each.title}
                      </h1>
                      <p>{each.rating}</p>
                    </div>
                  </div>
                  <div className="card-location-salary-container-similarJobs">
                    <div className="card-location-type-container-similarJobs">
                      <p>{each.location}</p>
                      <p>{each.employmentType}</p>
                    </div>
                  </div>
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {isLoading} = this.state

    return (
      <div>
        {isLoading ? (
          <div className="jobDetails-bg">
            <Header />
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          </div>
        ) : (
          this.failureView()
        )}
      </div>
    )
  }
}

export default JobDetails
