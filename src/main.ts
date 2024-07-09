import './style.css';
import { setupAuth } from './components/auth.ts';
import { getTitlePageHtml } from './components/titlePage.ts';
import { getHeaderBarHtml } from './components/headerBar.ts';
import { ProjectService } from './services/projectService';
import { Project } from './models/project';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    ${getHeaderBarHtml()}
    ${getTitlePageHtml()}
`;

setupAuth();

// Mock project selection (should only be done after login)
const mockProject = new Project(1, 'Project Alpha', 'Description of Project Alpha');
ProjectService.setCurrentProject(mockProject);
