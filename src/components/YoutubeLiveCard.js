
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        maxWidth: "400px",
        marginTop: "2px",
        marginBottom: "2px"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function YoutubeLiveCard({live}) {
    const classes = useStyles();
  
    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                    {live.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {live.description}
                </Typography>
                </CardContent>
                <div className={classes.controls}>
                <IconButton aria-label="play/pause">
                    <PlayArrowIcon className={classes.playIcon} />
                </IconButton>
                </div>
            </div>
            <CardMedia
                className={classes.cover}
                image={live.thumbnails.medium.url}
                title={live.title}
            />
        </Card>
    );
}
