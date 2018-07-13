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
    this.state.expected.requestCount++;

    const reply: IApiManagerOutput = {
      expectationCount: this.state.expected.requestCount,
      expected: this.state.expected.name,
      language: request.language,
      received: [],
      sessionId: request.sessionId,
    };

    request.intents.forEach((param) => {
      if (this.state.expected.name === param.name) {
        reply.received.push(this.state.expected);
        this.state.received.push(this.state.expected);
        this.state.expected = this.state.waiting.shift();
      }

      this.state.received.some((receivedParam) => {
        const match = receivedParam.name === param.name;

        if (match) {
          reply.received.push(receivedParam);
        }

        return match;
      });

      this.state.waiting = this.state.waiting.filter((waitingParam) => {
        if (waitingParam.name === param.name) {
          reply.received.push(waitingParam);
          return false;
        }
        return true;
      });

      if (this.state.waiting.length === 0) {
        reply.received.push(DialogScriptParamState.close);
      }
    });

    return reply;
  }
}
