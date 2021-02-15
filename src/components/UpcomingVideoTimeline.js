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
import { store } from '../stores/Youtube'
import YoutubeLiveCard from './YoutubeLiveCard'

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
  oppsite: {
    minWidth: '200px',
    flex: '0'
  }
}))

export default function UpcomingVideoTimeline () {
  const classes = useStyles()
  const { state, actions } = useContext(store)

  useEffect(() => {
    if (state.upcomminglives.length === 0) {
      actions.fetchUpcomingLives()
    }
  }, [])

  // FIXME これはreducerでやるべき
  // group by scheduled start datetime.
  const group = state.upcomminglives.reduce((acc, cur) => {
    const key = cur.liveStreamingDetails.scheduledStartTime
    const group = acc[key]
    if (group) {
      group.push(cur)
    } else {
      acc[key] = [cur]
    }
    return acc
  }, {})
  const livesGroupedByPublishAt = Object.entries(group).map(([key, value]) => {
    return {
      scheduledStartTime: new Date(key),
      lives: value
    }
  }).sort((a, b) => a.scheduledStartTime - b.scheduledStartTime)

  const currentDatetime = Date.now()

  return (
    <>
    <Timeline align="left">
        {livesGroupedByPublishAt.map(({ scheduledStartTime, lives }) => {
          return (
            <TimelineItem key={scheduledStartTime}>
                <TimelineOppositeContent className={classes.oppsite}>
                    <Typography variant="body2" color="textSecondary">
                    {scheduledStartTime.toLocaleString()}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color={currentDatetime < scheduledStartTime ? 'primary' : 'inherit'}/>
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
