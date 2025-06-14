import { DataModelId } from './data_models';
import { User } from './data_models';

import { API_BASE_URL } from './config';

export async function getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
}

export async function getUser(id: DataModelId): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
}

export async function createUser(newUser: Omit<User, 'id'>): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
    });
    if (!res.ok) throw new Error(`Failed to create user: ${(await res?.text())}`);
    return await res.json();
}

export async function updateUser(id: DataModelId, updated: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return await res.json();
}

export async function deleteUser(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete user');
}