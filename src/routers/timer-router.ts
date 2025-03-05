import express from 'express';
import type { Router} from 'express';

// Timer Router
const TimerRouter : Router = express.Router();

// routes
TimerRouter.get("/");
TimerRouter.get("/:id");
TimerRouter.post("/");
TimerRouter.delete("/:id");
TimerRouter.put("/:id");

// exporting the modules
export default TimerRouter;