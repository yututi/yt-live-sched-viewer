import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import Typography from '@material-ui/core/Typography'
import { store, Actions } from '../stores/Youtube'
import YoutubeLiveCard from './YoutubeLiveCard'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px'
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main
  },
  cards: {
    flexDirection: 'column',
    display: 'flex'
  },
  progress: {
    marginTop: '20px'
  }
}))

export default function UpcomingVideoTimeline () {
  const classes = useStyles()
  const { state, dispatch } = useContext(store)

  useEffect(() => {
    if (state.upcomminglives.length === 0) {
      dispatch({ type: Actions.REQUEST_UPCOMING_LIVES })
    }
  }, [])

  // group by publish datetime.
  const group = state.upcomminglives.reduce((acc, cur) => {
    const group = acc[cur.publishedAt]
    if (group) {
      group.push(cur)
    } else {
      acc[cur.publishedAt] = [cur]
    }
    return acc
  }, {})

  const livesGroupedByPublishAt = Object.entries(group).map(([key, value]) => {
    return {
      publishedAt: key,
      lives: value
    }
  }).sort((a, b) => a.publishedAt < b.publishedAt)

  return (
        <>
        <Fade in={state.isFetching}>
            <CircularProgress className={classes.progress}></CircularProgress>
        </Fade>
        <Timeline align="left">
            {livesGroupedByPublishAt.map(({ publishedAt, lives }) => {
              return (
                <TimelineItem key={publishedAt}>
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                        {publishedAt}
                        </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot>
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent className={classes.cards}>
                        {lives.map((live, index) => (
                            <YoutubeLiveCard key={index} live={live}></YoutubeLiveCard>
                        ))}
                    </TimelineContent>
                </TimelineItem>
              )
            })}
        </Timeline>
        </>
  )
}
