import {
  IApiManagerOutput,
  IApiNluOutput,
} from "alfred-protocols";
import * as bodyParser from "body-parser";
import * as express from "express";
import {Request, Response} from "express";
import {script} from "../../config/main/script";
import {SessionManager} from "./session/SessionManager";

const port = process.env.NODE_PORT || 8082;
const app: express.Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sessionManager = new SessionManager(script);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.post("/session", (req: Request, res: Response) => {
  const userReply: IApiManagerOutput = sessionManager.startSession();
  res.send(userReply).status(201);
});

app.delete("/session", (req: Request, res: Response) => {
  const userRequest: IApiNluOutput = req.body;
  sessionManager.closeSession(userRequest.sessionId);
  res.status(204);
});

app.put("/request", (req: Request, res: Response) => {
  const userRequest: IApiNluOutput = req.body;
  const userReply: IApiManagerOutput = sessionManager.request(userRequest);
  res.send(userReply).status(200);
});

app.listen(port, () => {
  /* tslint:disable:no-console */
  console.log(`Example app listening on port ${port}!`);
});
