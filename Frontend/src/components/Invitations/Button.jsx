import React, { useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { serverURL } from '../../utils/config';


function handleSendInvite(communityID, userList) {

    if(communityID.length === 0) {
        window.alert("Must be a moderator of a community to send a request");
        return;
    }

    let all_users = [];
    let user_status = {}
    userList.map( user => {
        all_users.push(user.id);
        user_status[user.id] = {name: user.name, email: user.email};
    })

    const data = {
        communityId: communityID[0],
        userIds: all_users
    }

    const request_token = localStorage.getItem('token');
    let config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: request_token
        }
    }

    axios.post(`${serverURL}/api/invite/userInvite`,data, config).then(response => {
        // Do some data processing here
        let response_message = `Response for invites sent to r/${communityID[1]}:\n`;
        response.data.map(user_back => {
            let message = `${user_status[user_back.id].name} (${user_status[user_back.id].email}): ${user_back.message}\n`;
            response_message = response_message + message;
        })
        window.alert(response_message);

    }).catch(error => {
        console.log("Got send invite error", error);
        window.alert("Error sending invites");
    });
}


function Button(props) {
    const button = useRef();

    function animate(e) {
        var d = document.createElement("div");
        d.className = "circle";
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        d.style.left = `${x}px`;
        d.style.top = `${y}px`;
        button.current.appendChild(d);
        d.addEventListener("animationend", function() {
            d.parentElement.removeChild(d);
        });
    }

        return (
            <button
                {...props}
                ref={button}
                onClick={e => {
                    e.preventDefault();
                    animate(e);
                    handleSendInvite(props.communityInfo, props.users);
                }}
            >
                {props.children}
            </button>
        );

}

export default styled(Button)`
  overflow: hidden;
  position: relative;
  display: block;
  font-weight: bold;
  width: fit-content;
  height: fit-content;
  color: #ffffff;
  cursor: pointer;
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: #4f9eed;
  transition: 0.1s ease 0s;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

  &:hover {
    background: #2e78c2;
  }

  .circle {
    position: absolute;
  box-sizing: border-box;
    background: white;
  border-radius: 50%;
  animation: clickEffect 0.4s ease-out;
  z-index: 99999;
  }

  @keyframes clickEffect{
    0% {
    opacity: 1;
    width: 0.5em; 
        height: 0.5em;
    margin: -0.25em;
    border-width: 0.5em;
    }

    100% {
        opacity: 0;
        width: 15em; 
        height: 15em;
        margin: -7.5em;
        border-width: 0.03em;
      }
  }
`;



