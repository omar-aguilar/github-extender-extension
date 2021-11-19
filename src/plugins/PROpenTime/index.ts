import PROpenTimeBG from './background';
import PROpenTimeCS from './contentScript';

function PROpenTime(): ExtensionExtender.PluginConfig {
  return {
    background: PROpenTimeBG,
    contentScript: PROpenTimeCS,
  };
}

export default PROpenTime;
