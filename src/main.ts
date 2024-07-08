import './style.css';
import { setupAuth, checkAuthStatus } from './components/auth.ts';
import { getTitlePageHtml } from './components/titlePage.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    ${getHeaderBarHtml()}
    ${getTitlePageHtml()}
`;

setupAuth();
checkAuthStatus();
