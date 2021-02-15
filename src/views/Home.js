
import { makeStyles } from '@material-ui/core/styles'
import TimeLine from '../components/UpcomingVideoTimeline'
import SubscriptionSelectDialog from '../components/SubscriptionSelectDialog'
import { store } from '../stores/Youtube'
import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import Auth from 'oauth2-implicitgrant'
// import YoutubeApi from '../Youtube'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: '1200px',
    margin: 'auto',
    position: 'relative'
  },
  progress: {
    marginTop: '20px'
    // transform: 'translateX(-50%)'
  },
  msg: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)'
  }
}))
const Home = ({ auth }) => {
  const classes = useStyles()

  const { state, actions } = useContext(store)

  useEffect(() => {
    actions.init(auth)
  }, [])

  return (
    <div className={classes.root}>
      <Fade in={state.isFetching} unmountOnExit>
          <CircularProgress className={classes.progress}></CircularProgress>
      </Fade>
      {state.isQuotaExceeded ? <div className={classes.msg}>YoutubeAPIの呼び出しが制限を超えたため表示できません。</div> : ''}
      {state.canFetchLives ? (<TimeLine></TimeLine>) : ''}
      <SubscriptionSelectDialog></SubscriptionSelectDialog>
    </div>
  )
}

Home.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired
}

export default Home
