import { DataModelId } from './data_models';
import { Payment } from './data_models';

import { API_BASE_URL } from './config';

export async function getPayments(): Promise<Payment[]> {
    const res = await fetch(`${API_BASE_URL}/payments`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return await res.json();
}

export async function getPayment(id: DataModelId): Promise<Payment> {
    const res = await fetch(`${API_BASE_URL}/payments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return await res.json();
}

export async function createPayment(newPayment: Omit<Payment, 'id'>): Promise<Payment> {
    const res = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
    });
    if (!res.ok) throw new Error(`Failed to create payment: ${(await res?.text())}`);
    return await res.json();
}

export async function updatePayment(id: DataModelId, updated: Partial<Payment>): Promise<Payment> {
    const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update payment');
    return await res.json();
}

export async function deletePayment(id: DataModelId): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete payment');
}