import { FunctionComponent } from 'react';
import GithubToken from './components/GithubToken';

const GlobalConfigContainer: FunctionComponent = () => {
  return (
    <>
      <div>Global Config</div>
      <br />
      <GithubToken />
    </>
  );
};

export default GlobalConfigContainer;
