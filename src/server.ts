import 'dotenv/config';
import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import ConnectDb from './config/connectDb';
import AuthRouter from './routers/auth-router';
import ProjectsRouter from './routers/projects-router';
import TasksRouter from './routers/tasks-router';
import TeamsRouter from './routers/teams-router';
import TimerRouter from './routers/timer-router';
import BlogsRouter from './routers/blogs-router';
import OverviewRouter from './routers/overview-router';
import GlobalErr from './middleware/global-err';

// app instance
const app = express();

// Database connections
ConnectDb();

// adding funcionalities for the application

// 1. body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended : true
}));

// 2. cors
app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:4200" : "https://taore.vercel.app", // Allow only specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Restrict methods
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ], // Allow only necessary headers
    exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'], // Expose useful headers
    credentials: true, // Allow credentials (cookies, authentication headers)
    optionsSuccessStatus: 204, // Respond to preflight requests with 204
    maxAge: 86400 // Cache preflight responses for 24 hours
}));

// 3. cookies configuration
const secretKey : string = process.env.SECRET_KEY_COOKIE ?? '@123345@';
app.use(cookieParser(
    secretKey
));

// 4. morgan logging
app.use(morgan('combined'));

// 5. helmet
app.use(helmet());

// 6. compression
app.use(compression());

// routes

// 1. user auth router
app.use(AuthRouter);

// 2. projects
app.use(ProjectsRouter);

// 3. tasks
app.use(TasksRouter);

// 4. teams
app.use(TeamsRouter);

// 5. timer 
app.use(TimerRouter);

// 6. blogs
app.use(BlogsRouter);

// 7. Overview
app.use(OverviewRouter);

// middlewares
app.use(GlobalErr);

// trust proxy configurations
app.set('trust proxy', 1);

// starting the server
const port : string | number = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})