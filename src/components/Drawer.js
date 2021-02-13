import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import { routes } from '../router'

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
})
const _Drawer = ({ open, onClose }) => {
  const history = useHistory()

  const classes = useStyles()

  const routeTo = (path) => () => {
    history.push(path)
    onClose()
  }

  return (
    <Drawer anchor={'left'} open={open} onClose={onClose}>
        <List className={classes.list}>
        {routes.map(route => (
            <ListItem button key={route.path}>
                <ListItemText primary={route.name} onClick={routeTo(route.path)} />
            </ListItem>
        ))}
        </List>
    </Drawer>
  )
}

_Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
}

export default _Drawer
