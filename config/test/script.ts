import {IScript} from "hal-protocols";

const script: IScript = {
  defaultLang: "english",
  scripts: [
    {
      name: "personalData",
      params: [
        {
          name: "personalName",
        },
        {
          name: "peselNumber",
        },
        {
          name: "age",
        },
      ],
    },
  ],
};

export default script;
