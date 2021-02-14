import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import YoutubeApi from '../Youtube'

const initialState = {
  isFetching: false,
  canFetchLives: false,
  subscriptions: [],
  potentialSubscriptions: [], // この中からライブ情報を取得する候補を選択させる.
  upcomminglives: [],
  activeLives: [],
  /**
     * @type{YoutubeApi}
     */
  api: null,
  lastFetched: null,
  isQuotaExceeded: false
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
  FETCH_START: 'FETCH_START',
  FETCH_END: 'FETCH_END',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED'
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
        return { ...state, api: action.payload }

      case Actions.SET_SUBSCRIPTIONS:
        localStorage.setItem('subscriptions', JSON.stringify(action.payload))
        return { ...state, subscriptions: action.payload, potentialSubscriptions: [], isFetching: false, canFetchLives: true }

      case Actions.SET_UPCOMING_LIVES:
        return { ...state, upcomminglives: action.payload, isFetching: false }

      case Actions.SET_ACTIVE_LIVES:
        return { ...state, activeLives: action.payload, isFetching: false }

      case Actions.REQUEST_POTENTIAL_SUBSCRICTIONS:
        state.api.fetchMySubscriptionChannelIds().then(result => {
          dispatch({ type: Actions.SET_POTENTIAL_SUBSCRIPTIONS, payload: result.map(item => item.snippet) })
        })
        return { ...state, isFetching: true }

      case Actions.FETCH_START:
        return { ...state, isFetching: true }

      case Actions.SET_POTENTIAL_SUBSCRIPTIONS:
        return { ...state, potentialSubscriptions: action.payload, isFetching: false }

      case Actions.REQUEST_UPCOMING_LIVES:
        // deprecated: dispatch1回でreducerの処理が2回呼ばれるため、
        // このアクションを実行するとfetchが2回実行される.
        if (state.lastFetched) {
          const throttleDate = new Date()
          throttleDate.setMinutes(throttleDate.getMinutes() - 3)
          if (state.lastFetched >= throttleDate) {
            return state
          }
        }
        Promise.all(state.subscriptions.map(async id =>
          state.api.fetchUpcomingLivesByChannelId(id)
        )).then(result => {
          const all = result.reduce((acc, cur) => [...acc, ...cur], []).map(obj => obj.snippet)
          dispatch({ type: Actions.SET_UPCOMING_LIVES, payload: all })
        })
        return { ...state, isFetching: true, lastFetched: new Date() }

      case Actions.QUOTA_EXCEEDED:
        return { ...state, isQuotaExceeded: true, isFetching: false }

      default:
        throw new Error(`Unexpeceted action: ${action.type}`)
    }
  }, initialState)

  const actions = {
    init: (auth) => {
      const api = new YoutubeApi(auth)
      dispatch({ type: Actions.INIT, payload: api })
      const localSubscriptions = JSON.parse(localStorage.getItem('subscriptions'))
      if (localSubscriptions) {
        dispatch({ type: Actions.SET_SUBSCRIPTIONS, payload: localSubscriptions })
      } else {
        dispatch({ type: Actions.FETCH_START })
        api.fetchMySubscriptionChannelIds().then(result => {
          if (result.error) {
            dispatch({ type: Actions.QUOTA_EXCEEDED })
            return
          }
          dispatch({ type: Actions.SET_POTENTIAL_SUBSCRIPTIONS, payload: result.map(item => item.snippet) })
        })
      }
    },
    fetchUpcomingLives: () => {
      if (state.lastFetched) {
        const throttleDate = new Date()
        throttleDate.setMinutes(throttleDate.getMinutes() - 3)
        if (state.lastFetched >= throttleDate) {
          return state
        }
      }
      dispatch({ type: Actions.FETCH_START })
      Promise.all(state.subscriptions.map(async id =>
        state.api.fetchUpcomingLivesByChannelId(id)
      )).then(async result => {
        if (result.error) {
          dispatch({ type: Actions.QUOTA_EXCEEDED })
          return
        }

        const all = result.reduce((acc, cur) => [...acc, ...cur.items], [])

        const videoIds = all.reduce((acc, cur) => {
          acc.push(cur.id.videoId)
          return acc
        }, [])

        const detailResult = await state.api.fetchLiveDetailsByVideoIds(videoIds)

        dispatch({ type: Actions.SET_UPCOMING_LIVES, payload: detailResult.items })
      })
    }
  }

  return <Provider value={{ state, dispatch, actions }}>{children}</Provider>
}

YoutubeStateProvider.propTypes = {
  children: PropTypes.element
}

export { store, YoutubeStateProvider, Actions }
