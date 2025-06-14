import { DataModelId } from './data_models';
import { RoomType } from './data_models';

import { API_BASE_URL } from './config';

export async function getRoomTypes(): Promise<RoomType[]> {
    const res = await fetch(`${API_BASE_URL}/room-types`);
    if (!res.ok) throw new Error('Failed to fetch room types');
    return await res.json();
}

export async function getRoomType(id: DataModelId): Promise<RoomType> {
    const res = await fetch(`${API_BASE_URL}/room-types/${id}`);
    if (!res.ok) throw new Error('Failed to fetch room type');
    return await res.json();
}

export async function createRoomType(newRoomType: Omit<RoomType, 'id'>): Promise<RoomType> {
    const res = await fetch(`${API_BASE_URL}/room-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoomType),
    });
    if (!res.ok) throw new Error(`Failed to create room type: ${(await res?.text())}`);
    return await res.json();
}

export async function updateRoomType(id: DataModelId, updated: Partial<RoomType>): Promise<RoomType> {
    const res = await fetch(`${API_BASE_URL}/room-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update room type');
    return await res.json();
}

export async function deleteRoomType(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/room-types/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete room type');
}