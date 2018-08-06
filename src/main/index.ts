import {
  IApiManagerOutput,
  IApiNluOutput,
} from "hal-protocols";
import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";

import { script } from "../../config/main/script";
import logger from "./log/logger";
import { SessionManager } from "./session/SessionManager";

const port = process.env.NODE_PORT || 8082;
const app: express.Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sessionManager = new SessionManager(script);

app.get("/", (req: Request, res: Response) => {
  logger.info(`***\n***\n***`);
  logger.info(`GET#/`);
  res.sendStatus(200);
});

app.post("/session", (req: Request, res: Response) => {
  logger.info(`***\n***\n***`);
  logger.info(`POST#/session`);
  const userReply: IApiManagerOutput = sessionManager.startSession();
  logger.debug("/session: Started session", userReply);
  res.send(userReply).status(201);
});

app.delete("/session", (req: Request, res: Response) => {
  logger.info(`***\n***\n***`);
  logger.info(`DELETE#/session`);
  const userRequest: IApiNluOutput = req.body;
  logger.debug("/session: Request body", userRequest);
  sessionManager.closeSession(userRequest.sessionId);
  logger.debug("/session: Session closed");
  res.status(204);
});

app.put("/request", (req: Request, res: Response) => {
  logger.info(`***\n***\n***`);
  logger.info(`PUT#/request`);
  const userRequest: IApiNluOutput = req.body;
  logger.debug("/request: Request body", userRequest);
  const userReply: IApiManagerOutput = sessionManager.request(userRequest);
  logger.debug("/request: Reply body", userReply);
  res.send(userReply).status(200);
});

app.listen(port, () => {
  logger.info(`Manager app listening on port ${port}!`);
});
