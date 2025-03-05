import express from 'express';
import type { Router} from 'express';

// Overview Router
const OverviewRouter : Router = express.Router();

// routes
OverviewRouter.get("/");
OverviewRouter.get("/:id");

// exporting the modules
export default OverviewRouter;