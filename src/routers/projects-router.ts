import express from 'express';
import type { Router} from 'express';

// projects Router
const ProjectsRouter : Router = express.Router();

// routes
ProjectsRouter.get("/");
ProjectsRouter.get("/:id");
ProjectsRouter.post("/");
ProjectsRouter.delete("/:id");
ProjectsRouter.put("/:id");

// exporting the modules
export default ProjectsRouter;