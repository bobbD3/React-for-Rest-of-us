import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  function handleLogout() {
    appDispatch({ type: 'logout' })
  }
  function handleSearchIcon(e) {
    e.preventDefault()
    appDispatch({ type: 'openSearch' })
    appDispatch({ type: 'flashMessage', value: 'You have successfully logged Out' })
  }
  return (
    <div className='flex-row my-3 my-md-0'>
      <a onClick={handleSearchIcon} href='#' className='text-white mr-2 header-search-icon'>
        <i className='fas fa-search'></i>
      </a>{' '}
      <span onClick={() => appDispatch({ type: 'toggleChat' })} data-for='chat' data-tip='Chat' className={'mr-2 header-chat-icon ' + (appState.unreadtChatCount ? 'text-danger' : 'text-white')}>
        <i className='fas fa-comment'></i>
        {appState.unreadtChatCount ? <span className='chat-count-badge text-white'> {appState.unreadtChatCount < 10 ? appState.unreadtChatCount : '9+'}</span> : ''}
      </span>{' '}
      <Link to={`/profile/${appState.user.username}`} className='mr-2'>
        <img className='small-header-avatar' src={appState.user.avatar} />
      </Link>
      <Link className='btn btn-sm btn-success mr-2' to='/create-post'>
        Create Post
      </Link>
      <button onClick={handleLogout} className='btn btn-sm btn-secondary'>
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
