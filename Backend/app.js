import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import userRoute from './server/routes/users.js';
import registerRoute from './server/routes/users.js';
import inviteRoute from './server/routes/invites.js';
import messageRoute from './server/routes/messages.js';
import myCommunityRoute from './server/routes/community.js';
import commentRoute from './server/routes/comment.js';
import postRoute from './server/routes/post.js';
import dashboardRoute from './server/routes/dashboard.js';
import moderatorRoute from './server/routes/moderation.js';
import communityHomeRoute from './server/routes/communityHome.js';
import communitySearchRoute from './server/routes/communitySearch.js';
import communityAnalyticsRoute from './server/routes/communityAnalytics.js';
import db from './server/models/index.js';
import passport from 'passport';
import ps from './server/config/passport.js';
import { redisClient } from './server/config/redisClient.js';

const redis = redisClient;

dotenv.config({ path: './config/.env' });
new db();
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ extended: true }));
app.use('/api/user', userRoute);
app.use('/api/user', registerRoute);
app.use('/api/invite', inviteRoute);
app.use('/api/message', messageRoute);
app.use('/api/mycommunity', myCommunityRoute);
app.use('/api/comment', commentRoute);
app.use('/api/post', postRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/moderator', moderatorRoute);
app.use('/api/community-home', communityHomeRoute);
app.use('/api/community-search', communitySearchRoute);
app.use('/api/community-analytics', communityAnalyticsRoute);
// passport configure
app.use(passport.initialize());
const passportJwt = ps(passport);

app.get('/', (req, res) =>
  res.status(200).send({
    message: 'Hello from the Reddit BackEnd...',
  })
);

export default app;
