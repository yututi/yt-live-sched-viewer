import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

const _AppBar = ({ onNavClick, onLogoutClick }) => {
  const classes = useStyles()
  return (
    <AppBar
        position="static"
    >
        <Toolbar>
            <IconButton onClick={() => { console.log('click'); onNavClick() }} edge="start" className={classes.menuButton} color="inherit" aria-label="menu"><MenuIcon/></IconButton>
            <Typography variant="h6" className={classes.title}>
                Youtube Live Schedule Viewer
            </Typography>
            <Button color="inherit" onClick={onLogoutClick}>Logout</Button>
        </Toolbar>
    </AppBar>
  )
}

_AppBar.propTypes = {
  onNavClick: PropTypes.func,
  onLogoutClick: PropTypes.func
}

export default _AppBar
