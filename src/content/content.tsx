import React from 'react';
import ReactDOM from 'react-dom/client';
import { CID } from '../shared/constants';
import { Toc } from './toc';
import { ErrorBoundary } from '../shared/error-boundary';

const rootNode = document.getElementById(CID) || document.createElement('div');
if (!rootNode.isConnected) {
  rootNode.id = CID;
  rootNode.classList.add('toc-root');
  document.documentElement.append(rootNode);
}

ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <ErrorBoundary className="toc-container toc-embed">
      <Toc />
    </ErrorBoundary>
  </React.StrictMode>,
);
