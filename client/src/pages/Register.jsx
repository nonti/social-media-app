import React, { useState } from 'react'
import { Link, useNavigate,  } from 'react-router-dom';
import axios from 'axios'
import { FaEye, FaEyeSlash } from "react-icons/fa"



const Register = () => {
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData(prevState => ({
      ...prevState, [e.target.name]: e.target.value
    }))
  }

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData)
      if (response.ok) {
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.message)
    }
  }
  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign up</h2>
        <form onSubmit={registerUser}>
          {error && <p className="form__error-message">
            {error}
          </p>}
          <input type="text" value={userData.fullname} name='fullname' placeholder='fullname' onChange={changeInputHandler} autoFocus />
          <input type="email" value={userData.email} name='email' placeholder='Email' onChange={changeInputHandler} autoFocus />
          <div className="password__controller">
            <input type={showPassword ? "text":"password"} value={userData.password} name='password' placeholder='Password' onChange={changeInputHandler} autoFocus />
            <span onClick={() => setShowPassword(!showPassword)}>{ showPassword ? <FaEyeSlash/> :<FaEye/>}</span>
          </div>
          <div className="password__controller">
          <input type={showPassword ? "text":"password"} value={userData.confirmPassword} name='confirmPassword' placeholder='Confirm Password' onChange={changeInputHandler} autoFocus />
            <span onClick={() => setShowPassword(!showPassword)}>{ showPassword ? <FaEyeSlash/> :<FaEye/>}</span>
          </div>
          <p>Already have an account <Link to='/login'>Login</Link></p>
          <button type='submit' className="btn-primary">Register</button>
        </form>

      </div>
    </section>
  )
}

export default Register