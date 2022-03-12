// Define base style for post
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {ButtonBase, Checkbox, FormControlLabel, ListItem} from "@material-ui/core";
import Modal from "react-awesome-modal";
import List from '@material-ui/core/List';
import Button from "./Button";


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 900,
        minWidth: 500,
        display: 'inline-block'
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
        display: 'block',
        textAlign: 'end',
        width: 220,
        margin: 'auto',
        justify: 'center'

    }
}));


export function CommunityCard(props) {
    const classes = useStyles();
    const [visible, setVisible] = React.useState(false);
    const [checkedValues, setCheckedValues] = React.useState([]);


    const handleCheck = (e,x) => {
        if(checkedValues.includes(x)) {
            setCheckedValues(checkedValues.filter(c => c !==x));
        }
        else {
            setCheckedValues([...checkedValues, x]);
        }

    };

    let requested_users = props.requests.map( entry => {

        return (
            <ListItem>
                <Card className={classes.request}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="user" className={classes.avatar}
                                    src={"https://redditbucket10.s3.us-east-2.amazonaws.com/"+entry.profilePicture}
                                    alt="Img">(None)</Avatar>
                        }
                        action={
                            <FormControlLabel control={<Checkbox
                                label={entry.id} key={entry.id}
                                onChange={e => handleCheck(e,entry.id)}
                                checked={checkedValues.includes(entry.id)}
                            />} label="Approve" />

                        }
                        title={entry.firstName + " " + entry.lastName}
                    />
                </Card>
            </ListItem>
        )
    })

    return (
        <Card className={classes.root}>
            <ButtonBase
                onClick={() =>{setVisible(true)}}
                >
            <CardHeader

                action={

                        <div>
                            <h5>Number of Requests: {props.requests.length}</h5>
                        </div>

                    }
                classes={{ action: classes.action }}
                titleTypographyProps={{variant:'subtitle1' }}
                title={'Requests for r/'+props.community}
            />
            </ButtonBase>

            <Modal visible={visible} width="600" height="450" effect="fadeInUp"
                   onClickAway={() => {
                       setVisible(false);
                   } }>
                <div className="container">
                    <header><h3>Requests for r/{props.community}</h3></header>
                    <form onSubmit={"#"}>
                        <div className="form-group">
                            <List style={{height: 300, overflow: 'auto'}}>
                                {requested_users}
                            </List>
                        </div>

                        <div style={{marginTop: 15, marginRight: 10}}>
                            <div style={{float: "right"}}>
                                <a className="btn btn-secondary" href="javascript:void(0);"
                                   onClick={() => setVisible(false)}>Cancel</a>
                            </div>
                            <div style={{float: "right", marginRight: 5}}>
                                <a onClick={() => setVisible(false)}>
                                    <Button communityID={props.communityID} users={checkedValues}
                                            oncommit={props.oncommit} type="add">Approve Selected</Button>
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

        </Card>
    );
}

export function UserCard(props) {
    const classes = useStyles();
    const [visible, setVisible] = React.useState(false);
    const [checkedValues, setCheckedValues] = React.useState([]);



    const handleCheck = (e,x) => {
        if(checkedValues.includes(x)) {
            setCheckedValues(checkedValues.filter(c => c !==x));
        }
        else {
            setCheckedValues([...checkedValues, x]);
        }
    };

    let active_communities = props.communities.map( entry => {

        return (
            <ListItem>
                <Card className={classes.request}>
                    <CardHeader

                        action={
                            <FormControlLabel control={<Checkbox
                                label={entry.id} key={entry.id}
                                onChange={e => handleCheck(e,entry.id)}
                                checked={checkedValues.includes(entry.id)}
                            />} label="Remove" />

                        }
                        title={entry.name}
                    />
                </Card>
            </ListItem>
        )
    })

    return (
        <Card className={classes.root}>
            <ButtonBase
                onClick={() =>{setVisible(true)}}
            >
                <CardHeader
                    avatar={
                        <Avatar aria-label="user" className={classes.avatar}
                                src={"https://redditbucket10.s3.us-east-2.amazonaws.com/"+props.profilePicture}
                                alt="Img">(None)</Avatar>
                    }

                    classes={{ title: classes.action }}
                    titleTypographyProps={{variant:'h5' }}
                    title={props.firstName + " " + props.lastName}
                />
            </ButtonBase>

            <Modal visible={visible} width="600" height="450" effect="fadeInUp"
                   onClickAway={() => {
                       setVisible(false);
                   } }>
                <div className="container">
                    <header><h3>User: {props.firstName +" "+props.lastName}</h3></header>
                    <form onSubmit={"#"}>
                        <div className="form-group">
                            <List style={{height: 300, overflow: 'auto'}}>
                                {active_communities}
                            </List>
                        </div>

                        <div style={{marginTop: 15, marginRight: 10}}>
                            <div style={{float: "right"}}>
                                <a className="btn btn-secondary" href="javascript:void(0);"
                                   onClick={() => setVisible(false)}>Cancel</a>
                            </div>
                            <div style={{float: "right", marginRight: 5}}>
                                <a onClick={() => setVisible(false)}>
                                    <Button user_id={props.userID} communities={checkedValues}
                                            oncommit={props.oncommit} type="remove">Remove from Selected</Button>
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

        </Card>
    );
}