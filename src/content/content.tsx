import React from 'react';
import ReactDOM from 'react-dom/client';
import { CID } from './constants';
import { Toc } from './toc';
import { copyMdWhenClickHeader } from '../copy-react-docs';

function render() {
  const rootNode = document.getElementById(CID) || document.createElement('div');
  if (!rootNode.isConnected) {
    rootNode.id = CID;
    rootNode.classList.add('toc-root');
    document.body.append(rootNode);
  }

  ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
      <Toc />
    </React.StrictMode>,
  );
}

render();
copyMdWhenClickHeader();
