import { extractPRSummary, getOpenPRsInfo, getReviewsPerPr } from 'background/prUtils';
import { getGithubUrlMeta } from '../../utils';

class GetPRStatus {
  constructor(config) {
    const globalConfig = config.globalConfig || {};
    this.token = globalConfig.githubToken;
  }

  _getPRTeamBlockStatus(labels, prMeta) {
    const { skipLabels, reviewPassedLabels } = labels;
    const perPRReview = getReviewsPerPr(prMeta, reviewPassedLabels);
    return prMeta.map((pr, idx) => {
      const { user, number } = pr;
      const { reviewPassed } = perPRReview[pr.number];
      const hasSkipLabel = pr.labels.some(label => skipLabels.includes(label));
      const isBlocked = hasSkipLabel || reviewPassed
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
        reviewPassed,
      };
    });
  }

  _getPRUserBlockStatus(labels, prMeta) {
    const { skipLabels, reviewPassedLabels } = labels;
    const perPRReview = getReviewsPerPr(prMeta, reviewPassedLabels);
    const shouldReview = {};
    return prMeta.reduceRight((result, pr, idx) => {
      const { reviewPassed } = perPRReview[pr.number];
      const hasSkipLabel = pr.labels.some(label => skipLabels.includes(label));
      const isBlocked = hasSkipLabel || reviewPassed
        ? false
        : ( // check older PRs to see if there is one without review so we can block it
          prMeta.slice(idx + 1)
            .filter(filterPr => filterPr.user !== pr.user)
            .map((prData) => {
              const { reviewers, reviewPassed: prReviewPassed } = perPRReview[prData.number];
              if (shouldReview[prData.number] === false || prReviewPassed) {
                return true;
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
        reviewPassed,
      };
      return [...result, blockData];
    }, []);
  }

  getBlockStatus(owner, repo, config) {
    const { blockPRs = {} } = config;
    if (!blockPRs.block) {
      return Promise.resolve([]);
    }
    return getOpenPRsInfo(owner, repo, this.token)
      .then(extractPRSummary)
      .then((prMeta) => {
        const { skipLabels = [], reviewPassedLabels = [] } = blockPRs;
        const promise = blockPRs.useUserLevelBlock
          ? this._getPRUserBlockStatus({ skipLabels, reviewPassedLabels }, prMeta)
          : this._getPRTeamBlockStatus({ skipLabels, reviewPassedLabels }, prMeta);
        return Promise.all([prMeta, promise]);
      })
      .catch((error) => {
        console.log('error while getting PR info', error);
        return Promise.resolve([]);
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
    const url = new URL(tab.url);
    if (url.search && !url.search.includes('open')) {
      return;
    }

    const { owner, repo } = getGithubUrlMeta(url.pathname);
    this.getBlockStatus(owner, repo, config)
      .then(([, prStatus]) => {
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
