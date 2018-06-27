import {IDialogScriptParam, IDialogScriptParamState} from "../common/models";

export class DialogScriptParamState implements IDialogScriptParamState {

  public static launch: IDialogScriptParamState = {
    name: "launch",
    requestCount: 1,
  };

  public static close: IDialogScriptParamState = {
    name: "close",
    requestCount: 1,
  };

  public name: string;
  public requestCount: number;

  constructor(dialogScriptParam: IDialogScriptParam) {
    this.name = dialogScriptParam.name;
    this.requestCount = 0;
}
  }
