
import { makeStyles } from '@material-ui/core/styles'
import TimeLine from '../components/UpcomingVideoTimeline'
import SubscriptionSelectDialog from '../components/SubscriptionSelectDialog'
import { store, Actions } from '../stores/Youtube'
import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import Auth from 'oauth2-implicitgrant'
import YoutubeApi from '../Youtube'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: '1200px',
    margin: 'auto'
  }
}))
const Home = ({ auth }) => {
  const classes = useStyles()
  console.log('home rerender')

  const { state, dispatch } = useContext(store)

  useEffect(() => {
    // FIXME: ロジックをreducerへ移したいが、dispatchを呼び出すとreducerの処理が2回呼ばれる挙動になる.
    // 原因がわからないのでここで呼び出す。ここのdispatchも2回呼び出されるがfetchは1回なので...
    const api = new YoutubeApi(auth)
    dispatch({ type: Actions.INIT, payload: api })
    const localSubscriptions = JSON.parse(localStorage.getItem('subscriptions'))
    if (localSubscriptions) {
      dispatch({ type: Actions.SET_SUBSCRIPTIONS, payload: localSubscriptions })
    } else {
      dispatch({ type: Actions.FETCH_START })
      api.fetchMySubscriptionChannelIds().then(result => {
        dispatch({ type: Actions.SET_POTENTIAL_SUBSCRIPTIONS, payload: result.map(item => item.snippet) })
      })
    }
  }, [])

  return (
        <div className={classes.root}>
            {state.canFetchLives ? (<TimeLine></TimeLine>) : ''}
            <SubscriptionSelectDialog></SubscriptionSelectDialog>
        </div>
  )
}

Home.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired
}

export default Home
