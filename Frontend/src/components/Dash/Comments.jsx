// If use, credit to https://codesandbox.io/s/llmk22kz19?file=/src/Comments.jsx:0-11523 for comment outline
import React, { useState, useContext, createContext } from "react";
import styled from "styled-components";
import TextArea from "react-textarea-autosize";
import Markdown from "./Markdown";
import Card from "./Card";
import Button from "./Button";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import { serverURL } from '../../utils/config';

const CommentContext = createContext({});

function compare(a1, a2) {
    if (JSON.stringify(a1) === JSON.stringify(a2)) {
        return true;
    }
    return false;
}

function gen_comments(comments, colorindex, path, postID, root_comments) {

    if( comments === undefined || comments.length === 0) {
        return;
    }
    return comments.map((comment, i) => {
        if(comment.text === null) {
            comment.text = "";
        }

        for(let root in root_comments) {
            if (comment.id === root_comments[root].comment_id) {
                return (
                    <Comment username={comment.creatorName} commentID={comment.id} parentComment={null}
                             postId={postID} date={comment.date} votes={5} text={comment.text} colorindex={colorindex}
                             key={i} path={[...path, i]} comments={comment.children}
                             votes={root_comments[root].upvotes - root_comments[root].downvotes}
                             cantVote={root_comments[root].userVoted}/>
                );
            }
        }
            return (
                <Comment username={comment.creatorName} commentID={comment.id} parentComment={comment.parentComment}
                         postId={postID} date={comment.date} votes={5} text={comment.text} colorindex={colorindex}
                         key={i} path={[...path, i]} comments={comment.children} />
            );
    });
}



function Reply(props) {
    const [text, setText] = useState("");

    return (
        <div {...props}>
            <TextArea
                placeholder="What are your thoughts?"
                minRows={2}
                defaultValue={text}
                onChange={value => {
                    setText(value.target.value);
                }}
            />
            <div className="panel">

                <Button parent={props.parentID} message={text} post={props.postId}>COMMENT</Button>
            </div>
        </div>
    );
}

Reply = styled(Reply)`
  border-radius: 8px;
  border: solid 1px #3d4953;
  overflow: hidden;

  &.hidden {
    display: none;
  }

  textarea {
    font-family: inherit;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    resize: none;
    background: white;
    padding: 12px;
    color: black;
    border: none;
    max-width: 100%;
    min-width: 100%;
  }

  .panel {
    display: flex;
    align-items: center;
    background: #3d4953;
    padding: 8px;

    .comment_as {
      font-size: 14px;
      color: #cccccc;
      margin-right: 8px;

      .username {
        display: inline-block;
        color: #4f9eed;
      }
    }

    ${Button} {
      font-size: 14px;
      margin-left: auto;
    }
  }
`;

function handleCommentVote(type, thumb, commentID, cantVote) {

    let post_flag = false;
    let data;

    if(type === 'upvote' && thumb === false && !cantVote) {
        data = {
            commentId: commentID.toString(),
            vote: 1
        }
        post_flag = true;
    }
    else if(type === 'downvote' && thumb === false && !cantVote) {
        data = {
            commentId: commentID.toString(),
            vote: 0
        }
        post_flag = true;
    }

    if(post_flag) {

        const request_token = localStorage.getItem('token');
        let config = {
            headers: {
                Authorization: request_token
            }
        }

        axios.post(`${serverURL}/api/comment/addVote`,data, config).then(response => {
            // Do some data processing here

        }).catch(error => {
            console.log("Got add vote for comment error", error);
        });
    }
}

function Rating(props) {
    const [count, setCount] = useState(props.votes);
    const [thumbsUp, setThumbsUp] = useState(false);
    const [thumbsDown, setThumbsDown] = useState(false);

    return (
        <div {...props}>
            <button
                className={`material-icons ${thumbsUp ? "selected" : ""}`}
                id="thumbs_up"
                onClick={async () => {
                    await setThumbsUp(!thumbsUp);
                    await setThumbsDown(false);
                    handleCommentVote("upvote", thumbsUp, props.commentID, props.cantVote);
                }}
            >
                <ExpandLessIcon />
            </button>
            <div
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
                    handleCommentVote("downvote", thumbsDown, props.commentID, props.cantVote);
                }}
            >
               <ExpandMoreIcon />
            </button>
        </div>
    );
}

Rating = styled(Rating)`
  display: flex;
  flex-direction: column;
  margin-right: 12px;

  .count {
    font-weight: bold;
    text-align: center;
    color: #3d4953;

    &.up {
      color: #4f9eed;
    }

    &.down {
      color: #ed4f4f;
    }
  }

  button#thumbs_up,
  button#thumbs_down {
    border: none;
    background: none;
    cursor: pointer;
    color: #3d4953;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

  #thumbs_up.selected {
    color: #4f9eed;
  }

  #thumbs_down.selected {
    color: #ed4f4f;
  }
`;

