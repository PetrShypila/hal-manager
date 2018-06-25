import {IScript} from "../src/common/models";

export const script: IScript = {
  defaultLang: "english",
  scripts: [
    {
      id: "personalData",
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


