import { PUBLIC_API_ENDPOINT } from '$env/static/public';

console.log(PUBLIC_API_ENDPOINT);

// get inventory
export async function getInventory() {
    const response = await fetch(`${PUBLIC_API_ENDPOINT}api/inventory/items/?page=1&limit=10`);
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const inventory = await response.json();
    return inventory;
  }