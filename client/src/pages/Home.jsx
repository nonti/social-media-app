import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from '../componets/CreatePost'
import axios from 'axios'
import Feeds from '../componets/Feeds'
const Home = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const token = useSelector(state => state?.user?.currentUser?.token)

  const createPost = async (data) => {
    setError('')
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      const newPost = response?.data;
      setPosts([newPost, ...posts])
    } catch (err) {
      setError(err?.response?.data?.message)
    }
  }

  const getPosts = async () => {
      setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/post`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      setPosts(response?.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getPosts()
  }, [setPosts])

  console.log(posts)
  return (
    <section className="mainArea">
      <CreatePost onCreatePost={createPost} error={error} />
      <Feeds posts={posts} onSetPosts={setPosts} />
    </section>
  )
}

export default Home