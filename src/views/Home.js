
import { makeStyles } from '@material-ui/core/styles'
import TimeLine from '../components/UpcomingVideoTimeline'
import SubscriptionSelectDialog from '../components/SubscriptionSelectDialog'
import { store, Actions } from '../stores/Youtube'
import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import Auth from 'oauth2-implicitgrant'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}))
const Home = ({ auth }) => {
  const classes = useStyles()

  const { state, dispatch } = useContext(store)

  useEffect(() => {
    if (!state.isInitialized) {
      dispatch({ type: Actions.INIT, payload: auth })
    }
  }, [])

  return (
        <div className={classes.root}>
            {state.isInitialized ? (<TimeLine></TimeLine>) : ''}
            <SubscriptionSelectDialog></SubscriptionSelectDialog>
        </div>
  )
}

Home.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired
}

export default Home
