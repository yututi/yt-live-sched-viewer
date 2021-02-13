import './App.css';
import {useHistory} from "react-router-dom"
import RouterView from "./router"
import {useContext, useState} from "react"
import Appbar from "./components/Appbar"
import LoginDialog from "./components/LoginDialog"
import LinearProgress from '@material-ui/core/LinearProgress';
import {YoutubeStateProvider} from "./stores/Youtube"
import {store} from "./stores/GoogleAuth"
import Drawer from "./components/Drawer"


// const auth = Auth.forGoogleApi({
//   clientId: "88457129753-tqqvr0ds1j2d20dojtirv21kn78bfi5n.apps.googleusercontent.com",
//   redirectUrl: "http://localhost:8080/login",
//   scope: ["https://www.googleapis.com/auth/youtube.readonly"]
// })

function App() {

  const history = useHistory()

  const [isDrawerOpen, setIsOpen] = useState(false)

  const {
    state
  } = useContext(store)

  if(state.isInitialized && state.isLoggedIn) {
    if(history.location.pathname === "/login") history.push("/")
  }

  return (
    <div className="App">
      <Appbar onNavClick={() => setIsOpen(true)}></Appbar>
      {!state.isInitialized ? <LinearProgress color="secondary" />: ""}
      {state.isLoggedIn?(
        <YoutubeStateProvider>
          <RouterView auth={state.api}></RouterView>
        </YoutubeStateProvider>
      ): ""}
      <LoginDialog requireLogin={!state.isLoggedIn && state.isInitialized} auth={state.api}></LoginDialog>
      <Drawer open={isDrawerOpen} onClose={() => setIsOpen(false)}></Drawer>
    </div>
  );
}

export default App;
