import React from 'react';
import ReactDOM from 'react-dom/client';
import { CID } from './constants';
import { Toc } from './toc';
import { ErrorBoundary } from '../shared/error-boundary';
import { copyMdWhenClickHeader } from '../copy-react-docs';

const rootNode = document.getElementById(CID) || document.createElement('div');
if (!rootNode.isConnected) {
  rootNode.id = CID;
  rootNode.classList.add('toc-root');
  document.body.append(rootNode);
}

const root = ReactDOM.createRoot(rootNode);
const render = () =>
  root.render(
    <React.StrictMode>
      <ErrorBoundary className="toc-container toc-expanded">
        <Toc />
      </ErrorBoundary>
    </React.StrictMode>,
  );

render();
copyMdWhenClickHeader();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') render();
});
