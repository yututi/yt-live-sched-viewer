import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const LoginDialog = ({requireLogin, auth}) => {

    const handleLogin = () => {
        auth.getToken()
    }

    return (
      <Dialog open={requireLogin} aria-labelledby="login-form">
      <DialogTitle id="login-form">ログインしてください</DialogTitle>
        <DialogActions>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default LoginDialog