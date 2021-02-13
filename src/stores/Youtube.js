import React, { createContext, useReducer } from 'react'
import YoutubeApi from '../YoutubeApi.mock'
import PropTypes from 'prop-types'

const initialState = {
  isFetching: false,
  subscriptions: [],
  potentialSubscriptions: [], // この中からライブ情報を取得する候補を選択させる.
  upcomminglives: [],
  activeLives: [],
  /**
     * @type{YoutubeApi}
     */
  api: null,
  isInitialized: false
}

const Actions = {
  INIT: 'INIT',
  SET_SUBSCRIPTIONS: 'SET_SUBSCRIPTIONS',
  SET_POTENTIAL_SUBSCRIPTIONS: 'SET_POTENTIAL_SUBSCRIPTIONS',
  SET_UPCOMING_LIVES: 'SET_UPCOMING_LIVES',
  SET_ACTIVE_LIVES: 'SET_ACTIVE_LIVES',
  FETCH_SUBSCRIPTIONS: 'FETCH_SUBSCRIPTIONS',
  REQUEST_POTENTIAL_SUBSCRICTIONS: 'REQUEST_POTENTIAL_SUBSCRICTIONS',
  REQUEST_UPCOMING_LIVES: 'REQUEST_UPCOMING_LIVES',
  REQUEST_ACTIVE_LIVES: 'REQUEST_ACTIVE_LIVES',
  SET_IS_INITIALIZED: 'SET_US_INITIALIZED'
}

const store = createContext({
  state: initialState,
  dispatch: () => {}
})

const { Provider } = store

const YoutubeStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case Actions.INIT:
        const api = new YoutubeApi(action.payload)
        // FIXME dispatchはsettimeoutとかpromise挟まないと Cannot access before initialization になる.
        // とりあえずsetTimeoutでごまかすが、reducerの中でdispatchを呼び出すのはNGなのか？
        setTimeout(() => {
          const localSubscriptions = JSON.parse(localStorage.getItem('subscriptions'))
          if (localSubscriptions) {
            dispatch({ type: Actions.SET_SUBSCRIPTIONS, payload: localSubscriptions })
          } else {
            dispatch({ type: Actions.REQUEST_POTENTIAL_SUBSCRICTIONS })
          }
          dispatch({ type: Actions.SET_IS_INITIALIZED, payload: true })
        })
        return { ...state, api }

      case Actions.SET_IS_INITIALIZED:
        return { ...state, isInitialized: action.payload }

      case Actions.SET_SUBSCRIPTIONS:
        localStorage.setItem('subscriptions', JSON.stringify(action.payload))
        return { ...state, subscriptions: action.payload, potentialSubscriptions: [] }

      case Actions.SET_UPCOMING_LIVES:
        return { ...state, upcomminglives: action.payload, isFetching: false }

      case Actions.SET_ACTIVE_LIVES:
        return { ...state, activeLives: action.payload, isFetching: false }

      case Actions.REQUEST_POTENTIAL_SUBSCRICTIONS:
        state.api.fetchMySubscriptionChannelIds().then(result => {
          dispatch({ type: Actions.SET_POTENTIAL_SUBSCRIPTIONS, payload: result.map(item => item.snippet) })
        })
        return { ...state, isFetching: true }

      case Actions.SET_POTENTIAL_SUBSCRIPTIONS:
        return { ...state, potentialSubscriptions: action.payload, isFetching: false }

      case Actions.REQUEST_UPCOMING_LIVES:
        Promise.all(state.subscriptions.map(async id =>
          state.api.fetchUpcomingLivesByChannelId(id)
        )).then(result => {
          const all = result.reduce((acc, cur) => [...acc, ...cur], []).map(obj => obj.snippet)
          dispatch({ type: Actions.SET_UPCOMING_LIVES, payload: all })
        })
        return { ...state, isFetching: true }

      default:
        throw new Error(`Unexpeceted action: ${action.type}`)
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

YoutubeStateProvider.propTypes = {
  children: PropTypes.element
}

export { store, YoutubeStateProvider, Actions }
