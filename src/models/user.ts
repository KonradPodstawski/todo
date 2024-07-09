export type Role = 'admin' | 'devops' | 'developer';

export class User {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public role: Role
    ) {}
}

// Mock list of users
export const mockUsers = [
    new User('1', 'John', 'Doe', 'admin'),
    new User('2', 'Jane', 'Smith', 'developer'),
    new User('3', 'Mark', 'Brown', 'devops'),
];
