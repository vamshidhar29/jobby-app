import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Headers = props => {
  const {history} = props

  const logout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="headers-container">
      <Link to="/">
        <img
          className="web-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="links-container">
        <li>
          <Link to="/" className="link-class">
            <p className="links-items">Home</p>
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link-class">
            <p className="links-items">Jobs</p>
          </Link>
        </li>
      </ul>
      <button onClick={logout} className="logout-btn" type="button">
        Logout
      </button>
    </div>
  )
}

export default withRouter(Headers)
