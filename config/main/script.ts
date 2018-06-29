import {IScript} from "../../src/main/common/models";

export const script: IScript = {
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


