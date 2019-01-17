import { extractPRSummary, getOpenPRsInfo, getReviewsPerPr } from 'background/prUtils';
import PageManagerHandlerInterface from '../../PageManagerHandlerInterface';
import { getGithubUrlMeta } from '../../utils';

class GetPRStatus extends PageManagerHandlerInterface {
  constructor(config) {
    super();
    const globalConfig = config.globalConfig || {};
    this.token = globalConfig.githubToken;
  }

  _getPRTeamBlockStatus(labels, prMeta) {
    const { skipLabels } = labels;
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

  _getPRUserBlockStatus(labels, prMeta) {
    const { skipLabels, reviewPassedLabels } = labels;
    const perPRReview = getReviewsPerPr(prMeta, reviewPassedLabels);
    const shouldReview = {};
    return prMeta.reduceRight((result, pr, idx) => {
      const hasSkipLabel = pr.labels.some(label => skipLabels.includes(label));
      const isBlocked = hasSkipLabel || perPRReview[pr.number].reviewPassed
        ? false
        : (
          prMeta.slice(idx + 1)
            .filter(filterPr => filterPr.user !== pr.user)
            .map((prData) => {
              const { reviewers, reviewPassed } = perPRReview[prData.number];
              if (shouldReview[prData.number] === false || reviewPassed) {
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
    getOpenPRsInfo(owner, repo, this.token)
      .then(extractPRSummary)
      .then((prMeta) => {
        const { skipLabels = [], reviewPassedLabels = [] } = blockPRs;
        if (blockPRs.useUserLevelBlock) {
          return this._getPRUserBlockStatus({ skipLabels, reviewPassedLabels }, prMeta);
        }
        return this._getPRTeamBlockStatus({ skipLabels, reviewPassedLabels }, prMeta);
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
