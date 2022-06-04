import React from 'react';
import ReactDOM from 'react-dom/client';
import { CID } from './constants';
import { Toc } from './toc';
import { ErrorBoundary } from '../shared/error-boundary';

const rootNode = document.getElementById(CID) || document.createElement('div');
if (!rootNode.isConnected) {
  rootNode.id = CID;
  rootNode.classList.add('toc-root');
  document.body.append(rootNode);
}

ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <ErrorBoundary className="toc-container toc-expanded">
      <Toc />
    </ErrorBoundary>
  </React.StrictMode>,
);
