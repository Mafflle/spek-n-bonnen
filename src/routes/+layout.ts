import { browser } from '$app/environment';
import { initInterceptors } from '$lib/client';

import { client } from '$lib/generated';

client.setConfig({
	baseURL: 'https://dev-api.spek-n-boonen.be'
});

if (browser) {
	initInterceptors();
}
