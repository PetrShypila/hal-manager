import {
  IApiManagerOutput,
  IApiNluOutput,
  IScript,
} from "alfred-protocols";
import {v4 as uuid} from "uuid";
import {Session} from "./Session";

interface ISessionManager {
  closeSession: (sessionId: string) => void;
  request: (userRequest: IApiNluOutput) => IApiManagerOutput;
  startSession: () => IApiManagerOutput;
}

interface ISessionStore {
  [s: string]: Session;
}

export class SessionManager implements ISessionManager {
  private readonly sessions: ISessionStore;
  private readonly script: IScript;

  constructor(script: IScript) {
    this.sessions = {};
    this.script = script;
  }

  public startSession = (): IApiManagerOutput => {
    const sessionId: string = uuid();
    this.sessions[sessionId] = new Session(this.script);
    return this.sessionStarted(sessionId);
  };

  public closeSession = (sessionId: string) => {
    this.sessions[sessionId] = undefined;
  };

  public request = (request: IApiNluOutput): IApiManagerOutput => {
    if (request.sessionId) {
      const session = this.sessions[request.sessionId];
      return session.request(request);
    } else {
      return this.startSession();
    }
  };

  private sessionStarted: (s: string) => IApiManagerOutput = (sessionId) => ({
    expectationCount: 1,
    expected: "sessionStarted",
    language: this.script.defaultLang,
    received: [],
    sessionId,
  });
}
