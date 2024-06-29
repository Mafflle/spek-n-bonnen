import { writable } from 'svelte/store';
import type { User } from './user';

export enum TaskPriorities {
	LOW = 'LOW',
	NORMAL = 'NORMAL',
	HIGH = 'HIGH'
}

export enum TaskStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED'
}

export type Task = {
	id: number;
	title: string;
	assignees: User[];
	created_at: Date;
	updated_at: Date;
	description: string;
	priority: TaskPriorities;
	start_time: Date;
	end_time: Date;
	status: TaskStatus;
};

export let Tasks = writable<Task[]>([]);
