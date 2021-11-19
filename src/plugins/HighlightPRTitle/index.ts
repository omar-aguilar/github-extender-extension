import HighlightPRTitleBG from './background';
import HighlightPRTitleCS from './contentScript';

function HighlightPRTitle(): ExtensionExtender.PluginConfig {
  return {
    background: HighlightPRTitleBG,
    contentScript: HighlightPRTitleCS,
  };
}

export default HighlightPRTitle;
