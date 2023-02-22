import { Axios } from 'axios'
import React, { useState, useEffect } from 'react'
import StateContext from '../StateContext'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'

export default function ProfileFollowing() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    async function FetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token })
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
      {posts.map((follwer, index) => {
        return (
          <Link key={index} to={`/profile/${follwer.username}`} className='list-group-item list-group-item-action'>
            <img className='avatar-tiny' src={follwer.avatar} /> {follwer.username}
          </Link>
        )
      })}
    </div>
  )
}
