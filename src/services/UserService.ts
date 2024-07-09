import { User, mockUsers } from '../models/User';

export class UserService {
    private static currentUser: User = mockUsers[0]; // Admin user

    static getCurrentUser(): User {
        return this.currentUser;
    }

    static getAllUsers(): User[] {
        return mockUsers;
    }

    static getUserById(id: string): User | undefined {
        return mockUsers.find(user => user.id === id);
    }
}
