import axios from 'axios'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { userActions } from '../store/userSlice'
import { useDispatch } from 'react-redux'
const Login = () => {
  const [userData, setUserData] = useState({
      email: '',
      password: '',
    })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeInputHandler = (e) => {
      setUserData(prevState => ({
        ...prevState, [e.target.name]: e.target.value
      }))
    }
  
    const loginUser = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, userData)
        if (response.status == 200) {
          dispatch(userActions.changeCurrentUser(response?.data))
          localStorage.setItem('currentUser', JSON.stringify(response?.data))
          navigate('/')

        }
        
      } catch (err) {
        setError(err.response?.data?.message)
      }
    }
    return (
      <section className="register">
        <div className="container register__container">
          <h2>Sign in</h2>
          <form onSubmit={loginUser}>
            {error && <p className="form__error-message">
              {error}
            </p>}
            <input type="email" value={userData.email} name='email' placeholder='Email' onChange={changeInputHandler} autoFocus />
            <div className="password__controller">
              <input type={showPassword ? "text":"password"} value={userData.password} name='password' placeholder='Password' onChange={changeInputHandler} autoFocus />
              <span onClick={() => setShowPassword(!showPassword)}>{ showPassword ? <FaEyeSlash/> :<FaEye/>}</span>
            </div>
           
            <p>Don&apos; have an account <Link to='/register'>Register</Link></p>
            <button type='submit' className="btn-primary">Login</button>
          </form>
  
        </div>
      </section>
    )
  }
  

export default Login