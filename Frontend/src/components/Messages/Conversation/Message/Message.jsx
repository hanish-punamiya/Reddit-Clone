import React from "react";
import { useStyles } from "./style";
import { Paper, Typography } from "@material-ui/core";
// import { serverURL, imageBucket } from "../../../../utils/config";

export default function Message({ message }) {
  const classes = useStyles();

  const dateTime = new Date(message.date);

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="subtitle1">
          {message.from.name}
          <Typography
            variant="subtitle2"
            style={{ marginLeft: 10 }}
            component="subtitle1"
          >
            {" "}
            {dateTime.toLocaleString()}
          </Typography>
          <hr />
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <Typography align="left" display="block" paragraph>
            {message.text}
          </Typography>
        </Paper>
      </Paper>
    </div>
  );
}
