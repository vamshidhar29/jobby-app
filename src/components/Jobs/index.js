import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: [],
    profileStatus: false,
    profileLoader: false,
    jobsLoader: false,
    checkedList: [],
    radioInput: '',
    searchValue: '',
    jobsList: [],
    jobsStatus: false,
  }

  componentDidMount() {
    this.fetchProfileDetails()
    this.fetchJobs()
  }

  checkState = event => {
    const {checkedList} = this.state
    let filterData = checkedList.filter(each => each === event.target.id)

    if (filterData.length === 0) {
      this.setState(
        preVal => ({
          checkedList: [...preVal.checkedList, event.target.id],
        }),
        this.fetchJobs,
      )
    } else {
      filterData = checkedList.filter(each => each !== event.target.id)
      this.setState({checkedList: filterData}, this.fetchJobs)
    }
  }

  changeSearch = event => {
    this.setState({searchValue: event.target.value})
  }

  clickSearchIcon = () => {
    this.fetchJobs()
  }

  radioState = event => {
    this.setState({radioInput: event.target.id}, this.fetchJobs)
  }

  fetchProfileDetails = async () => {
    this.setState({profileLoader: true})
    const url = 'https://apis.ccbp.in/profile'
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
      const modifyProfileDetails = {
        name: jsonResponse.profile_details.name,
        profileImageUrl: jsonResponse.profile_details.profile_image_url,
        shortBio: jsonResponse.profile_details.short_bio,
      }
      this.setState({
        profileDetails: modifyProfileDetails,
        profileStatus: false,
        profileLoader: false,
      })
    } else {
      this.setState({profileStatus: true, profileLoader: false})
    }
  }

  fetchJobs = async () => {
    this.setState({jobsLoader: true})
    const {checkedList, radioInput, searchValue} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkedList.join()}&minimum_package=${radioInput}&search=${searchValue}`
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
      const filterData = jsonResponse.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: filterData,
        jobsStatus: false,
        jobsLoader: false,
      })
    } else {
      this.setState({jobsStatus: true, jobsLoader: false})
    }
  }

  callFetchProfile = () => {
    this.fetchProfileDetails()
  }

  profileView = () => {
    const {profileDetails, profileStatus} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div>
        {profileStatus ? (
          <div>
            <button
              className="retry-profile-btn"
              onClick={this.callFetchProfile}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="profile-background-container">
            <img src={profileImageUrl} alt="profile" />
            <h1 className="profile-name">{name}</h1>
            <p>{shortBio}</p>
          </div>
        )}
      </div>
    )
  }

  jobsBodyFirstContainerView = () => {
    const {profileLoader} = this.state

    return (
      <div className="jobs-body-first-container">
        {profileLoader ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        ) : (
          this.profileView()
        )}

        <hr />
        <h1 className="input-head">Type of Employment</h1>
        <ul className="ul-employmentTypes">
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                name={each.employmentTypeId}
                value={each.label}
                onChange={this.checkState}
              />
              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          ))}
        </ul>
        <hr />
        <h1 className="input-head">Salary Range</h1>
        <ul className="ul-employmentTypes">
          {salaryRangesList.map(each => (
            <li key={each.salaryRangeId}>
              <input
                type="radio"
                id={each.salaryRangeId}
                onChange={this.radioState}
                name="option"
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  retryJobFailure = () => {
    this.fetchJobs()
  }

  jobsFailureView = () => {
    const {jobsStatus} = this.state

    if (jobsStatus) {
      return (
        <div className="jobs-body-second-container">
          <div className="search-input-container">
            <input
              type="search"
              placeholder="Search"
              className="search-ele"
              onChange={this.changeSearch}
            />
            <button
              onClick={this.clickSearchIcon}
              type="button"
              data-testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="jobsFailure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button
              onClick={this.retryJobFailure}
              className="retry-btn"
              type="button"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }
    return this.jobsNoDataView()
  }

  jobsNoDataView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="jobs-body-second-container">
          <div className="search-input-container">
            <input
              type="search"
              placeholder="Search"
              className="search-ele"
              onChange={this.changeSearch}
            />
            <button
              onClick={this.clickSearchIcon}
              type="button"
              data-testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="nodata-container">
            <img
              className="notfound-img"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        </div>
      )
    }
    return (
      <div className="jobs-body-second-container">
        <div className="search-input-container">
          <input
            type="search"
            placeholder="Search"
            className="search-ele"
            onChange={this.changeSearch}
          />
          <button
            onClick={this.clickSearchIcon}
            type="button"
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <ul className="ul-jobslist">
          {jobsList.map(each => (
            <li key={each.id}>
              <Link className="link-class-card-jobs" to={`/jobs/${each.id}`}>
                <div className="jobs-card">
                  <div className="card-company-logo-container">
                    <img
                      className="company-logo-card"
                      src={each.companyLogoUrl}
                      alt="company logo"
                    />
                    <div className="card-company-title-container">
                      <h1 className="company-title">{each.title}</h1>
                      <p>{each.rating}</p>
                    </div>
                  </div>
                  <div className="card-location-salary-container">
                    <div className="card-location-type-container">
                      <p>{each.location}</p>
                      <p>{each.employmentType}</p>
                    </div>
                    <p className="package-element">{each.packagePerAnnum}</p>
                  </div>
                  <hr className="hr-card" />
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {jobsLoader} = this.state

    return (
      <div className="jobs-main-bg">
        <Header />
        <div className="jobd-body-bg-container">
          {this.jobsBodyFirstContainerView()}
          {jobsLoader ? (
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          ) : (
            this.jobsFailureView()
          )}
        </div>
      </div>
    )
  }
}

export default Jobs
