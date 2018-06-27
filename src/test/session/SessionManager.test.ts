import {describe, it} from "mocha";
import {script} from "../../../config/test/script";
import {SessionManager} from "../../main/session/SessionManager";

const assert = require("assert");

describe("Script valid building", () => {
  const sessionManager: SessionManager = new SessionManager(script);

  it("should read script properly", () => {
    assert.strictEqual(script, sessionManager.script);
  });

  const reply = sessionManager.startSession();
});
