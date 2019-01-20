import { getReviewsPerPr } from 'background/prUtils';
import { getConfigFor } from 'background/PageManager/utils';

class BlockReport {
  constructor(config, getActivePRStatus) {
    this.config = config.repoConfig || [];
    this.getActivePRStatus = getActivePRStatus;
    const globalConfig = config.globalConfig || {};
    this.token = globalConfig.githubToken;
  }

  /**
   * @override
   */
  onKeyUpdated(config) {
    this.config = config.repoConfig || [];
    const globalConfig = config.globalConfig || {};
    this.token = globalConfig.githubToken;
  }

  _getPrsLink(owner, repo, prs, withLink) {
    return prs.map(number => (withLink
      ? `<https://github.com/${owner}/${repo}/pull/${number}|${number}>`
      : number
    ))
      .join(', ');
  }

  getPrList(owner, repo, prs, withLink = false) {
    const prsMap = {};
    prs.forEach(({ user, number }) => {
      if (!prsMap[user]) {
        prsMap[user] = [];
      }
      prsMap[user].push(number);
    });

    return Object.keys(prsMap).map((user) => {
      const userPrs = prsMap[user];
      const prsText = this._getPrsLink(owner, repo, userPrs, withLink);
      return `• from \`${user}\`: ${prsText}`;
    })
      .join('\n');
  }

  getShameList(owner, repo, users, prStatus, perPRReview) {
    return users.map((user) => {
      const pendingPrs = prStatus.map((pr) => {
        const { number } = pr;
        const { reviewers } = perPRReview[number];
        if (pr.user === user) {
          return null;
        }
        return reviewers.has(user) || pr.reviewPassed || pr.isBlocked ? null : number;
      })
        .filter(value => value);
      const pendingPrsText = this._getPrsLink(owner, repo, pendingPrs, true);
      return (pendingPrsText && `:whip: \`${user}\` needs to review ${pendingPrsText}`);
    })
      .filter(value => value)
      .join('\n');
  }

  get(owner, repo) {
    const config = getConfigFor(this.config, owner, repo);
    const { blockPRs = {} } = config;
    const { reviewPassedLabels } = blockPRs;
    const gameUsers = [];

    return this.getActivePRStatus.getBlockStatus(owner, repo, config)
      .then(([prMeta, prStatus]) => {
        const perPRReview = getReviewsPerPr(prMeta, reviewPassedLabels);
        const blocked = prStatus.filter(pr => pr.isBlocked);
        const unblocked = prStatus.filter(pr => !pr.isBlocked);

        const reportTitle = '*PR Status*';
        let unblockedText = '';
        let blockedText = '';
        let shameListText = '';

        if (unblocked.length) {
          unblockedText = '*PRs needing Review*\n';
          unblockedText += this.getPrList(owner, repo, unblocked, true);
        }

        if (blocked.length) {
          blockedText = '*PRs blocked because its owners need to review other PRs first*\n';
          blockedText += this.getPrList(owner, repo, blocked);

          shameListText = '*Users who has not reviewed pending PRs aka Shame List* :mickey-sp:\n';
          shameListText += this.getShameList(owner, repo, gameUsers, prStatus, perPRReview);
        }

        return [reportTitle, unblockedText, blockedText, shameListText]
          .map(text => text)
          .join('\n\n');
      });
  }
}

export default BlockReport;
