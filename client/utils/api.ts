const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchTenants() {
    const res = await fetch(`${API_URL}/tenants`);
    return res.json();
}
