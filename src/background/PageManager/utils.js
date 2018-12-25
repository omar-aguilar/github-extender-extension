const getGithubUrlMeta = (url) => {
  const [, owner, repo, page, ...section] = url.split('/');
  return {
    owner,
    repo,
    page,
    section,
  };
};

export {
  getGithubUrlMeta, // eslint-disable-line import/prefer-default-export
};
