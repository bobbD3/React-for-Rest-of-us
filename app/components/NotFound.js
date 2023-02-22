import React from 'react'
import Page from './Page'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <Page title='Not Found'>
      <div className='text-center'>
        <h2>Whoops, we can't find that page.</h2>
        <p className='lead text-mute'>
          {' '}
          You can always visit the <Link to='/'>homepage</Link> to get a fresh start
        </p>
      </div>
    </Page>
  )
}
