import {
  IApiManagerOutput,
  IApiNluOutput,
  IDialogScriptParam,
  IDialogScriptParamState,
} from "alfred-protocols";

import { DialogScriptParamState } from "./DialogParamState";

interface IDialogState {
  expected: IDialogScriptParamState;
  received: IDialogScriptParamState[];
  waiting: IDialogScriptParamState[];
}

export interface IDialog {
  name: string;
  state: IDialogState;
  updateState: (request: IApiNluOutput) => IApiManagerOutput;
}

export class Dialog implements IDialog {

  public name: string;
  public state: IDialogState;

  constructor(name: string, params: IDialogScriptParam[]) {
    this.name = name;
    this.state = {
      expected: new DialogScriptParamState(params.shift()),
      received: [],
      waiting: params.map((param) => new DialogScriptParamState(param)),
    };
  }

  public updateState: (request: IApiNluOutput) => IApiManagerOutput = (request) => {
    request = this.preprocess(request);

    const reply: IApiManagerOutput = {
      expect: undefined,
      expectationCount: undefined,
      language: request.language,
      received: [],
      sessionId: request.sessionId,
    };

    request.intents.forEach((param) => {
      // Update expected param
      if (this.state.expected.name === param.name) {
        this.state.expected.value.push(...param.value);
        reply.received.push(this.state.expected);
        this.state.received.push(this.state.expected);
        this.state.expected = undefined;
        return;
      }

      // Check already received params for an update
      this.state.received.some((receivedParam) => {
        const match = receivedParam.name === param.name;
        // If param has been updated
        if (match) {
          receivedParam.value.push(...param.value);
          reply.received.push(receivedParam);
        }

        return match;
      });

      this.state.waiting = this.state.waiting.filter((waitingParam) => {
        if (waitingParam.name === param.name) {
          waitingParam.value.push(...waitingParam.value);
          reply.received.push(waitingParam);
          return false;
        }
        return true;
      });
    });

    if (this.state.waiting.length === 0) {
      reply.expect = DialogScriptParamState.close.name;
      reply.expectationCount = DialogScriptParamState.close.requestCount;
    } else {
      if (this.state.expected === undefined) {
        this.state.expected = this.state.waiting.shift();
      }
      this.state.expected.requestCount += 1;
      reply.expect = this.state.expected.name;
      reply.expectationCount = this.state.expected.requestCount;
    }

    return reply;
  };

  private preprocess: (request: IApiNluOutput) => IApiNluOutput = (request) => {
    console.log(`Preprocessing. Expecting: ${this.state.expected.name}`);

    switch (this.state.expected.name) {
      case "PeselNumberIntent": {
        const intentIdx =
          request.intents.findIndex((intent) => intent.name === "NumberIntent");
        if (intentIdx >= 0) {
          console.log("Found NumberIntent. Converting it to PeselNumberIntent");
          request.intents[intentIdx].name = "PeselNumberIntent";
        }
        break;
      }

      case "AgeIntent": {
        const intentIdx =
          request.intents.findIndex((intent) => intent.name === "NumberIntent");
        if (intentIdx >= 0) {
          console.log("Found NumberIntent. Converting it to AgeIntent");
          request.intents[intentIdx].name = "AgeIntent";
        }
        break;
      }
    }

    return request;
  };
}
