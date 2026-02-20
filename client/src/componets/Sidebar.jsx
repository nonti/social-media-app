import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { CiBookmark, CiMail } from "react-icons/ci";
import { NavLink } from 'react-router-dom'
import { PiPaintBrushBold } from 'react-icons/pi'
import { useDispatch } from 'react-redux'
import { uiSliceActions } from '../store/UISlice';
const Sidebar = () => {
  const dispatch = useDispatch()

  const openThemeModal = () => {
    dispatch(uiSliceActions.openThemeModal())
  }

  return (
    <menu className="sidebar">
      <NavLink to='/' className={`sidebar__item ${(isActive) => isActive ? 'active' : ''} `}>
        <i className='sidebar__icon'> <AiOutlineHome /></i>
        <p>Home</p>
      </NavLink>
       <NavLink to='/messages' className={`sidebar__item ${(isActive) => isActive ? 'active' : ''} `}>
        <i className='sidebar__icon'> <CiMail /></i>
        <p>Messages</p>
      </NavLink>
       <NavLink to='/bookmarks' className={`sidebar__item ${(isActive) => isActive ? 'active' : ''} `}>
        <i className='sidebar__icon'> <CiBookmark /></i>
        <p>Bookmarks</p>
      </NavLink>
      <a className={`sidebar__item ${(isActive) => isActive ? 'active' : ''} `}
        onClick={openThemeModal}>
        <i className='sidebar__icon'> <PiPaintBrushBold /></i>
        <p>Themes</p>
      </a>
   </menu>
  )
}

export default Sidebar