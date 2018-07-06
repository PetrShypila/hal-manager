import {IScript, IUserReply, IUserRequest} from "alfred-protocols";
import {v4 as uuid} from "uuid";
import {Session} from "./Session";

interface ISessionManager {
  script: IScript;
  sessions: ISessionStore;
}

interface ISessionStore {
  [s: string]: Session;
}

export class SessionManager implements ISessionManager {
  public sessions: ISessionStore;
  public script: IScript;

  constructor(script: IScript) {
    this.sessions = {};
    this.script = script;
  }

  public startSession = (): IUserReply => {
    const sessionId: string = uuid();
    this.sessions[sessionId] = new Session(this.script);
    return this.sessionStarted(sessionId);
  };

  public closeSession = (sessionId: string) => {
    this.sessions[sessionId] = undefined;
  };

  public request = (userRequest: IUserRequest): IUserReply => {
    if (userRequest.sessionId) {
      const session = this.sessions[userRequest.sessionId];
      return session.request(userRequest);
    } else {
      return this.startSession();
    }
  };

  private sessionStarted: (s: string) => IUserReply = (sessionId) => ({
    expectationCount: 1,
    expected: "sessionStarted",
    language: this.script.defaultLang,
    received: [],
    sessionId,
  });
}
