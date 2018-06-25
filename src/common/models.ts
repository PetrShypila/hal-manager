export type Languages = "english" | "german";

export interface IScript {
  defaultLang: Languages;
  scripts: IDialogScript[];
}

export interface IUserRequest {
  sessionId: string;
  language: Languages;
  parameters: IInputParam[];
}

export interface IUserReply {
  language: Languages;
  sessionId: string;
  expected: string;
  expectationCount: number;
  received: IInputParam[];
}

export interface IInputParam {
  name: string;
  value: string;
}

interface IDialogScript {
  id: string;
  params: IDialogScriptParam[];
}

export interface IDialogScriptParam {
  name: string;
}
