import express from 'express';
import type { Router} from 'express';

// Blogs Router
const BlogsRouter : Router = express.Router();

// routes
BlogsRouter.get("/");
BlogsRouter.get("/:id");
BlogsRouter.post("/");
BlogsRouter.delete("/:id");
BlogsRouter.put("/:id");

// exporting the modules
export default BlogsRouter;