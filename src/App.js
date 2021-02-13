import './App.css'
import { useHistory } from 'react-router-dom'
import RouterView from './router'
import { useContext, useState } from 'react'
import Appbar from './components/Appbar'
import LoginDialog from './components/LoginDialog'
import LinearProgress from '@material-ui/core/LinearProgress'
import { store, Actions } from './stores/GoogleAuth'
import Drawer from './components/Drawer'

function App () {
  const history = useHistory()

  const [isDrawerOpen, setIsOpen] = useState(false)

  const {
    state,
    dispatch
  } = useContext(store)

  if (state.isInitialized && state.isLoggedIn) {
    if (history.location.pathname === '/login') history.push('/')
  }

  const onLogoutClick = () => {
    state.api.revokeToken().then(() => {
      dispatch({ type: Actions.LOGOUT })
    })
  }

  return (
    <div className="App">
      <Appbar onNavClick={() => setIsOpen(true)} onLogoutClick={onLogoutClick}></Appbar>
      {!state.isInitialized ? <LinearProgress color="secondary" /> : ''}
      {state.isLoggedIn
        ? (
          <RouterView auth={state.api}></RouterView>
          )
        : ''}
      <LoginDialog requireLogin={!state.isLoggedIn && state.isInitialized} auth={state.api}></LoginDialog>
      <Drawer open={isDrawerOpen} onClose={() => setIsOpen(false)}></Drawer>
    </div>
  )
}

export default App
