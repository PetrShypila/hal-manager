import {IScript} from "hal-protocols";

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
    {
      name: "CallBackScript",
      params: [
        {
          name: "PersonalNameIntent",
        },
        {
          name: "PhoneNumberIntent",
        },
      ],
    },
  ],
};


