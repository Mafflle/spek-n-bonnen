import { writable } from 'svelte/store';
import type { User } from './user';

//Task
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
export let currentTask = writable<Task | null>(null);

// Schedule
export type Schedule = {
	account_id: number;
	day_of_week: number;
	start_time: string;
	end_time: string;
	id: number;
};
export let workSchedules = writable<Schedule[]>([]);

// Time Entries

export type TimeEntry = {
	account: number;
	event_type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
	id: number;
	timestamp: Date;
};

export let TimeEntries = writable<TimeEntry[]>([]);
