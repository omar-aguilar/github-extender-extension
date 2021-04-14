import Joi from 'joi-browser';

const repoConfig = () => {
  const Addons = Joi.object().keys({
    name: Joi.string().required(),
    config: Joi.object(),
    requiresGlobalConfig: Joi.bool(),
    events: Joi.array(),
    enabled: Joi.bool(),
  });

  const RepoConfig = Joi.object().keys({
    repo: Joi.string().required(),
    addons: Joi.array().items(Addons),
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
