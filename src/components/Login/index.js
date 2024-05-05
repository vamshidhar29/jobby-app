import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', isFail: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitLoginForm = async event => {
    event.preventDefault()
    const postUrl = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(postUrl, options)
    if (response.ok) {
      const jsonResponse = await response.json()
      Cookies.set('jwt_token', jsonResponse.jwt_token)
      this.setState({isFail: false})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({isFail: true})
    }
  }

  render() {
    const {isFail, username, password} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-main-bg">
        <form className="card-container-login" onSubmit={this.submitLoginForm}>
          <img
            className="web-logo-login"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label className="label-ele-login" htmlFor="username">
            USERNAME
          </label>
          <input
            className="input-class"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={this.onChangeUsername}
          />
          <label className="label-ele-login" htmlFor="password">
            PASSWORD
          </label>
          <input
            className="input-class"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={this.onChangePassword}
          />
          {isFail ? (
            <p className="failure-class-login">
              *Username and Password didn't match
            </p>
          ) : null}

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
