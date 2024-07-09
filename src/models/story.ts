export class Story {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public priority: 'niski' | 'średni' | 'wysoki',
        public projectId: number,
        public createdAt: Date,
        public status: 'todo' | 'doing' | 'done',
        public ownerId: string
    ) {}
}
