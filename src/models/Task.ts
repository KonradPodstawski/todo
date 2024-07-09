export class Task {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public priority: 'niski' | 'średni' | 'wysoki',
        public storyId: number,
        public estimatedTime: string,
        public status: 'todo' | 'doing' | 'done',
        public createdAt: Date,
        public startTime: Date | null = null,
        public endTime: Date | null = null,
        public responsibleUserId: string | null = null
    ) {}
}
