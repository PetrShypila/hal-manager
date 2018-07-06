import {IScript} from "alfred-protocols";

export const script: IScript = {
  defaultLang: "english",
  scripts: [
    {
      name: "personalData",
      params: [
        {
          name: "PersonalNameIntent",
        },
        {
          name: "PeselNumberIntent",
        },
        {
          name: "AgeIntent",
        },
      ],
    },
  ],
};


