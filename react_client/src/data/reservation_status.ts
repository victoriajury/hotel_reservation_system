import { DataModelId } from './data_models';
import { ReservationStatus } from './data_models';

import { API_BASE_URL } from './config';

export async function getReservationStatuses(): Promise<ReservationStatus[]> {
    const res = await fetch(`${API_BASE_URL}/reservation-status`);
    if (!res.ok) throw new Error('Failed to fetch reservation statuses');
    return await res.json();
}

export async function getReservationStatus(id: DataModelId): Promise<ReservationStatus> {
    const res = await fetch(`${API_BASE_URL}/reservation-status/${id}`);
    if (!res.ok) throw new Error('Failed to fetch reservation statuses');
    return await res.json();
}

export async function createReservationStatus(newReservationStatus: Omit<ReservationStatus, 'id'>): Promise<ReservationStatus> {
    const res = await fetch(`${API_BASE_URL}/reservation-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservationStatus),
    });
    if (!res.ok) throw new Error(`Failed to create reservation status: ${(await res?.text())}`);
    return await res.json();
}

export async function updateReservationStatus(id: DataModelId, updated: Partial<ReservationStatus>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/reservation-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update reservation status');
}

export async function deleteReservationStatus(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/reservation-status/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete reservation status');
}