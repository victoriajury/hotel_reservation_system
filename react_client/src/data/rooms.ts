import { DataModelId } from './data_models';
import { Room } from './data_models';

import { API_BASE_URL } from './config';

export async function getRooms(): Promise<Room[]> {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return await res.json();
}

export async function getRoom(id: DataModelId): Promise<Room> {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return await res.json();
}

export async function createRoom(newRoom: Omit<Room, 'id'>): Promise<Room> {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
    });
    if (!res.ok) throw new Error(`Failed to create room: ${(await res?.text())}`);
    return await res.json();
}

export async function updateRoom(id: DataModelId, updated: Partial<Room>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update room');
}

export async function deleteRoom(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete room');
}