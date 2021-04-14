const Octokit = require('@octokit/rest');

const token = '941fc7c49bfe158883651c23aca45d75c492ded6';
const owner = 'foxbroadcasting';
const repo = 'fng-cms';

const octokit = new Octokit({
  auth: token,
});

octokit.pulls.list({ owner, repo, page: 2 })
  .then((prs) => {
    const { data, ...rest } = prs;
    console.log(rest);
    console.log(data.length);
  });

octokit.pulls.listComments({ owner, repo, pull_number: 1041 })
  .then((comments) => {
    console.log('comments', Object.keys(comments));
  });

octokit.pulls.listReviews({ owner, repo, pull_number: 1041 })
  .then((reviews) => {
    console.log('reviews', Object.keys(reviews));
  });

octokit.issues.listComments({ owner, repo, issue_number: 1041 })
  .then((issueComments) => {
    console.log('issueComments', Object.keys(issueComments));
  });
