import {
    makeStyles
} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        width: theme.spacing(50),
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        flexWrap: "wrap",
        "& > *": {
            //   height: theme.spacing(16),
        },
    },
    root: {
        display: "flex",
        flexDirection: "column",
    },
}));