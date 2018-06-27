import {Dialog, IDialog} from "./dialog/Dialog";
import {IInputParam, IScript, IUserReply, IUserRequest, Languages} from "./common/models";

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
    const activeDialog = this.state.dialogs[this.state.activeDialogName];
    return activeDialog.updateState(userRequest);
  };

  private getActiveDialog = (inputParam: IInputParam): IDialog => {
    const {activeDialogName, dialogs} = this.state;

    if (activeDialogName) {
      return dialogs[activeDialogName];
    } else {
      const newDialogScript = this.script.scripts.find((dialogScript) => dialogScript.id === inputParam.name);

      this.state.activeDialogName = newDialogScript.id;
      return new Dialog(newDialogScript.id, newDialogScript.params);
    }
  }

}
