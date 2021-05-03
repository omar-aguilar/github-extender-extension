module.exports = [
  {
    owner: 'foxbroadcasting',
    repository: 'cpe-keyart-manager',
    plugins: [
      {
        name: 'highlight-pr-title',
        contentScript: {
          matches: 'https://github.com/*/pulls*',
        },
        configuration: {
          selector: 'link-gray-dark v-align-middle no-underline h4 js-navigation-open',
          match: '^(?:[[A-Za-z0-9]+-[A-Za-z0-9]+])+s[A-Z]',
        },
      },
      {
        name: 'active-pr-status',
        contentScript: {
          matches: 'https://github.com/*/pulls*',
        },
        configuration: {
          ignoreWithLabels: ['code review passed'],
          blockLevel: 'user',
        },
      },
    ],
  },
];

// highlight-pr-title

/*
import 'ActivePRStatus';

function highlightPRTitle({ register, updateUI }, config) {
  const uiComponent = 'active-pr-status'
  const defaultDOMSelector = '.PR-Box'

  function ui(elem, { prs }) {
    const prId = getPrId(elem)
    getPR(prId, prs)
    if (blocked) {
      render blocked
    }
    ...
  }
  
  function background(data) {
    // read open prs
    // get pr info
    // updateUI(data)
  }

  init() {
    register({
      ui,
      background,
    })
  }
}
*/

/*
import 'WebComponent';

function highlightPRTitle({ register }, config) {
  const defaultDOMSelector = '.PR-Title-Box'

  function ui(elem, { match }) {
    const title = elem.innerText;
    const matchRegexp = new RegExp(match);
    if (prTitleRegEx.test(title)) {
      return;
    }
    ...
  }


  init() {
    register({
      ui,
      background,
    })
  }
}
*/
