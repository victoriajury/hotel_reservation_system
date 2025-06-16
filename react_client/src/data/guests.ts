import { DataModelId } from './data_models';
import { Guest } from './data_models';

import { API_BASE_URL } from './config';

export async function getGuests(): Promise<Guest[]> {
    const res = await fetch(`${API_BASE_URL}/guests`);
    if (!res.ok) throw new Error('Failed to fetch guests');
    return await res.json();
}

export async function getGuest(id: DataModelId): Promise<Guest> {
    const res = await fetch(`${API_BASE_URL}/guests/${id}`);
    if (!res.ok) throw new Error('Failed to fetch guests');
    return await res.json();
}

export async function createGuest(newGuest: Omit<Guest, 'id'>): Promise<Guest> {
    const res = await fetch(`${API_BASE_URL}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest),
    });
    if (!res.ok) throw new Error(`Failed to create guest: ${(await res?.text())}`);
    return await res.json();
}

export async function updateGuest(id: DataModelId, updatedGuest: Partial<Guest>): Promise<Guest | undefined> {
    const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGuest),
    });
    if (!res.ok) throw new Error('Failed to update guest');
    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
}

export async function deleteGuest(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete guest');
}