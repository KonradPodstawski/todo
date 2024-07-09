export class User {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string
    ) {}
}

export const mockLoggedInUser = new User('1', 'John', 'Doe');
