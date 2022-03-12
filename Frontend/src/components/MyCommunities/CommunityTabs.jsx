import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Typography, Tab, Box } from "@material-ui/core";
import Communities from "./Communities";
import CreateCommunity from "./CreateCommunity";
import EditCommunity from "./EditCommunity";
import CommunityAnalytics from "../CommunityAnalytics/CommunityAnalytics";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const CommunityTabs = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [community, setCommunity] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const goBack = () => {
    setValue(0);
  };

  const editCommunity = (com) => {
    setCommunity(com);
    setValue(3);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: "grey" }}>
        <Tabs value={value} onChange={handleChange} aria-label="community-tabs">
          <Tab label="Communities" {...a11yProps(0)} />
          <Tab label="Create Community" {...a11yProps(1)} />
          <Tab label="Community Analytics" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Communities
          goBack={goBack}
          editCommunity={editCommunity}
        ></Communities>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CreateCommunity goBack={goBack}></CreateCommunity>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CommunityAnalytics></CommunityAnalytics>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EditCommunity goBack={goBack} community={community}></EditCommunity>
      </TabPanel>
    </div>
  );
};

export default CommunityTabs;
