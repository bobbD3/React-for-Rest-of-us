import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

//imported components
import HeaderLoggedIn from './HeaderLoggedIn'
import HeaderLoggedOut from './HeaderLoggedOut'
import StateContext from '../StateContext'

function Header(props) {
  const appState = useContext(StateContext)
  const headerContend = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />
  return (
    <header className='header-bar bg-primary mb-3'>
      <div className='container d-flex flex-column flex-md-row align-items-center p-3'>
        <h4 className='my-0 mr-md-auto font-weight-normal'>
          <Link to='/' className='text-white'>
            {' '}
            Bozhidar's Portfolio App{' '}
          </Link>
        </h4>
        {!props.staticEmtpy ? headerContend : ''}
      </div>
    </header>
  )
}

export default Header
