# github-extender-extension
Add functionality to Github via Chrome extension

# Preparations
## Get an access token in GitHub
1. Go to https://github.com
1. Click in your avatar.
1. Click **Settings**.
1. Click **Developer Settings** in the left menu.
1. Click **Personal access token** in the left menu.
1. Click **Generate new token** button.
1. Enter a **token description**.
1. Select **repo** in scopes, that should select:
  * repo:status
  * repo_deployment
  * public_repo
  * repo:invite
1. Click **Generate token**.
1. The token will be displayed on the screen only one time.
1. Save the token somewhere.

# Setup Extension
1. git clone https://github.com/omar-aguilar/github-extender-extension.git
1. Go to your extension folder: `cd path/to/github-extender-extension`.
1. Install dependencies: `npm i`.
1. Build the extension: `npm run build`.
1. Open Chrome,
1. Type in a tab `chrome://extensions`
1. Enable **Developer mode** in the top right.
1. Click Load Unpacked.
1. Select the `dist` folder (created in step 3).
1. Click on the extension logo it has a `G`.

## Report
1. On field `Owner` set `foxbroadcasting`.
1. On field `Repo` set `fng-cms`.
1. On `Users in Report` set `aarregui, EduardoSH18, omar-aguilar, sabs231`.
1. On field `Current User` set the user you want to see the report from the above list.
1. Click `Save Changes`
1. By default te report is created the first time Chrome is opened and every 30 minutes, optionally you can generate the report by clicking `Update Report`

## Repo Config
1. Click `Add One` on the popup.
1. On Owner type `foxbroadcasting`.
1. On Config type:
      [
          {
              "repo": "fng-cms",
              "titleRegEx": "^(?:\\[[A-Za-z0-9]+-[A-Za-z0-9]+\\])+\\s[A-Z]|Release.+",
              "blockPRs": {
                "block": true,
                "skipLabels": ["release", "no_block", "hotfix"],
                "reviewPassedLabels": ["code review passed", "changes requested"],
                "useUserLevelBlock": true
              }
          }
      ]
    * `repo` is the repository
    * `titleRegEx` is a regex to mark the PR titles if the format is not valid, up to you if you want it
    * `blockPRs` is an object which may include:
        * `block` is a boolean to indicate whether to block or not a PR
        * `skipLabels` an array with the labels that will be used to avoid blocking a PR
        * `prReviewPassedLabels`  an array with the labels that indicate the PR review has successfully passed
        * `useUserLevelBlock` a boolean if `true` the policy to block PRs is more permissive
1. Click `Save Changes`.

## Global Config
1. There will be field named `Github Token`.
1. Input the token obtained from `Get an access token in github` (described above).
1. Click **Save Changes**.

# Update Extension
1. Go to your extension folder: `cd path/to/github-extender-extension`.
1. Update the code: `git pull`.
1. Rebuild the extension: `npm run build`.
1. Open Chrome,
1. Type in a tab `chrome://extensions`
1. Look for **Github Extender Extension**
1. Click on the reload button on the bottom right, before the on/off toggle.
