import React, { createContext, useReducer, useEffect } from 'react'
import Auth from 'oauth2-implicitgrant'
import PropTypes from 'prop-types'

const initialState = {
  isInitialized: false,
  isLoggedIn: false,
  api: null
}

const Actions = {
  INIT: 'INIT',
  SET_IS_LOGGED_IN: 'SET_IS_LOGGED_IN',
  LOGOUT: 'LOGOUT'
}

const store = createContext({
  state: initialState,
  dispatch: () => {}
})

const { Provider } = store

const AuthStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case Actions.INIT:
        return { ...state, api: action.payload }

      case Actions.SET_IS_LOGGED_IN:
        return { ...state, isLoggedIn: action.payload, isInitialized: true }

      case Actions.LOGOUT:
        return { ...state, isLoggedIn: false, isInitialized: true }

      default:
        throw new Error(`Unexpeceted action: ${action.type}`)
    }
  }, initialState)

  useEffect(() => {
    const auth = Auth.forGoogleApi({
      clientId: process.env.REACT_APP_GOOGLE_API_CLIENT_ID,
      redirectUrl: process.env.REACT_APP_GOOGLE_API_REDIRECT_URL,
      scope: ['https://www.googleapis.com/auth/youtube.readonly']
    })
    auth.init({
      onDenied: () => {
        // dispatch({ type: Actions.LOGOUT })
      }
    }).then(isLoggedIn => {
      dispatch({ type: 'SET_IS_LOGGED_IN', payload: isLoggedIn })
    })
    dispatch({ type: Actions.INIT, payload: auth })
  }, [])

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

AuthStateProvider.propTypes = {
  children: PropTypes.element
}

export { store, AuthStateProvider, Actions }
