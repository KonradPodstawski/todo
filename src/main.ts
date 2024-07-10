import './style.css';
import { setupAuth, checkAuthStatus, getAuthHtml } from './components/auth.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';
import { getProjectHtml } from './components/projects.ts';
import { getStoryHtml} from './components/story.ts';
import { getTaskHtml } from './components/task.ts';
import { getModalHtml, setupModal } from './components/modal.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="header-container" class="hidden w-screen dark:bg-gray-900">
    ${getHeaderBarHtml()}
  </div>
  <div id="title-page" class="bg-gray-200 dark:bg-black flex items-center justify-center min-h-screen">
    <div class="text-center relative w-full max-w-md">
      <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400">Hello, World!</h1>
      <p class="text-lg text-gray-700 dark:text-gray-300 mt-4">This is a <a class="underline decoration-indigo-500">Tailwind</a> CSS example.</p>
      ${getAuthHtml()}
    </div>
  </div>
  ${getModalHtml()}
  <div id="project-container" class="hidden dark:bg-gray-800">
    ${getProjectHtml()}
  </div>
  <div id="story-container" class="hidden dark:bg-gray-800">
    ${getStoryHtml()}
  </div>
  <div id="task-container" class="hidden dark:bg-gray-800">
    ${getTaskHtml()}
  </div>
`;


setupAuth();
checkAuthStatus();
setupModal();
