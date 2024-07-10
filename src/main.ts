import './style.css';
import { setupAuth, checkAuthStatus } from './components/auth.ts';
import { getTitlePageHtml } from './components/titlePage.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';
import { getProjectHtml } from './components/projects.ts';
import { getStoryHtml} from './components/story.ts';
import { getTaskHtml } from './components/task.ts';
import { getModalHtml, setupModal } from './components/modal.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div id="header-container" class="hidden w-screen">
    ${getHeaderBarHtml()}
    </div>
    ${getTitlePageHtml()}
    ${getModalHtml()}
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
setupModal();
