import { useEffect, useState } from 'react';
import { fetchTenants } from '../utils/api';

interface Tenant {
    _id: string;
    firstName: string;
    lastName: string;
}

export default function Book() {
    const [tenants, setTenants] = useState<Tenant[]>([]);

    useEffect(() => {
        fetchTenants().then(setTenants);
    }, []);

    return (
        <div>
            <h1>📋 Tenants</h1>
            <ul>
                {tenants.map((tenant) => (
                    <li key={tenant._id}>{tenant.firstName} {tenant.lastName}</li>
                ))}
            </ul>
        </div>
    );
}
