import {Link} from 'react-router-dom'

import {Component} from 'react'

import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="home-bg">
        <Header />
        <div className="home-body-container">
          <h1 className="head-body-home">Find The Job That Fits Your Life</h1>
          <p className="para-body-home">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button className="find-jobs-btn" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
