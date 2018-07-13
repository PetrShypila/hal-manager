import {IScript} from "alfred-protocols";

export const script: IScript = {
  defaultLang: "english",
  scripts: [
    {
      name: "PersonalDataScript",
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


