import toast from 'svelte-french-toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';
export const showToast = (message: string, type: ToastType) => {
	if (message) {
		if (type === 'success') {
			toast(message, {
				style: 'background: #8fef98; color: #06111F;',
				position: 'bottom-right'
			});
		} else if (type === 'error') {
			toast(message, {
				style: 'background: #ef8f8f; color: #ed3434;',
				position: 'bottom-right'
			});
		} else if (type === 'warning') {
			toast(message, {
				style: 'background: #fff3cd; color: #fbbf24;',
				position: 'bottom-right'
			});
		} else if (type === 'info') {
			// Blue background with white text
			toast(message, {
				style: 'background: #bab6b6; color: #111111;',
				position: 'bottom-right'
			});
		} else {
			toast(message, {
				style: 'background: #bab6b6; color: #111111;',
				position: 'bottom-right'
			});
		}
	}
};