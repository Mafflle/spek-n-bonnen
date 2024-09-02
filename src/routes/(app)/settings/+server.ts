import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals, url, fetch, cookies }) => {
	const getSchedulesById = await fetch(`${PUBLIC_API_ENDPOINT}api/hrm/work-schedule/`);
	if (getSchedulesById.ok && getSchedulesById.status === 200) {
		const schedules = await getSchedulesById.json();
		return json(schedules);
	} else {
		console.log(getSchedulesById.status);
		console.log(getSchedulesById.url);
	}
};
