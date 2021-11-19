import HighlightPRTitle from './plugins/HighlightPRTitle';
import PROpenTime from './plugins/PROpenTime';

const config: ExtensionExtender.Configuration = {
  plugins: [HighlightPRTitle(), PROpenTime()],
};

export default config;
