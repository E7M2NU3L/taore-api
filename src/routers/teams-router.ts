import express from 'express';
import type { Router} from 'express';

// Teams Router
const TeamsRouter : Router = express.Router();

// routes
TeamsRouter.get("/fetch-teams");
TeamsRouter.get("/single/:id");
TeamsRouter.post("/create-team");
TeamsRouter.delete("/delete-team/:id");
TeamsRouter.put("/update-teams/:id");
TeamsRouter.put("/add-member/:id");
TeamsRouter.put("/remove-member/:id");

// exporting the modules
export default TeamsRouter;