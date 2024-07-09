import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';

export function getProjectDetailHtml() {
    return `
    <div id="project-detail" class="mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
        <div id="project-list" class="space-y-4"></div>
        <div class="mt-4">
            <input type="text" id="new-project-name" placeholder="Project Name" class="border p-2 rounded w-full"/>
            <input type="text" id="new-project-description" placeholder="Project Description" class="border p-2 rounded w-full mt-2"/>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="createProject()">Create Project</button>
        </div>
    </div>
    `;
}

export async function renderProjects() {
    const projects = await ProjectService.getAllProjects();
    const projectList = document.getElementById('project-list');
    if (projectList) {
        projectList.innerHTML = projects.map(project => renderProjectItem(project)).join('');
    }
}

function renderProjectItem(project: Project) {
    return `
    <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300">
        <h3 class="text-xl font-semibold">${project.name}</h3>
        <p class="text-gray-600 mt-2">${project.description}</p>
        <div class="mt-4 flex justify-between">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="editProject(${project.id})">Edit</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onclick="deleteProject(${project.id})">Delete</button>
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onclick="selectProject(${project.id})">Select</button>
        </div>
    </div>
    `;
}

async function createProject() {
    const name = (document.getElementById('new-project-name') as HTMLInputElement).value;
    const description = (document.getElementById('new-project-description') as HTMLInputElement).value;
    if (name && description) {
        await ProjectService.createProject(new Project(0, name, description));
        renderProjects();
    }
}

async function editProject(projectId: number) {
    const project = await ProjectService.getProjectById(projectId);
    if (!project) return;

    const newName = prompt('Enter new project name', project.name);
    const newDescription = prompt('Enter new project description', project.description);

    if (newName && newDescription) {
        project.name = newName;
        project.description = newDescription;
        await ProjectService.updateProject(project);
        renderProjects();
    }
}

async function deleteProject(projectId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
        await ProjectService.deleteProject(projectId);
        renderProjects();
    }
}

async function selectProject(projectId: number) {
    await ProjectService.setCurrentProject(projectId);
    alert(`Project ${projectId} selected`);
    // You can add further actions here, like reloading stories or tasks for the selected project
}
