function HighlightPRTitle(): BGPluginManager.Plugin {
  const name = 'HighlightPRTitle';
  const section = 'pulls';
  const styles = {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  };

  function handlePage(
    githubPage: GithubPageManager.GithubPage,
    sendMessage: BGPluginManager.SendPluginMessageFn
  ) {
    if (githubPage.section !== section) {
      return;
    }

    sendMessage(name, { styles });
  }

  function register(hooks: BGPluginManager.Hooks) {
    hooks.page.tap(name, handlePage);
  }

  return {
    register,
  };
}

export default HighlightPRTitle;
