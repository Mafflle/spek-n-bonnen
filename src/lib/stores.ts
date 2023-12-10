import { writable } from 'svelte/store';
import type { Option } from './utils';

export let passwordModal = writable(false);
export let passwordConfirmation = writable(false);
export let inviteUserModal = writable(false);
export const selectedPerms = writable<Option[]>([]);

export const updateSelectedPerms = (option: Option) => {
	let allPerms: Option[] = [];
	selectedPerms.subscribe((perms) => (allPerms = perms));
	if (!allPerms.includes(option)) {
		selectedPerms.update((perms: Option[]) => [...perms, option]);
	}
};
