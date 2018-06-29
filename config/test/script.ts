import {IScript} from "../../src/main/common/models";

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
