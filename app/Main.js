import React, { useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { useImmerReducer } from 'use-immer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || ''

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
//Components
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import HomeGuest from './components/HomeGuest'
import About from './components/About'
import Terms from './components/Terms'
const CreatePost = React.lazy(() => import('./components/CreatePost'))
const ViewSinglePost = React.lazy(() => import('./components/ViewSinglePost'))
import FlashMessages from './components/FlashMessages'
import Profile from './components/Profile'
import EditPost from './components/EditPost'
import NotFound from './components/NotFound'
import Search from './components/Search'
const Chat = React.lazy(() => import('./components/Chat'))
import LoadingDotsIcon from './components/LoadingDotsIcon'

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('complexappToken'),
      username: localStorage.getItem('complexappUsername'),
      avatar: localStorage.getItem('complexappAvatar')
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadtChatCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        draft.user = action.data
        return
      case 'logout':
        draft.loggedIn = false
        return
      case 'flashMessage':
        draft.flashMessages.push(action.value)
        return
      case 'openSearch':
        draft.isSearchOpen = true
        return
      case 'closeSearch':
        draft.isSearchOpen = false
        return
      case 'toggleChat':
        draft.isChatOpen = !draft.isChatOpen
        return
      case 'closeChat':
        draft.isChatOpen = false
        return
      case 'incrementChatCount':
        draft.unreadtChatCount++
        return
      case 'clearUnreadtChatCount':
        draft.unreadtChatCount = 0
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('complexappToken', state.user.token)
      localStorage.setItem('complexappUsername', state.user.username)
      localStorage.setItem('complexappAvatar', state.user.avatar)
    } else {
      localStorage.removeItem('complexappToken')
      localStorage.removeItem('complexappUsername')
      localStorage.removeItem('complexappAvatar')
    }
  }, [state.loggedIn])

  //Check if token has expired

  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: ourRequest.token })
          if (!response.data) {
            dispatch({ type: 'logout' })
            dispatch({ type: 'flashMessage', value: 'Your session has expired. Pleasea log in again' })
          }
        } catch (e) {
          console.log('There was a problem or the request was cancelled.')
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path='/' element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path='/post/:id' element={<ViewSinglePost />} />
              <Route path='/post/:id/edit' element={<EditPost />} />
              <Route path='/create-post' element={<CreatePost />} />
              <Route path='/about-us' element={<About />} />
              <Route path='/terms' element={<Terms />} />
              <Route path='/profile/:username/*' element={<Profile />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames='search-overlay' unmountOnExit>
            <Search />
          </CSSTransition>
          <Suspense fallback=''>{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector('#app'))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
