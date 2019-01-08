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

      return {
        date,
        number: prInfo.number,
        user,
        lastCommit,
        comments,
        reviews,
        issueComments,
      };
    });
  }

  _getPRBlockStatus(prList) {
    return prList.map((pr, idx) => {
      const { user, number } = pr;
      const isBlocked = prList.slice(idx + 1)
        .filter(filterPr => filterPr.user !== user)
        .map((filterPr) => {
          const { comments, reviews, issueComments } = filterPr;
          const hasComments = comments.some(comment => comment.user === user);
          const hasReviews = reviews.some(review => review.user === user);
          const hasIssueComments = issueComments.some(comment => comment.user === user);
          return {
            number: filterPr.number,
            blocks: (!hasComments && !hasReviews && !hasIssueComments),
          };
        })
        .some(filterPr => filterPr.blocks);

      return {
        user,
        number,
        isBlocked,
      };
    });
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
    if (!config.blockPRs) {
      return;
    }
    const url = new URL(tab.url);
    if (url.search && !url.search.includes('open')) {
      return;
    }
    const { owner, repo } = getGithubUrlMeta(url.pathname);
    this._getOpenPRsInfo(owner, repo)
      .then(this._processPRInfo)
      .then(this._getPRBlockStatus)
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
