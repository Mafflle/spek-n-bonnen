import { writable } from 'svelte/store';

export let passwordModal = writable(false);
export let passwordConfirmation = writable(false);
export let inviteUserModal = writable(false);
