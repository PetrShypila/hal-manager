import {IDialogScriptParam, IUserReply, IUserRequest} from "./common/models";

interface IDialogState {
  expected: IDialogScriptParam;
  received: IDialogScriptParam[];
  waiting: IDialogScriptParam[];
}

export interface IDialog {
  name: string;
  state: IDialogState;
  updateState: (IUserRequest) => IUserReply;
}

export class Dialog implements IDialog {
  public name: string;
  public state: IDialogState;

  constructor(name: string, params: IDialogScriptParam[]) {
    this.name = name;
    this.state = {
      expected: { name: "launch" },
      received: [],
      waiting: params,
    };
  }

  public updateState = (request: IUserRequest): IUserReply => {
    const reply: IUserReply = {
      expectationCount: 1,
      expected: this.state.expected.name,
      language: request.language,
      received: [],
      sessionId: request.sessionId,
    };

    request.parameters.forEach((param) => {
      if (this.state.expected.name === param.name) {
        reply.received.push(param);
        this.state.received.push(this.state.expected);
        this.state.expected = this.state.waiting.shift();
      }

      this.state.received.some((receivedParam) => {
        const match = receivedParam.name === param.name;

        if (match) {
          reply.received.push(param);
        }

        return match;
      });

      this.state.waiting = this.state.waiting.filter((waitingParam) => {
        if (waitingParam.name === param.name) {
          reply.received.push(param);
          return false;
        }
        return true;
      });
    });

    return reply;
  };
}
