const errors = {};

errors.noConfig = () => {
  const e = new Error(`You haven't provided a configuration object, the calendar must at the very 
  least receive an object with the target element to attach the calendar to {parentDiv: '.someQuerySelector'}`);
  throw e;
};

errors.noLanguage = (language, languages) => {
  const e = new Error(`Currently the app doesn't have the language ${language}. Options available are ${languages}.
  If you want to add a language see languages.js add your language and submit a pull request.`);
  throw e;
};

export {
  errors
};
