import { Project } from '../models/project';

export class ProjectService {
    private static currentProject: Project | null = null;

    static setCurrentProject(project: Project) {
        this.currentProject = project;
        localStorage.setItem('currentProject', JSON.stringify(project)); // Save to local storage
    }

    static getCurrentProject(): Project | null {
        if (this.currentProject === null) {
            const projectData = localStorage.getItem('currentProject');
            if (projectData) {
                this.currentProject = JSON.parse(projectData);
            }
        }
        return this.currentProject;
    }
}
