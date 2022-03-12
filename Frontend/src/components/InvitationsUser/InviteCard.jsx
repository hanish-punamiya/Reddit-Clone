// Define base style for post
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {ButtonBase} from "@material-ui/core";
import Button from "./Button";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 900,
        minWidth: 600,
        height: 100,
    },
    request: {
        maxWidth: 900,
        minWidth: 500,
        margin: 10
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    action: {

        textAlign: 'end',
        width: 300,
        margin: 'auto',

    }
}));


export function InviteCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>

                <CardHeader
                    action={
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <div style={{paddingRight: 20}}>
                                <Button communityID={props.communityID} type={"add"}
                                        funct={props.returnFunct}>Accept</Button>
                            </div>
                            <div>
                                <Button communityID={props.communityID} type={"remove"}
                                        funct={props.returnFunct}>Decline</Button>
                            </div>
                        </div>
                    }

                    classes={{ action: classes.action }}
                    titleTypographyProps={{variant:'subtitle1'}}
                    title={'Invited to: r/'+props.community_name}

                />

        </Card>
    );
}