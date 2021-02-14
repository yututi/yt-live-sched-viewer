
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Avatar from '@material-ui/core/Avatar'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import { store, Actions } from '../stores/Youtube'
import { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  checkbox: {
    marginLeft: theme.spacing(2)
  },
  body: {
    flex: 1
  }
}))

const SubscroptionSelectDialog = () => {
  const stlye = useStyles()

  const { state, dispatch } = useContext(store)

  const isOpen = state.potentialSubscriptions.length > 0

  const checkedChannelIds = []
  const handleChange = e => {
    const {
      name,
      checked
    } = e.target
    if (checked) {
      checkedChannelIds.push(name)
    } else {
      checkedChannelIds.splice(checkedChannelIds.indexOf(name), 1)
    }
  }

  const handleOk = () => {
    dispatch({ type: Actions.SET_SUBSCRIPTIONS, payload: checkedChannelIds })
  }

  return (
    <Dialog
      aria-labelledby="subs"
      open={isOpen}
      maxWidth={'xs'}
      scroll="paper"
      >
      <DialogTitle id="subs">チャンネルを選択してください</DialogTitle>
      <DialogContent>
        <DialogContentText>ここで選んだチャンネルの配信予定をタイムライン表示します。</DialogContentText>
        <List>
        {state.potentialSubscriptions.map((subs) => (
          <ListItem key={subs.resourceId.channelId}>
            <ListItemAvatar>
                <Avatar src={subs.thumbnails.medium.url}>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={subs.title} />
            <Checkbox
                name={subs.resourceId.channelId}
                className={stlye.checkbox}
                onChange={handleChange}
            ></Checkbox>
          </ListItem>
        ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubscroptionSelectDialog
