import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import ProfileImage from './ProfileImage'
import { useSelector } from 'react-redux'
const Navbar = () => {
  const userId  = useSelector(state => state?.user?.currentUser?.id);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const profileAvatar = useSelector(state => state?.user?.currentUser?.profileAvatar);
  const navigate = useNavigate()



  // redirect user to login if no token
  useEffect(() => {
  if (!token ) {
    navigate('/login');
  }
}, [token, navigate])
  //log user out after an hour
  useEffect(() => {
    setTimeout(() => {
      navigate('/logout')      
    },1000 * 60 * 60 )
  },[])

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to='/home' className='navbar__logo'>Socio</Link>
        <form className="navbar__search">
          <input type="search" placeholder='Search' />
          <button type='submit'><FaSearch/></button>
        </form>
        
       <div className="navbar__right">
  {token ? (
    <>
       <Link to={`/users/${userId}`} className='navbar__profile'>
         <ProfileImage image={profileAvatar} />
       </Link>
       <Link to='/logout'>Logout</Link> 
    </>
  ) : (
    <Link to='/login'>Login</Link>
  )}
</div>
      </div>
    </nav>
  )
}

export default Navbar