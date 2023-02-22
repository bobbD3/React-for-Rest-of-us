import { Axios } from 'axios'
import React, { useState, useEffect } from 'react'
import StateContext from '../StateContext'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'
import Post from './Post'

export default function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    async function FetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log(`Ops`)
      }
    }
    FetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) {
    return <LoadingDotsIcon />
  }
  return (
    <div className='list-group'>
      {posts.map(post => {
        return <Post noAuthore={true} post={post} key={post._id} />
      })}
    </div>
  )
}
