import { PUBLIC_API_ENDPOINT } from '$env/static/public';

// get inventory
export async function getInventory() {
	const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/items/?page=1&limit=10`);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const inventory = await response.json();
	return inventory;
}

export const uploadImage = async (title, image) => {
	const dataToSend = new FormData();

	dataToSend.append('title', title);
	dataToSend.append('image', image);
	const createLogo = await fetch(`${PUBLIC_API_ENDPOINT}api/images/images/`, {
		method: 'POST',
		body: dataToSend
		// headers: {
		// 	'Content-Type': 'multipart/form-data'
		// }
	});
	if (createLogo.ok) {
		const brandLogo = await createLogo.json();
		console.log(brandLogo);
	} else console.log(createLogo.status, createLogo.statusText);
};
