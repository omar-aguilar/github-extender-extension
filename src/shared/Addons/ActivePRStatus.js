import { extractPRSummary, getOpenPRsInfo, getReviewsPerPr } from 'background/prUtils';
import AddonBase from './AddonBase';

class ActivePRStatus extends AddonBase {
  getToken() {
    const { githubToken } = this.globalConfig;
    if (!githubToken) {
      throw Error('token has not been provided');
    }
    return githubToken;
  }

  _getPRTeamBlockStatus(prSummary) {
    const { ignoreWithLabels = [], reviewPassedLabels = [] } = this.config;
    const perPRReview = getReviewsPerPr(prSummary, reviewPassedLabels);
    return prSummary.map((pr, idx) => {
      const { user, number } = pr;
      const { reviewPassed } = perPRReview[pr.number];
      const hasSkipLabel = pr.labels.some(label => ignoreWithLabels.includes(label));
      const isBlocked = hasSkipLabel || reviewPassed
        ? false
        : ( // the user in the pr needs to review older PRs before unblock others
          prSummary.slice(idx + 1)
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

  _getPRUserBlockStatus(prSummary) {
    console.log('ActivePRSTatus._getPRUserBlockStatus', prSummary);
    const { ignoreWithLabels = [], reviewPassedLabels = [] } = this.config;
    const perPRReview = getReviewsPerPr(prSummary, reviewPassedLabels);
    const shouldReview = {};
    return prSummary.reduceRight((result, pr, idx) => {
      const { reviewPassed } = perPRReview[pr.number];
      const hasSkipLabel = pr.labels.some(label => ignoreWithLabels.includes(label));
      const isBlocked = hasSkipLabel || reviewPassed
        ? false
        : ( // check older PRs to see if there is one without review so we can block it
          prSummary.slice(idx + 1)
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

  getBlockStatus(owner, repo) {
    const token = this.getToken();
    return getOpenPRsInfo(owner, repo, token)
      .then(extractPRSummary)
      .then((prSummary) => {
        const { prBlockLevel } = this.config;
        return prBlockLevel === 'user'
          ? this._getPRUserBlockStatus(prSummary)
          : this._getPRTeamBlockStatus(prSummary);
      })
      .then(results => ({
        handler: 'activePRStatus',
        params: [results],
      }))
      .catch((error) => {
        console.log('error while getting PR info', error);
        return Promise.resolve([]);
      });
  }

  exec(callerUrl) {
    const { owner, repo } = callerUrl;
    return this.getBlockStatus(owner, repo);
  }
}

export default ActivePRStatus;
