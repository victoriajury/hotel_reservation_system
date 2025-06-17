import { DataModelId } from './data_models';
import { SpecialOffer } from './data_models';

import { API_BASE_URL } from './config';

export async function getSpecialOffers(): Promise<SpecialOffer[]> {
    const res = await fetch(`${API_BASE_URL}/special-offers`);
    if (!res.ok) throw new Error('Failed to fetch special offers');
    return await res.json();
}

export async function getSpecialOffer(id: DataModelId): Promise<SpecialOffer> {
    const res = await fetch(`${API_BASE_URL}/special-offers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch special offer');
    return await res.json();
}

export async function createSpecialOffer(newSpecialOffer: Omit<SpecialOffer, 'id'>): Promise<SpecialOffer> {
    const res = await fetch(`${API_BASE_URL}/special-offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpecialOffer),
    });
    if (!res.ok) throw new Error(`Failed to create special offer: ${(await res?.text())}`);
    return await res.json();
}

export async function updateSpecialOffer(id: DataModelId, updated: Partial<SpecialOffer>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/special-offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update special offer');
}

export async function deleteSpecialOffer(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/special-offers/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete special offer');
}