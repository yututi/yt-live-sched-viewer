
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    maxHeight: '300px',
    marginTop: '2px',
    marginBottom: '2px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  content: {
    flex: '1 0 auto',
    textAlign: 'left',
    overflow: 'hidden'
  },
  text: {
    wordBreak: 'break-all',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  cover: {
    width: '30%',
    maxWidth: '300px',
    minWidth: '100px'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

export default function YoutubeLiveCard ({ live }) {
  const classes = useStyles()

  const openChannel = () => {
    window.open(`https://www.youtube.com/channel/${live.snippet.channelId}`)
  }

  return (
    <Card className={classes.root}>
        <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography className={classes.text} component="h6" variant="h6">
                  {live.snippet.title}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <IconButton onClick={openChannel}>
                  <OpenInNewIcon />
              </IconButton>
            </div>
        </div>
        <CardMedia
            className={classes.cover}
            image={live.snippet.thumbnails.high.url}
            title={live.snippet.title}
        />
    </Card>
  )
}

YoutubeLiveCard.propTypes = {
  live: PropTypes.any
}
