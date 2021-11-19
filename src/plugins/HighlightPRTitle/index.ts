import HighlightPRTitleBG from './background';
import HighlightPRTitleCS from './contentScript';
import { HighlightPRTitlePartialConfig } from './types';

function HighlightPRTitle(config?: HighlightPRTitlePartialConfig): ExtensionExtender.PluginConfig {
  return {
    background: () => HighlightPRTitleBG(config),
    contentScript: HighlightPRTitleCS,
  };
}

export default HighlightPRTitle;
