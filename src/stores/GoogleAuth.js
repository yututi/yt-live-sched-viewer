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
  SET_IS_LOGGED_IN: 'SET_IS_LOGGED_IN'
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
        const auth = Auth.forGoogleApi({
          clientId: process.env.REACT_APP_GOOGLE_API_CLIENT_ID,
          redirectUrl: process.env.REACT_APP_GOOGLE_API_REDIRECT_URL,
          scope: ['https://www.googleapis.com/auth/youtube.readonly']
        })
        auth.init({
          onLogin: () => {
            // dispatch("SET_IS_LOGGED_IN", true)
          },
          onDenied: () => {
            // dispatch("SET_IS_LOGGED_IN", false)
          }
        }).then(isLoggedIn => {
          dispatch({ type: 'SET_IS_LOGGED_IN', payload: isLoggedIn })
        })
        return { ...state, api: auth }

      case Actions.SET_IS_LOGGED_IN:
        return { ...state, isLoggedIn: action.payload, isInitialized: true }

      default:
        throw new Error(`Unexpeceted action: ${action.type}`)
    }
  }, initialState)

  useEffect(() => {
    dispatch({ type: Actions.INIT })
  }, [])
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

AuthStateProvider.propTypes = {
  children: PropTypes.element
}

export { store, AuthStateProvider, Actions }
