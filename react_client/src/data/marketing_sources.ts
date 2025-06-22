import { DataModelId } from './data_models';
import { MarketingSource } from './data_models';

import { API_BASE_URL } from './config';

export async function getMarketingSources(): Promise<MarketingSource[]> {
    const res = await fetch(`${API_BASE_URL}/marketing-sources`);
    if (!res.ok) throw new Error('Failed to fetch marketing sources');
    return await res.json();
}

export async function getMarketingSource(id: DataModelId): Promise<MarketingSource> {
    const res = await fetch(`${API_BASE_URL}/marketing-sources/${id}`);
    if (!res.ok) throw new Error('Failed to fetch marketing source');
    return await res.json();
}

export async function createMarketingSource(newMarketingSource: Omit<MarketingSource, 'id'>): Promise<MarketingSource> {
    const res = await fetch(`${API_BASE_URL}/marketing-sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMarketingSource),
    });
    if (!res.ok) throw new Error(`Failed to create marketing source: ${(await res?.text())}`);
    return await res.json();
}

export async function updateMarketingSource(id: DataModelId, updated: Partial<MarketingSource>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/marketing-sources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update marketing source');
}

export async function deleteMarketingSource(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/marketing-sources/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete marketing source');
}