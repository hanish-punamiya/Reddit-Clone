import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { serverURL } from '../../utils/config';


function handleUserInvite(communityID, type, returnFunction) {

    const request_token = localStorage.getItem('token');


    let config = {
        headers: {
            Authorization: request_token
        }
    };

    let message;
    if(type === "accept") {
        config['data'] = {communityId: communityID, status: 'Accept'};
        message = "Successfully joined group";
    }

    else {
        config['data'] = {communityId: communityID, status: 'Reject'};
        message = "Request successfully declined";
    }

    axios.delete(`${serverURL}/api/invite/inviteAction`,config).then(response => {
        // Do some data processing here
        window.alert(message);
        returnFunction();
    }).catch(error => {
        console.log("Got remove user error", error);
        window.alert("Error accepting or declining invitation");
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


    if(props.type === "add") {
        return (
            <button
                {...props}
                ref={button}
                onClick={e => {
                    e.preventDefault();
                    animate(e);
                    handleUserInvite(props.communityID, "accept", props.funct);
                }}
            >
                {props.children}
            </button>
        );
    }

    else {
        return (
            <button
                {...props}
                ref={button}
                onClick={e => {
                    e.preventDefault();
                    animate(e);
                    handleUserInvite(props.communityID, "decline", props.funct);

                }}
            >
                {props.children}
            </button>
        );
    }


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



