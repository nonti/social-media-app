import axios from 'axios';
import React, { useState } from 'react'
import { FaRegHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { FcLike} from 'react-icons/fc'
const LikeDislikePost = (props) => {
  const [post, setPost] = useState(props.post);
  const userId = useSelector(state => state?.user?.currentUser?.id)
  const isPostLiked = post?.likes?.includes(userId)
  const token = useSelector(state => state?.user?.currentUser?.token)
  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setPost(response?.data)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button className="feed__footer-comments" onClick={handleLikeDislikePost}>
      {isPostLiked ? <FcLike/>:<FaRegHeart/> }
    </button>
  )
}

export default LikeDislikePost