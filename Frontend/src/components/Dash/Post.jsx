import React, {useState} from "react";

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Comments from "./Comments";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { serverURL } from '../../utils/config';

import './dash.css';
import axios from "axios";

// Define base style for post
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1500,
        minWidth: 600
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

    },
    avatar: {
        display: 'flex',

    },
    action: {
        position: 'left'
    }
}));

function handlePostVote(type, thumb, postID, voteWay) {

    let post_flag = false;
    let data;

    if(type === 'upvote' && thumb === false && !voteWay) {
        data = {
            postId: postID,
            vote: 1
        }
        post_flag = true;
    }
    else if(type === 'downvote' && thumb === false && !voteWay) {
         data = {
            postId: postID,
            vote: 0
        }
        post_flag = true;
    }
    else {
        window.alert("You have already voted for this post");
    }

    if(post_flag) {

        const request_token = localStorage.getItem('token');
        let config = {
            headers: {
                Authorization: request_token
            }
        }

        axios.post(`${serverURL}/api/post/vote`,data, config).then(response => {
            // Do some data processing here

        }).catch(error => {
            console.log("Got add vote for post error", error);
        });
    }
}

export function PostCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [count, setCount] = useState(props.upvote - props.downvote);
    const [thumbsUp, setThumbsUp] = useState(props.yesVote);
    const [thumbsDown, setThumbsDown] = useState(props.noVote);


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    let renderText;
    if(props.text['link'] !== undefined) {
        try {
            const link = JSON.parse(props.text).link;
            const description = JSON.parse(props.text).description;
            renderText = (
                <a target="_blank" href={link} rel="noreferrer">{description}</a>
            )
        } catch {
            console.log('not json');
        }

    } else {
        renderText = props.text;
    }


    return (
        <Card className={classes.root}>
            <CardHeader

                avatar={
                    <div>
                        <button
                            className={`material-icons ${thumbsUp ? "selected" : ""}`}
                            id="thumbs_up"
                            onClick={async () => {
                                await setThumbsUp(!thumbsUp);
                                await setThumbsDown(false);
                                handlePostVote("upvote", thumbsUp, props.id, props.yesVote);
                            }}
                        >
                            <ExpandLessIcon />
                        </button>
                        <div style={{textAlign: 'center'}}
                            className={`count ${thumbsUp ? "up" : ""} ${thumbsDown ? "down" : ""}`}
                        >
                            {thumbsUp ? count + 1 : ""}
                            {thumbsDown ? count - 1 : ""}
                            {thumbsUp || thumbsDown ? "" : count}
                        </div>
                        <button
                            className={`material-icons ${thumbsDown ? "selected" : ""}`}
                            id="thumbs_down"
                            onClick={async () => {
                                await setThumbsDown(!thumbsDown);
                                await setThumbsUp(false);
                                handlePostVote("downvote", thumbsDown, props.id, props.noVote);
                            }}
                        >
                            <ExpandMoreIcon />
                        </button>
                    </div>
                }
                titleTypographyProps={{variant:'subtitle1' }}
                title={'Posted by ' + props.creator + ' to r/'+props.community}
                subheader={'At time: '+new Date(props.dateCreated).toDateString()}
            />
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.title}
                </Typography>
            </CardContent>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                        {renderText}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="View comments"
                >
                    <h5>Comments ({props.comments.length})</h5>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        <Comments postId={props.id} comments={props.comments} roots={props.root_comments} />
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export function PostCardImage(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [count, setCount] = useState(props.upvote - props.downvote);
    const [thumbsUp, setThumbsUp] = useState(props.yesVote);
    const [thumbsDown, setThumbsDown] = useState(props.noVote);


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
            <CardHeader

                avatar={
                    <div>
                        <button
                            className={`material-icons ${thumbsUp ? "selected" : ""}`}
                            id="thumbs_up"
                            onClick={async () => {
                                await setThumbsUp(!thumbsUp);
                                await setThumbsDown(false);
                                handlePostVote("upvote", thumbsUp, props.yesVote);
                            }}
                        >
                            <ExpandLessIcon />
                        </button>
                        <div style={{textAlign: 'center'}}
                            className={`count ${thumbsUp ? "up" : ""} ${thumbsDown ? "down" : ""}`}
                        >
                            {thumbsUp ? count + 1 : ""}
                            {thumbsDown ? count - 1 : ""}
                            {thumbsUp || thumbsDown ? "" : count}
                        </div>
                        <button
                            className={`material-icons ${thumbsDown ? "selected" : ""}`}
                            id="thumbs_down"
                            onClick={async () => {
                                await setThumbsDown(!thumbsDown);
                                await setThumbsUp(false);
                                handlePostVote("downvote", thumbsDown, props.noVote);
                            }}
                        >
                            <ExpandMoreIcon />
                        </button>
                    </div>
                }
                titleTypographyProps={{variant:'subtitle1' }}
                title={'Posted by ' + props.creator + ' to r/'+props.community}
                subheader={'At time: '+new Date(props.dateCreated).toDateString()}
            />
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.title}
                </Typography>
            </CardContent>
            <CardContent>
                <CardMedia
                    className={classes.media}
                    image={"https://redditbucket10.s3.us-east-2.amazonaws.com/"+props.image}
                    alt="image unavailable"
                />
            </CardContent>
            <CardActions disableSpacing>

                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="View comments"
                >
                    <h5>Comments ({props.comments.length})</h5>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        <Comments comments={props.comments} roots={props.root_comments} />
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}


