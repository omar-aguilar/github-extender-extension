import Joi from 'joi-browser';

const repoConfig = () => {
  const RepoConfig = Joi.object().keys({
    repo: Joi.string().required(),
    titleRegEx: Joi.string(),
    blockPRs: Joi.object().keys({
      block: Joi.boolean(),
      skipLabels: Joi.array().items(Joi.string()),
    }),
  });
  return Joi.array().items(RepoConfig).min(1);
};


const isValidJSON = (value) => {
  const schema = repoConfig();
  const { error } = Joi.validate(value, schema);
  if (error) {
    return {
      valid: false,
      error,
    };
  }
  return {
    valid: true,
  };
};

export {
  isValidJSON, // eslint-disable-line import/prefer-default-export
};
