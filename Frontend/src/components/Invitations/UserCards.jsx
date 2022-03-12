// Define base style for post
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {ButtonBase} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 900,
        minWidth: 500,
        height: 50,
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
        display: 'inline-block',
        textAlign: 'end',
        width: 250,
        margin: 'auto',
        justify: 'flex-end'

    }
}));

export function SelectedUser(props) {
    const classes = useStyles();

    if(props.type === 'add') {
        return (
            <Card className={classes.root}>
                <ButtonBase
                    onClick={() =>{props.add(props.id, props.name, props.email)}}
                >
                    <CardHeader
                        action={props.email}
                        classes={{ action: classes.action }}
                        titleTypographyProps={{variant:'subtitle1' }}
                        title={'User: '+props.name}

                    />
                </ButtonBase>

            </Card>
        );
    }
    else {
        return (
            <Card className={classes.root}>
                <ButtonBase
                    onClick={() =>{props.add(props.id)}}
                >
                    <CardHeader
                        action={props.email}
                        classes={{ action: classes.action }}
                        titleTypographyProps={{variant:'subtitle1' }}
                        title={'User: '+props.name}

                    />
                </ButtonBase>

            </Card>
        );
    }
}

export function InvitedUser(props) {
    const classes = useStyles();

        return (
            <Card className={classes.root}>
                <ButtonBase
                >
                    <CardHeader
                        action={"At time: "+new Date(props.time).toDateString()
                        }
                        avatar={
                            <h4>User: {props.name}</h4>
                        }
                        classes={{ action: classes.action }}
                        titleTypographyProps={{variant:'subtitle2'}}
                        title={'Invited to: '+props.community}

                    />
                </ButtonBase>
            </Card>
        );
}