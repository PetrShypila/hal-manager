import {IUserReply, IUserRequest} from "alfred-protocols";
import * as express from "express";
import {Request, Response} from "express";
import {script} from "../../config/main/script";
import {SessionManager} from "./session/SessionManager";

const app: express.Express = express();
const sessionManager = new SessionManager(script);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.post("/session", (req: Request, res: Response) => {
  const userReply: IUserReply = sessionManager.startSession();
  res.send(userReply).status(201);
});

app.listen(3000, () => {
  /* tslint:disable:no-console */
  console.log("Example app listening on port 3000!");
});
