import HighlightPRTitle from './plugins/HighlightPRTitle';
import PROpenTime from './plugins/PROpenTime';

const config: ExtensionExtender.Configuration = {
  plugins: [
    HighlightPRTitle({
      repoConfig: [
        {
          repoPath: 'omar-aguilar/github-extender-extension',
          titleRegexp: '^(?:\\[[A-Za-z0-9]+-[A-Za-z0-9]+\\])+\\s[A-Z]',
        },
      ],
    }),
    PROpenTime(),
  ],
};

export default config;
