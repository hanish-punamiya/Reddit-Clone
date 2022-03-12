import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";

import TabPanel from "./TabPanel";
import { useStyles } from "./style";
import Conversation from "./Conversation/Conversation";
import { serverURL } from "../../utils/config";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

let dataRecieved = [];

export default function Messages() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mainConversations, setMainConversations] = useState([]);
  let userId = "";
  let token = "";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getConversations = (messages, userId) => {
    let conversations = [];

    for (let message of messages) {
      if (message.toUserId.id !== userId) {
        !conversations.find(
          (conversation) => conversation.id === message.toUserId.id
        ) &&
          conversations.push({
            id: message.toUserId.id,
            name: message.toUserId.firstName,
            messages: [],
          });
      } else {
        !conversations.find(
          (conversation) => conversation.id === message.fromUserId.id
        ) &&
          conversations.push({
            id: message.fromUserId.id,
            name: message.fromUserId.firstName,
            messages: [],
          });
      }
    }

    for (let message of messages) {
      for (let conversation of conversations) {
        if (
          conversation.id === message.fromUserId.id ||
          conversation.id === message.toUserId.id
        ) {
          !conversation.messages.find(
            (conMessage) => conMessage.id === message.id
          ) &&
            conversation.messages.push({
              from: {
                id: message.fromUserId.id,
                name: message.fromUserId.firstName,
              },
              id: message.id,
              date: message.date,
              text: message.text,
            });
        }
      }
    }
    console.log(conversations);
    return conversations;
  };

  const onSend = async (toUserId, text, conname) => {
    try {
      userId = localStorage.getItem("id");
      token = localStorage.getItem("token");
      const result = await axios({
        method: "post",
        url: `${serverURL}/api/message/`,
        headers: {
          Authorization: `${token}`,
        },
        data: {
          toUserId,
          text,
        },
      });
      console.log(result);
      if (result.data) {
        // dataRecieved.push(result.data);
        // setMainConversations((value) => getConversations(dataRecieved, userId));
        // console.log(dataRecieved);
        getMessages();
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  const getMessages = async () => {
    userId = localStorage.getItem("id");
    token = localStorage.getItem("token");
    try {
      const result = await axios({
        method: "get",
        url: `${serverURL}/api/message/`,
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(result.data);
      dataRecieved = result.data;
      setMainConversations((value) => getConversations(dataRecieved, userId));
      setLoading(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const displayMessages = () => {
    return (
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {mainConversations.map((conversation, index) => {
            const label = `${conversation.name}`;
            return <Tab label={label} {...a11yProps(index)} />;
          })}
        </Tabs>
        {mainConversations.map((conversation, index) => {
          return (
            <TabPanel value={value} index={index}>
              <Conversation
                key={conversation.id}
                conversation={conversation}
                onSend={onSend}
              ></Conversation>
            </TabPanel>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {loading
        ? `loading...`
        : mainConversations.length > 0
        ? displayMessages()
        : "No messages to show"}
    </div>
  );
}
