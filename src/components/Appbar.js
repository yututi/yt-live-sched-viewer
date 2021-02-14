import { useState, useContext } from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import GitHubIcon from '@material-ui/icons/GitHub'
import SettingsIcon from '@material-ui/icons/Settings'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'

import { store, Actions } from '../stores/Youtube'

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
  const [anchorEl, setAnchorEl] = useState(null)
  const { state, dispatch } = useContext(store)

  const openMenu = e => {
    setAnchorEl(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const withClose = (handler) => () => {
    closeMenu()
    handler()
  }

  const transferToGithub = () => {
    window.open('https://github.com/yututi/yt-live-sched-viewer')
  }

  const resetChannels = () => {
    dispatch({ type: Actions.FETCH_START })
    state.api.fetchMySubscriptionChannelIds().then(result => {
      dispatch({ type: Actions.SET_POTENTIAL_SUBSCRIPTIONS, payload: result.map(item => item.snippet) })
    })
  }

  const menuItems = [
    {
      Icon: GitHubIcon,
      text: 'Github',
      handler: withClose(transferToGithub)
    },
    {
      Icon: RotateLeftIcon,
      text: 'チャンネル再設定',
      handler: withClose(resetChannels)
    },
    {
      Icon: ExitToAppIcon,
      text: 'ログアウト',
      handler: withClose(onLogoutClick)
    }
  ]

  return (
    <>
    <AppBar
        position="sticky"
    >
        <Toolbar>
            <IconButton onClick={onNavClick} edge="start" className={classes.menuButton} color="inherit" aria-label="menu"><MenuIcon/></IconButton>
            <Typography variant="h6" className={classes.title}>
                Youtube Live Schedule Viewer
            </Typography>
            <IconButton color="inherit" onClick={openMenu}><SettingsIcon></SettingsIcon></IconButton>
        </Toolbar>
    </AppBar>
    <Menu
      id="settings"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
      {menuItems.map(item => (
      <MenuItem key={item.text} onClick={item.handler}>
        <ListItemIcon>
          <item.Icon fontSize="small"></item.Icon>
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </MenuItem>
      ))}
    </Menu>
    </>
  )
}

_AppBar.propTypes = {
  onNavClick: PropTypes.func,
  onLogoutClick: PropTypes.func
}

export default _AppBar
