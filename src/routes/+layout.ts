import { client } from '$lib/generated';

import { browser } from '$app/environment';
import { initInterceptors } from '$lib/client';
client.setConfig({
	baseURL: 'https://dev-api.spek-n-boonen.be'
});

if (browser) {
	initInterceptors();
}
