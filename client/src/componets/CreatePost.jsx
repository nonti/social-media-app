import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import {SlPicture} from 'react-icons/sl'
const CreatePost = ({ onCreatePost, error }) => {
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
  const profileAvatar = useSelector(state => state?.user?.currentUser?.profileAvatar)
  
  
  const createPost = (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set('body', body);
    postData.set('image', image);
    onCreatePost(postData)
    setBody('');
    setImage('');
  }
  return (
    <form emcType='multipart/form-data' onSubmit={createPost} className="createPost">
      {error && <p className='createPost__error-message'>{error}</p>}
      <div className="createPost__top">
        <ProfileImage image={profileAvatar} />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder='What is on your mind?'/>
      </div>
      <div className="createPost__bottom">
        <span></span>
        <div className="createPost__actions">
          <label htmlFor="image"><SlPicture/></label>
          <input type="file" name="" id="image" onChange={e => setImage(e.target.files[0])} />
          <button type="submit">Post</button>
        </div>
      </div>
      </form>
  )
}

export default CreatePost