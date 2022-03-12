import {
    makeStyles,
    useTheme
} from "@material-ui/core/styles";



export const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        // width: "80vw",
        overflow: "auto",
    },
    toolBar: {
        backgroundColor: "grey",
        width: "80vw",
    },
    margin: {
        marginLeft: 30,

        marginBottom: 10,
        marginTop: 10,
    },
    button: {
        marginLeft: 30,
        marginBottom: 10,
        marginTop: 10,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));