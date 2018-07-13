import {
  IApiManagerOutput,
  IApiNluOutput,
  IScript,
  Languages,
} from "alfred-protocols";
import {Dialog, IDialog} from "../dialog/Dialog";

interface ISession {
  readonly script: IScript;
  readonly defaultLang: Languages;
  state: ISessionState;
  request: (request: IApiNluOutput) => IApiManagerOutput;
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

  public request = (request: IApiNluOutput): IApiManagerOutput => {
    const activeDialog = this.getActiveDialog(request);
    return activeDialog.updateState(request);
  };

  private getActiveDialog = (request: IApiNluOutput): IDialog => {
    const {activeDialogName, dialogs} = this.state;

    if (activeDialogName === undefined) {
      const newDialogScript = this.script.scripts.find(
        (dialogScript) => dialogScript.name === request.intents.shift().name,
      );

      dialogs[newDialogScript.name]
        = new Dialog(newDialogScript.name, newDialogScript.params);

      this.state.activeDialogName = newDialogScript.name;
    }

    return dialogs[this.state.activeDialogName];
  }

}
