import {IInputParam, IScript, IUserReply, IUserRequest, Languages} from "alfred-protocols/index";
import {Dialog, IDialog} from "../dialog/Dialog";

interface ISession {
  readonly script: IScript;
  readonly defaultLang: Languages;
  state: ISessionState;
  request: (UserRequestType) => IUserReply;
}

interface ISessionState {
  activeDialogName?: string;
  postponedDialogs: string[];
  activeLang: Languages;
  vals: { [s: string]: any };
  dialogs: { [s: string]: IDialog };
}

export class Session implements ISession {
  public script: IScript;
  public defaultLang: Languages;
  public state: ISessionState;

  constructor(script: IScript) {
    this.script = script;
    this.defaultLang = script.defaultLang;
    this.state = {
      activeLang: this.defaultLang,
      dialogs: {},
      postponedDialogs: [],
      vals: {},
    };
  }

  public request = (userRequest: IUserRequest): IUserReply => {
    const activeDialog = this.getActiveDialog(userRequest);
    return activeDialog.updateState(userRequest);
  };

  private getActiveDialog = (userRequest: IUserRequest): IDialog => {
    const {activeDialogName, dialogs} = this.state;

    if (activeDialogName === undefined) {
      const newDialogScript
        = this.script.scripts.find((dialogScript) => dialogScript.name === userRequest.parameters.shift().name);

      dialogs[newDialogScript.name]
        = new Dialog(newDialogScript.name, newDialogScript.params);

      this.state.activeDialogName = newDialogScript.name;
    }

    return dialogs[this.state.activeDialogName];
  }

}
