import './style.css';
import { setupAuth } from './components/auth.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';
import { getProjectDetailHtml, renderProjects } from './components/projectDetail.ts';
import { getStoryDetailHtml, renderStories } from './components/storyDetail.ts';
import { getKanbanBoardHtml, loadKanbanBoard } from './components/kanbanBoard.ts';
import { ProjectService } from './services/ProjectService.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    ${getHeaderBarHtml()}
    <div id="project-content">
        ${getProjectDetailHtml()}
        ${getStoryDetailHtml()}
        ${getKanbanBoardHtml()}
    </div>
`;

setupAuth();

// Mock project selection and load data
async function initializeApp() {
    await ProjectService.setCurrentProject(1);
    renderProjects();
    renderStories();
    loadKanbanBoard();
}

initializeApp();