function Comment(props) {
    const [replying, setReplying] = useContext(CommentContext);
    const [minimized, setMinimized] = useState(false);
    const [hidden, setHidden] = useState(false);


    // useEffect( TODO: Fix bug where each time you try to reply to a hidden comment, it will go hidden again
    //     async () => {
    //         if (props.path.length > 2 && props.path.length % 2 === 0) {
    //             setHidden(true);
    //         }
    //         if (props.path[props.path.length - 1] > 3) {
    //             setHidden(true);
    //         }
    //     },
    //     [props.path]
    // );



    if(props.parentComment === null) {
        return (
            <div {...props}>
                {hidden ? (
                    <button
                        id="showMore"
                        onClick={() => {
                            setHidden(false);
                        }}
                    >
                        Show More Replies
                    </button>
                ) : (
                    <>
                        <div id="left" className={minimized ? "hidden" : ""}>
                            <Rating votes={props.votes} commentID={props.commentID} cantVote={props.cantVote} />
                        </div>
                        <div id="right">
                            <div id="top">
              <span
                  className="minimize"
                  onClick={() => {
                      setMinimized(!minimized);
                  }}
              >
                [{minimized ? "+" : "-"}]
              </span>
                                <span id="username">
                <a href="">{props.username}</a>
              </span>
                                <span id="date">
                <a href="">{props.date}</a>
              </span>
                            </div>
                            <div id="content" className={minimized ? "hidden" : ""}>
                                <Markdown options={{ forceBlock: true }}>{props.text}</Markdown>
                            </div>
                            <div id="actions" className={minimized ? "hidden" : ""}>
              <span
                  className={`${compare(replying, props.path) ? "selected" : ""}`}
                  onClick={() => {
                      if (compare(replying, props.path)) {
                          setReplying([]);
                      } else {
                          setReplying(props.path);
                      }
                  }}
              >
                reply
              </span>
                            </div>
                            <Reply
                                className={
                                    compare(replying, props.path) && !minimized ? "" : "hidden"
                                }
                                parentID={props.commentID} postId={props.postId}/>
                            <div className={`comments ${minimized ? "hidden" : ""}`}>
                                {gen_comments(props.comments, props.colorindex + 1, [
                                    ...props.path
                                ], props.postId)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    else {
        return (
            <div {...props}>
                {hidden ? (
                    <button
                        id="showMore"
                        onClick={() => {
                            setHidden(false);
                        }}
                    >
                        Show More Replies
                    </button>
                ) : (
                    <>

                        <div id="right">
                            <div id="top">
              <span
                  className="minimize"
                  onClick={() => {
                      setMinimized(!minimized);
                  }}
              >
                [{minimized ? "+" : "-"}]
              </span>
                                <span id="username">
                <a href="">{props.username}</a>
              </span>
                                <span id="date">
                <a href="">{props.date}</a>
              </span>
                            </div>
                            <div id="content" className={minimized ? "hidden" : ""}>
                                <Markdown options={{ forceBlock: true }}>{props.text}</Markdown>
                            </div>
                            <div id="actions" className={minimized ? "hidden" : ""}>
              <span
                  className={`${compare(replying, props.path) ? "selected" : ""}`}
                  onClick={() => {
                      if (compare(replying, props.path)) {
                          setReplying([]);
                      } else {
                          setReplying(props.path);
                      }
                  }}
              >
                reply
              </span>
                            </div>
                            <Reply
                                className={
                                    compare(replying, props.path) && !minimized ? "" : "hidden"
                                }
                                parentID={props.commentID} postId={props.postId}/>
                            <div className={`comments ${minimized ? "hidden" : ""}`}>
                                {gen_comments(props.comments, props.colorindex + 1, [
                                    ...props.path
                                ], props.postId)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

}

Comment = styled(Comment)`
  display: flex;
  text-align: left;
  background: ${props => (props.colorindex % 2 === 0 ? "white" : "white")};
  padding: 16px 16px 16px 12px;
  border: 0.1px solid #3d4953;
  border-radius: 8px;

  #showMore {
    background: none;
    border: none;
    color: #53626f;
    cursor: pointer;
    font-size: 13px;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }

  .comments {
    > * {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0px;
      }
    }

    &.hidden {
      display: none;
    }
  }

  #left {
    text-align: center;
    &.hidden {
      visibility: hidden;
      height: 0;
    }
  }

  #right {
    flex-grow: 1;

    #top {
      .minimize {
        cursor: pointer;
        color: #53626f;

        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
      }

      #username {
        color: #4f9eed;
      }

      #date {
        display: inline-block;
        color: #53626f;
      }

      > * {
        margin-right: 8px;
      }
    }

    #content {
      color: black;

      &.hidden {
        display: none;
      }
    }

    #actions {
      color: #53626f;
      margin-bottom: 12px;

      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

      &.hidden {
        display: none;
      }

      > .selected {
        font-weight: bold;
      }

      > * {
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }

  ${Reply} {
    margin-bottom: 12px;
  }
`;

function Comments(props) {
    var [replying, setReplying] = useState([]);
    var [comments, setComments] = useState(props.comments);


    return (
        <Card {...props}>
            <span id="comments">Comments</span>
            <span id="comments_count">({comments.length})</span>
            <Reply postId={props.postId}/>
            <CommentContext.Provider value={[replying, setReplying]}>
                {gen_comments(comments, 0, [], props.postId, props.roots)}
            </CommentContext.Provider>
        </Card>
    );
}

export default styled(Comments)`
  max-width: 750px;
  min-width: min-content;

  > * {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  #comments,
  #comments_count {
    font-weight: 900;
    font-size: 20px;
    display: inline-block;
    margin-right: 4px;
    margin-bottom: 8px;
  }

  #comments {
    color: black;
  }

  #comments_count {
    color: black;
  }
`;
