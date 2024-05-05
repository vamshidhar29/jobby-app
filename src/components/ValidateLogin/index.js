import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ValidateLogin = props => {
  const token = Cookies.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ValidateLogin
