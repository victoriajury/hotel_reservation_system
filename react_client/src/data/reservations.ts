import { DataModelId } from './data_models';
import { Reservation } from './data_models';

import { API_BASE_URL } from './config';

export async function getReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE_URL}/reservations`);
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return await res.json();
}

export async function getReservation(id: DataModelId): Promise<Reservation> {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return await res.json();
}

export async function createReservation(newreservation: Omit<Reservation, 'id'>): Promise<Reservation> {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newreservation),
    });
    if (!res.ok) throw new Error(`Failed to create reservation: ${(await res?.text())}`);
    return await res.json();
}

export async function updateReservation(id: DataModelId, updated: Partial<Reservation>): Promise<Reservation> {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update reservation');
    return await res.json();
}

export async function deleteReservation(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete reservation');
}