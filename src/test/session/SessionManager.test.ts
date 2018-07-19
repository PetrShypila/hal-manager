import {IApiManagerOutput, IApiNluOutput} from "alfred-protocols";
import {describe, it} from "mocha";
import {SessionManager} from "../../main/session/SessionManager";

import * as assert from "assert";
import script from "../../../config/test/script";

describe("Session flow validation", () => {
  const sessionManager: SessionManager = new SessionManager(script);

  it("should start a new session with proper setup.", () => {
    const userReply: IApiManagerOutput = sessionManager.startSession();

    assert(userReply.sessionId, "sessionId should be presented in reply");
    assert.deepStrictEqual(script.defaultLang, userReply.language);
    assert.deepStrictEqual(userReply.expect, "sessionStarted");
    assert.deepStrictEqual(userReply.expectationCount, 1);

    const mockRequestBody: IApiNluOutput = {
      intents: [{name: script.scripts[0].name, value: [""]}],
      language: userReply.language,
      sessionId: userReply.sessionId,
    };

    const forTest = Object.assign({}, script.scripts[0].params[0]);
    const reply: IApiManagerOutput = sessionManager.request(mockRequestBody);

    assert.deepStrictEqual(reply.expect, forTest.name);
    assert.deepStrictEqual(reply.expectationCount, 1);
  });
});
