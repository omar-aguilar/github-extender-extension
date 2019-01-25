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
      ? {
        link: `https://github.com/${owner}/${repo}/pull/${number}`,
        number,
      }
      : {
        number,
      }
    ));
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
      const prLinks = this._getPrsLink(owner, repo, userPrs, withLink);
      return { user, prLinks };
    });
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
      const prLinks = this._getPrsLink(owner, repo, pendingPrs, true);
      if (prLinks && prLinks.length) {
        return {
          user,
          prLinks,
        };
      }
      return null;
    })
      .filter(value => value);
  }

  toSlackResponse(report) {
    const {
      title,
      unblocked,
      blocked,
      shameList,
    } = report;
    let unblockedText = '';
    let blockedText = '';
    let shameListText = '';
    if (unblocked.data) {
      unblockedText = `${unblocked.title}\n`;
      unblockedText += unblocked.data.map(({ user, prLinks }) => {
        const prsText = prLinks.map(({ number, link }) => (link ? `<${link}|${number}>` : number)).join(', ');
        return `• from \`${user}\`: ${prsText}`;
      })
        .join('\n');
    }
    if (blocked.data) {
      blockedText = `${blocked.title}\n`;
      blockedText += blocked.data.map(({ user, prLinks }) => {
        const prsText = prLinks.map(({ number, link }) => (link ? `<${link}|${number}>` : number)).join(', ');
        return `• from \`${user}\`: ${prsText}`;
      })
        .join('\n');
    }

    const shameEmojis = [':whip:', ':latigazo:'];
    if (shameList.data) {
      shameListText = `${shameList.title} :mickey-sp:\n`;
      shameListText += shameList.data.map(({ user, prLinks }) => {
        const shameEmoji = shameEmojis[Math.floor(Math.random() * shameEmojis.length)];
        const prsText = prLinks.map(({ number, link }) => (link ? `<${link}|${number}>` : number)).join(', ');
        return `${shameEmoji} \`${user}\` needs to review ${prsText}`;
      })
        .join('\n');
    }

    return [title, unblockedText, blockedText, shameListText]
      .filter(text => text)
      .join('\n\n');
  }

  get(owner, repo, usersInReport, responseType = 'js') {
    const config = getConfigFor(this.config, owner, repo);
    const { blockPRs = {} } = config;
    const { reviewPassedLabels } = blockPRs;

    return this.getActivePRStatus.getBlockStatus(owner, repo, config)
      .then(([prMeta, prStatus]) => {
        const perPRReview = getReviewsPerPr(prMeta, reviewPassedLabels);
        const blocked = prStatus.filter(pr => pr.isBlocked);
        const unblocked = prStatus.filter(pr => !pr.isBlocked);
        let unblockedData = null;
        let blockedData = null;
        let shameListData = null;

        if (unblocked.length) {
          unblockedData = this.getPrList(owner, repo, unblocked, true);
        }

        if (blocked.length) {
          blockedData = this.getPrList(owner, repo, blocked);
          shameListData = this.getShameList(owner, repo, usersInReport, prStatus, perPRReview);
        }

        const report = {
          title: 'PR Status',
          unblocked: {
            title: 'PRs needing Review',
            data: unblockedData,
          },
          blocked: {
            title: 'PRs blocked because its owners need to review other PRs first',
            data: blockedData,
          },
          shameList: {
            title: 'Users who have not reviewed pending PRs aka Shame List',
            data: shameListData,
          },
          time: Date.now(),
        };
        return report;
      })
      .then((report) => {
        if (responseType === 'slack') {
          return this.toSlackResponse(report);
        }
        return report;
      });
  }
}

export default BlockReport;
