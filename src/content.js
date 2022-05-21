import { renderToc } from './components';
import { copyMdWhenClickHeader } from './copy-react-docs';

renderToc();
copyMdWhenClickHeader();
const target = document.querySelector('title');
const observer = new MutationObserver(() => renderToc());
observer.observe(target, { childList: true });
