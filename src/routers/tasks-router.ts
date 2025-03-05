import express from 'express';
import type { Router} from 'express';

// Tasks Router
const TasksRouter : Router = express.Router();

// routes
TasksRouter.get("/");
TasksRouter.get("/:id");
TasksRouter.post("/");
TasksRouter.delete("/:id");
TasksRouter.put("/:id");

// exporting the modules
export default TasksRouter;