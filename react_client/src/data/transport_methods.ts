import { DataModelId } from './data_models';
import { TransportMethod } from './data_models';

import { API_BASE_URL } from './config';

export async function getTransportMethods(): Promise<TransportMethod[]> {
    const res = await fetch(`${API_BASE_URL}/transport-methods`);
    if (!res.ok) throw new Error('Failed to fetch transport methods');
    return await res.json();
}

export async function getTransportMethod(id: DataModelId): Promise<TransportMethod> {
    const res = await fetch(`${API_BASE_URL}/transport-methods/${id}`);
    if (!res.ok) throw new Error('Failed to fetch transport method');
    return await res.json();
}

export async function createTransportMethod(newTransportMethod: Omit<TransportMethod, 'id'>): Promise<TransportMethod> {
    const res = await fetch(`${API_BASE_URL}/transport-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransportMethod),
    });
    if (!res.ok) throw new Error(`Failed to create transport method: ${(await res?.text())}`);
    return await res.json();
}

export async function updateTransportMethod(id: DataModelId, updated: Partial<TransportMethod>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/transport-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update transport method');
}

export async function deleteTransportMethod(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/transport-methods/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete transport method');
}