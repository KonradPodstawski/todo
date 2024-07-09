import './style.css';
import { setupAuth, checkAuthStatus, getIAuthenticated } from './components/auth.ts';
import { getTitlePageHtml } from './components/titlePage.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';
import { getProjectHtml, setupProjectManagement } from './components/projects.ts';
import { getStoryHtml, setupStoryManagement } from './components/story.ts';
import { getTaskHtml, setupTaskManagement } from './components/task.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    ${getHeaderBarHtml()}
    ${getTitlePageHtml()}
    <div id="project-container" class="hidden">
        ${getProjectHtml()}
    </div>
    <div id="story-container" class="hidden">
        ${getStoryHtml()}
    </div>
    <div id="task-container" class="hidden">
        ${getTaskHtml()}
    </div>
`;

setupAuth();
checkAuthStatus();