import Appbar from "./Appbar"
import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
    scaffold: {
        minHeight: "100%",
        display: "flex",
        flexDirection: "column"
    },
    body: {
        flex: 1
    }
}));

const Scaffold = (props) => {
    const style = useStyles()
    return (
        <div className={style.scaffold}>
            <Appbar></Appbar>
            <div className={style.body}>
                {props.body?(<props.body></props.body>):""}
            </div>
        </div>
    )
}