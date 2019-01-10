import PageManagerHandlerInterface from '../../PageManagerHandlerInterface';
import { getGithubUrlMeta } from '../../utils';

class GetPRStatus extends PageManagerHandlerInterface {
  constructor(config) {
    super();
    const globalConfig = config.globalConfig || {};
    this.token = globalConfig.githubToken;
  }

  _getData(repo, owner, path) {
    const basePath = 'https://api.github.com/repos/';
    const url = `${basePath}${repo}/${owner}/${path.join('/')}`;
    return fetch(url, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    })
      .then(response => response.json())
      .catch((error) => {
        console.log('error getting url', url, error);
        Promise.resolve(null);
      });
  }

  _getOpenPRsInfo(owner, repo) {
    return this._getData(owner, repo, ['pulls'])
      .then((prs) => {
        // prs = prs.slice(0, 1);
        const promises = prs.map((pr) => {
          // get meta for each pr
          const { number } = pr;
          const paths = [
            ['pulls', number, 'comments'],
            ['pulls', number, 'commits'],
            ['pulls', number, 'reviews'],
            ['issues', number, 'comments'],
          ];
          const metaPromises = paths.map(path => this._getData(owner, repo, path));
          return Promise.all([pr, ...metaPromises]);
        });
        return Promise.all(promises);
      })
      .then(prsMeta => prsMeta.map((meta) => {
        // resolve meta as an object
        const [info, comments, commits, reviews, issueComments] = meta;
        return {
          info,
          comments,
          commits,
          reviews,
          issueComments,
        };
      }));
  }

  _processPRInfo(prList) {
    return prList.map((pr) => {
      const {
        info: prInfo,
        comments: prComments,
        commits: prCommits,
        reviews: prReviews,
        issueComments: prIssueComments,
      } = pr || {};
      const user = prInfo.user.login;
      const date = prInfo.created_at;

      const [lastCommit] = prCommits.slice(-1)
        .map(commit => ({
          user: commit.committer.login,
          date: commit.commit.committer.date,
        }));
      const { date: lastCommitDate } = lastCommit;

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
  }

  _getPRTeamBlockStatus(skipLabels, prMeta) {
    return prMeta.map((pr, idx) => {
      const { user, number } = pr;
      const hasSkipLabel = pr.labels.some(label => skipLabels.includes(label));
      const isBlocked = hasSkipLabel
        ? false
        : ( // the user in the pr needs to review older PRs before unblock others
          prMeta.slice(idx + 1)
            .filter(filterPr => filterPr.user !== user)
            .map((filterPr) => {
              const { comments, reviews, issueComments } = filterPr;
              const hasComments = comments.some(comment => comment.user === user);
              const hasReviews = reviews.some(review => review.user === user);
              const hasIssueComments = issueComments.some(comment => comment.user === user);
              return (!hasComments && !hasReviews && !hasIssueComments);
            })
            .some(blocked => blocked)
        );
      return {
        user,
        number,
        isBlocked,
      };
    });
  }

  _getPRUserBlockStatus(skipLabels, prMeta) {
    const perPRReview = {};
    prMeta.forEach((pr) => {
      const {
        number,
        comments,
        reviews,
        issueComments,
      } = pr;
      if (!perPRReview[number]) {
        perPRReview[number] = {
          owner: pr.user,
          reviewers: new Set(),
        };
        const { reviewers } = perPRReview[number];
        comments.forEach(({ user }) => reviewers.add(user));
        issueComments.forEach(({ user }) => reviewers.add(user));
        reviews.forEach(({ user }) => reviewers.add(user));
      }
    });

    const shouldReview = {};
    return prMeta.reduceRight((result, pr, idx) => {
      const hasSkipLabel = pr.labels.some(label => skipLabels.includes(label));
      const isBlocked = hasSkipLabel
        ? false
        : (
          prMeta.slice(idx + 1)
            .filter(filterPr => filterPr.user !== pr.user)
            .map((prData) => {
              const { reviewers } = perPRReview[prData.number];
              if (shouldReview[prData.number] === false) {
                return true; // if doesn't need review assume is reviewed
              }
              return Boolean(shouldReview[prData.number]) && reviewers.has(pr.user);
            })
            .some(reviewed => !reviewed)
        );

      shouldReview[pr.number] = !isBlocked;
      const blockData = {
        user: pr.user,
        number: pr.number,
        isBlocked,
      };
      return [...result, blockData];
    }, []);
  }

  /**
   * @override
   */
  onKeyUpdated(config) {
    const globalConfig = config.globalConfig || {};
    this.token = globalConfig.githubToken;
  }

  /**
   * @override
   */
  onPageUpdate(send, tab, urlMeta, config) {
    const { blockPRs = {} } = config;
    if (!blockPRs.block) {
      return;
    }
    const url = new URL(tab.url);
    if (url.search && !url.search.includes('open')) {
      return;
    }

    const { owner, repo } = getGithubUrlMeta(url.pathname);
    this._getOpenPRsInfo(owner, repo)
      .then(this._processPRInfo)
      .then((prMeta) => {
        const { skipLabels = [] } = blockPRs;
        if (blockPRs.useUserLevelBlock) {
          return this._getPRUserBlockStatus(skipLabels, prMeta);
        }
        return this._getPRTeamBlockStatus(skipLabels, prMeta);
      })
      .then((prStatus) => {
        const message = {
          [urlMeta.page]: {
            prStatus,
          },
        };
        send(message);
      });
  }
}

export default GetPRStatus;
