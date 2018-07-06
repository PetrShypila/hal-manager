import {IUserReply, IUserRequest} from "alfred-protocols";
import {describe, it} from "mocha";
import {SessionManager} from "../../main/session/SessionManager";

import * as assert from "assert";
import script from "../../../config/test/script";

describe("Session flow validation", () => {
  const sessionManager: SessionManager = new SessionManager(script);

  it("should save script properly", () => {
    assert.deepStrictEqual(script, sessionManager.script);
  });

  it("should start a new session with proper setup.", () => {
    const userReply: IUserReply = sessionManager.startSession();

    assert(userReply.sessionId, "sessionId should be presented in reply");
    assert.deepStrictEqual(script.defaultLang, userReply.language);
    assert.deepStrictEqual(userReply.expected, "sessionStarted");
    assert.deepStrictEqual(userReply.expectationCount, 1);

    const mockRequestBody: IUserRequest = {
      language: userReply.language,
      parameters: [{name: script.scripts[0].name, value: ""}],
      sessionId: userReply.sessionId,
    };

    const forTest = Object.assign({}, script.scripts[0].params[0]);
    const reply: IUserReply = sessionManager.request(mockRequestBody);

    assert.deepStrictEqual(reply.expected, forTest.name);
    assert.deepStrictEqual(reply.expectationCount, 1);
  });
});
