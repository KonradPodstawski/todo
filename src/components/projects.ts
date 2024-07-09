import { ProjectService, Project } from '../services/ProjectService.ts';
import { getNextID } from '../utils/utils.ts';

export function getProjectHtml() {
  return `
    <div id="project-management">
      <form id="project-form" class="space-y-4">
        <input type="text" id="project-name" placeholder="Project Name" class="border p-2 rounded w-full" />
        <textarea id="project-description" placeholder="Project Description" class="border p-2 rounded w-full"></textarea>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Add Project</button>
      </form>
      <div id="project-list" class="mt-4"></div>
    </div>
  `;
}

export function setupProjectManagement() {
  document.querySelector<HTMLFormElement>('#project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#project-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#project-description')!).value;
    await ProjectService.create({ id: getNextID(), name, description });
    loadProjects();
  });

  loadProjects();
}

async function loadProjects() {
  const projects = await ProjectService.getAll();
  const projectList = document.querySelector<HTMLDivElement>('#project-list');
  if (projectList) {
    projectList.innerHTML = projects.map(p => `<div>${p.name}: ${p.description}</div>`).join('');
  }
}
