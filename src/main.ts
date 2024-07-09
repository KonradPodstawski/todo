import './style.css';
import { setupAuth, checkAuthStatus } from './components/auth.ts';
import { getTitlePageHtml } from './components/titlePage.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';
import { getProjectHtml, setupProjectManagement } from './components/projects.ts';
import { getStoryHtml, setupStoryManagement } from './components/story.ts';
import { getTaskHtml, setupTaskManagement } from './components/task.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    ${getHeaderBarHtml()}
    ${getTitlePageHtml()}
    ${getProjectHtml()}
    ${getStoryHtml()}
    ${getTaskHtml()}
`;

setupAuth();
checkAuthStatus();
setupProjectManagement();
setupStoryManagement();
setupTaskManagement();
