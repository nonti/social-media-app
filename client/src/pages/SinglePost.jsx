import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProfileImage from '../componets/ProfileImage';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TimeAgo from 'react-timeago';
import { FaRegComment, FaRegCommentDots, FaShare } from 'react-icons/fa';
import BookmarkPost from '../componets/BookmarkPost';
import PostComment from '../componets/PostComment';

const SinglePost = () => {
  let { id } = useParams;
  const [post, setPost] = useState([])
  const [comment, setComment] = useState('')
  const token = useSelector(state => state?.user?.currentUser?.token)
  const getPost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`, 
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setPost(response?.data)
    } catch (err) {
      console.log(err)
    }
  }

  
  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setComment(comment?.filter(c => c?._id != commentId))
    } catch (err) {
      console.log(err)
    }
  }

  const createComment = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/comments/${id}`,
        { comment }, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      const newComment = response?.data;
      setComment([newComment, ...comments])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getPost();
  }, [deleteComment])


  return (
    <section className="singlePost">
      <header className="feed__header">
        <ProfileImage image={post?.creator?.profileAvatar} />
        <div className="feed__header-details">
          <h4>{post?.creator?.fulname}</h4>
          <small><TimeAgo date={post?.createdAt} /></small>
        </div>
      </header>
      <div className="feed__body">
        <p>{post?.body}</p>
        <div className="feed__images">
          <img src={post?.image} />
        </div>
      </div>

      <footer className="feed__footer">
        <div>
          {post?.likes && <LikeDislikePost post={post} />}
          <button className='feed__footer-comments'><FaRegCommentDots /></button>
          <button className="feed__footer-share"><FaShare/></button>
        </div>
        <BookmarkPost post={post}/>
      </footer>
      <ul className="singlePost__comments">
        <form onSubmit={createComment} className="singlePost__comments-form">
          <textarea placeholder='enter your comment' onChange={e => setComment(e.target.value)}>{comment}</textarea>
          <button type='submit' className='singlePost__comments-btn'><IoMdSend/></button>
        </form>
        {
          post?.map(comment => <PostComment key={comment?._id} comment={comment} onDeleteComment={ deleteComment} /> )
        }
      </ul>
    </section>
  )
}

export default SinglePost