import {
  IDialogScriptParam,
  IDialogScriptParamState,
} from "alfred-protocols";

export class DialogScriptParamState implements IDialogScriptParamState {

  public static close: IDialogScriptParamState = {
    name: "close",
    requestCount: 1,
    value: [],
  };

  public name: string;
  public requestCount: number;
  public value: string[];

  constructor(dialogScriptParam: IDialogScriptParam) {
    this.name = dialogScriptParam.name;
    this.requestCount = 0;
    this.value = [];
  }
}
