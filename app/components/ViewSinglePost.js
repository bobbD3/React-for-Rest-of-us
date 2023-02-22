import React, { useState, useEffect, useContext } from 'react'
import Page from './Page'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

export default function ViewSinglePost() {
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = axios.CancelToken.source()

    async function FetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log(`Ops`)
      }
    }
    FetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])
  if (!isLoading && !post) {
    return <NotFound />
  }
  if (isLoading)
    return (
      <Page title='...'>
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  async function deleteHandler() {
    const areYouSure = window.confirm('Do you really want to delete this post?')
    if (areYouSure) {
      try {
        const response = await axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data === 'Success') {
          // 1. Display flash message
          appDispatch({ type: 'flashMassage', value: 'Post was successfully deleted.' })
          // 2. redirect to the current user profile
          navigate(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log(`Something went wrong`)
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={`/post/${post._id}/edit`} className='text-primary mr-2' title='Edit'>
              <i className='fas fa-edit'></i>
            </Link>{' '}
            <a onClick={deleteHandler} className='delete-post-button text-danger' title='Delete'>
              <i className='fas fa-trash'></i>
            </a>
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className='body-content'>
        <ReactMarkdown children={post.body} allowedElements={['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'li']} />
      </div>
    </Page>
  )
}
