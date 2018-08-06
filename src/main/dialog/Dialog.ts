import {
  IApiManagerOutput,
  IApiNluOutput,
  IDialogScriptParam,
  IDialogScriptParamState,
} from "hal-protocols";

import logger from "../log/logger";
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
    logger.debug(`Dialog: Creating new Dialog:`, this);
  }

  public updateState: (request: IApiNluOutput) => IApiManagerOutput = (request) => {
    logger.debug("Dialog: Request before preprocessing:", request);
    request = this.preprocess(request);
    logger.debug("Dialog: Request after preprocessing:", request);

    const reply: IApiManagerOutput = {
      expect: undefined,
      expectationCount: undefined,
      language: request.language,
      received: [],
      sessionId: request.sessionId,
    };

    request.intents.forEach((param) => {
      logger.debug(`Processing intent "${param.name} with value "${JSON.stringify(param.value)}"`);
      // Update expected param
      if (this.state.expected.name === param.name) {
        logger.debug("Intent was expected.");
        this.state.expected.value.push(...param.value);
        reply.received.push(this.state.expected);
        this.state.received.push(this.state.expected);
        this.state.expected = undefined;
        return;
      }

      // Check already received params for an update
      const updatedParam = this.state.received.some((receivedParam) => {
        const match = receivedParam.name === param.name;
        // If param has been updated
        if (match) {
          logger.debug(`Received updated param "${receivedParam.name}"\n`
            + `Old param value: ${JSON.stringify(receivedParam.value)}\n`
            + `New param value: ${JSON.stringify(param.value)}`,
          );

          receivedParam.value.push(...param.value);
          reply.received.push(receivedParam);
        }

        return match;
      });

      if (updatedParam) {
        logger.debug("Param updated. Exiting.");
        return;
      }

      this.state.waiting = this.state.waiting.filter((waitingParam) => {
        if (waitingParam.name === param.name) {
          logger.debug(`Received "${param.name}" param from "waiting" list`);
          waitingParam.value.push(...waitingParam.value);
          reply.received.push(waitingParam);
          return false;
        }
        return true;
      });
    });

    if (this.state.waiting.length === 0) {
      logger.debug("No params left to receive from user. Closing dialog.");
      reply.expect = DialogScriptParamState.close.name;
      reply.expectationCount = DialogScriptParamState.close.requestCount;
    } else {
      if (this.state.expected === undefined) {
        this.state.expected = this.state.waiting.shift();
        logger.debug(`New expected param: ${this.state.expected}`);
      }
      this.state.expected.requestCount += 1;
      reply.expect = this.state.expected.name;
      reply.expectationCount = this.state.expected.requestCount;
    }

    return reply;
  };

  private preprocess: (request: IApiNluOutput) => IApiNluOutput = (request) => {
    logger.debug(`Preprocessing. Expecting: ${this.state.expected.name}`);

    switch (this.state.expected.name) {
      case "PeselNumberIntent": {
        const intentIdx =
          request.intents.findIndex((intent) => intent.name === "NumberIntent");
        if (intentIdx >= 0) {
          logger.debug("Found NumberIntent. Converting it to PeselNumberIntent");
          request.intents[intentIdx].name = "PeselNumberIntent";
        }
        break;
      }

      case "AgeIntent": {
        const intentIdx =
          request.intents.findIndex((intent) => intent.name === "NumberIntent");
        if (intentIdx >= 0) {
          logger.debug("Found NumberIntent. Converting it to AgeIntent");
          request.intents[intentIdx].name = "AgeIntent";
        }
        break;
      }
    }

    return request;
  };
}
