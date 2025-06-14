import { DataModelId } from './data_models';
import { Invoice } from './data_models';

import { API_BASE_URL } from './config';

export async function getInvoices(): Promise<Invoice[]> {
    const res = await fetch(`${API_BASE_URL}/invoices`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return await res.json();
}

export async function getInvoice(id: DataModelId): Promise<Invoice> {
    const res = await fetch(`${API_BASE_URL}/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return await res.json();
}

export async function createInvoice(newInvoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const res = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
    });
    if (!res.ok) throw new Error(`Failed to create invoice: ${(await res?.text())}`);
    return await res.json();
}

export async function updateInvoice(id: DataModelId, updated: Partial<Invoice>): Promise<Invoice> {
    const res = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update invoice');
    return await res.json();
}

export async function deleteInvoice(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete invoice');
}