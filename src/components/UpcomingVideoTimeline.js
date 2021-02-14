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
      // FIXME: ロジックをreducerへ移したいが、dispatchを呼び出すとreducerの処理が2回呼ばれる挙動になるため、
      // fetchが2回動いてしまう.
      // 原因がわからないのでここで呼び出す。ここから呼び出すdispatchも2回呼び出されるがfetchは1回なので...
      // if (state.lastFetched) {
      //   const throttleDate = new Date()
      //   throttleDate.setMinutes(throttleDate.getMinutes() - 3)
      //   if (state.lastFetched >= throttleDate) {
      //     return state
      //   }
      // }
      // dispatch({ type: Actions.FETCH_START })
      // Promise.all(state.subscriptions.map(async id =>
      //   state.api.fetchUpcomingLivesByChannelId(id)
      // )).then(async result => {
      //   const all = result.reduce((acc, cur) => [...acc, ...cur.items], [])

      //   const videoIds = all.reduce((acc, cur) => {
      //     acc.push(cur.id.videoId)
      //     return acc
      //   }, [])

      //   const detailResult = await state.api.fetchLiveDetailsByVideoIds(videoIds)

      //   dispatch({ type: Actions.SET_UPCOMING_LIVES, payload: detailResult.items })
      // })
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
