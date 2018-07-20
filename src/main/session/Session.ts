import {
  IApiManagerOutput,
  IApiNluOutput,
  IScript,
  Languages,
} from "alfred-protocols";
import {Dialog, IDialog} from "../dialog/Dialog";
import {DialogScriptParamState} from "../dialog/DialogParamState";
import logger from "../log/logger";

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

    logger.debug("Creating new session", this);
  }

  public request = (request: IApiNluOutput): IApiManagerOutput => {
    const activeDialog = this.getActiveDialog(request);
    logger.debug("Received current active dialog.", activeDialog);
    const managerOutput = activeDialog.updateState(request);

    if (managerOutput.expect === DialogScriptParamState.close.name) {
      logger.debug("Dialog finished. Removing from session");
      this.state.dialogs[this.state.activeDialogName] = undefined;
      this.state.activeDialogName = undefined;
    }

    return managerOutput;
  };

  private getActiveDialog = (request: IApiNluOutput): IDialog => {
    const {activeDialogName, dialogs} = this.state;
    if (activeDialogName === undefined) {
      logger.debug("Active dialog doesn't exist in the session.");
      const newDialogScript = this.script.scripts.find(
        (dialogScript) => dialogScript.name === request.intents.shift().name,
      );

      dialogs[newDialogScript.name]
        = new Dialog(newDialogScript.name, newDialogScript.params);
      logger.debug(`Dialog "${newDialogScript.name}" created.`, newDialogScript);
      this.state.activeDialogName = newDialogScript.name;
    }

    return dialogs[this.state.activeDialogName];
  }

}
