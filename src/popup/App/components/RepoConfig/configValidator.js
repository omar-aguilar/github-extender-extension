import Joi from 'joi-browser';

const repoConfig = () => {
  const RepoConfig = Joi.object().keys({
    repo: Joi.string().required(),
    titleRegEx: Joi.string(),
  });
  return Joi.array().items(RepoConfig).min(1);
};

// eslint-disable-next-line import/prefer-default-export
export const isValidJSON = (value) => {
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
