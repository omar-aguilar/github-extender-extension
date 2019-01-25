const _getData = (repo, owner, path, token) => {
  const basePath = 'https://api.github.com/repos/';
  const url = `${basePath}${repo}/${owner}/${path.join('/')}`;
  return fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then(response => response.json())
    .catch((error) => {
      console.log('error in get request, url', url, error);
      Promise.resolve(null);
    });
};

const getOpenPRsInfo = (owner, repo, token) => _getData(owner, repo, ['pulls'], token)
  .then(prs => Promise.all(
    prs.map((pr) => {
      // get last commit for each pr
      const { head: { sha } } = pr;
      return Promise.all([pr, _getData(owner, repo, ['commits', sha], token)]);
    }),
  ))
  .then(prs => Promise.all(
    prs.map(([pr, lastCommit]) => {
      // get comments and reviews for each pr
      const { number } = pr;
      const paths = [
        ['pulls', number, 'comments'],
        ['pulls', number, 'reviews'],
        ['issues', number, 'comments'],
      ];
      const metaPromises = paths.map(path => _getData(owner, repo, path, token));
      return Promise.all([pr, lastCommit, ...metaPromises]);
    }),
  ))
  .then(prsMeta => prsMeta.map((meta) => {
    // resolve meta as an object
    const [info, lastCommit, comments, reviews, issueComments] = meta;
    return {
      info,
      lastCommit,
      comments,
      reviews,
      issueComments,
    };
  }));

const extractPRSummary = prList => prList.map((pr) => {
  const {
    info: prInfo,
    lastCommit,
    comments: prComments,
    reviews: prReviews,
    issueComments: prIssueComments,
  } = pr || {};
  const user = prInfo.user.login;
  const date = prInfo.created_at;
  const lastCommitDate = lastCommit.commit.committer.date;

  const comments = prComments.map(comment => ({
    user: comment.user.login,
    date: comment.created_at,
  }))
    .filter(comment => comment.user !== user && comment.date >= lastCommitDate);

  const reviews = prReviews.map(review => ({
    user: review.user.login,
    date: review.submitted_at,
  }))
    .filter(review => review.user !== user && review.date >= lastCommitDate);

  const issueComments = prIssueComments.map(comment => ({
    user: comment.user.login,
    date: comment.created_at,
  }))
    .filter(comment => comment.user !== user && comment.date >= lastCommitDate);

  const labels = prInfo.labels.map(labelInfo => labelInfo.name);

  return {
    date,
    number: prInfo.number,
    user,
    lastCommit,
    comments,
    reviews,
    issueComments,
    labels,
  };
});

const getReviewsPerPr = (prMeta, reviewPassedLabels) => {
  const perPRReview = {};
  prMeta.forEach((pr) => {
    const {
      number,
      comments,
      reviews,
      issueComments,
      labels,
    } = pr;
    if (!perPRReview[number]) {
      perPRReview[number] = {
        owner: pr.user,
        reviewers: new Set(),
        reviewPassed: labels.some(label => reviewPassedLabels.includes(label)),
      };
      const { reviewers } = perPRReview[number];
      comments.forEach(({ user }) => reviewers.add(user));
      issueComments.forEach(({ user }) => reviewers.add(user));
      reviews.forEach(({ user }) => reviewers.add(user));
    }
  });
  return perPRReview;
};

export {
  extractPRSummary,
  getOpenPRsInfo,
  getReviewsPerPr,
};
