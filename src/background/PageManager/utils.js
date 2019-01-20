const getGithubUrlMeta = (url) => {
  const [, owner, repo, page, ...section] = url.split('/');
  return {
    owner,
    repo,
    page,
    section,
  };
};


const getConfigFor = (repoConfig, owner, repo) => {
  const ownerConfig = repoConfig.find(({ owner: repoOwner }) => repoOwner === owner) || {};
  const textConfig = ownerConfig.config;
  try {
    const parsedConfig = JSON.parse(textConfig);
    const config = parsedConfig.find(repoConfigJson => repoConfigJson.repo === repo);
    return config || {};
  } catch (error) {
    return {};
  }
};

export {
  getGithubUrlMeta,
  getConfigFor,
};
