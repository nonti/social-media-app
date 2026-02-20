import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const BookmarkPost = ({post}) => {
  const [user, setUser] = useState(null)
  const isBookmarked = user?.bookmarks?.includes(post?._id);
  const userId = useSelector(state => state?.user?.currentUser?.userId)
  const token = useSelector(state => state?.user?.currentUser?.token)

  const getUser = async () => {
      if(!userId) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setUser(response?.data)
    } catch (err) {
      console.log(err)
    }
  }

 
  const createBookmark = async () => {
    try {
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
         { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setUser(response.data.updatedUser);
    } catch (err) {
      console.log(err)
    }
  }
  
 useEffect(() => {
    getUser()
  }, [userId])

  return (
    <button className="feed__footer-bookmark" onClick={createBookmark}>
      { isBookmarked ? <FaBookmark/> : <FaRegBookmark/>}
   </button>
  )
}

export default BookmarkPost