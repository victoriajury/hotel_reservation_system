'use client';
import { DataModel, DataModelId, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';


export interface Guest extends DataModel {
  id: number;
  name: string;
  email: string;
  telephone: string;
  address_1: string;
  address_2: string;
  city: string;
  county: string;
  postcode: string;
  guest_notes: string;
  modified: string;
}

// Base URL for Flask API
const BASE_URL = 'http://localhost:5000/api';

export async function getGuests(): Promise<Guest[]> {
  const res = await fetch(`${BASE_URL}/guests`);
  if (!res.ok) throw new Error('Failed to fetch guests');
  return await res.json();
}

export async function getGuest(id: DataModelId): Promise<Guest> {
  const res = await fetch(`${BASE_URL}/guests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch guests');
  return await res.json();
}

export async function createGuest(newGuest: Omit<Guest, 'id'>): Promise<Guest> {
  const res = await fetch(`${BASE_URL}/guests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGuest),
  });
  if (!res.ok) throw new Error(`Failed to create guest: ${(await res?.text())}`);
  return await res.json();
}

export async function updateGuest(id: DataModelId, updated: Partial<Guest>): Promise<Guest> {
  const res = await fetch(`${BASE_URL}/guests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error('Failed to update guest');
  return await res.json();
}

export async function deleteGuest(id: DataModelId): Promise<void> {
  const res = await fetch(`${BASE_URL}/guests/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete guest');
}


export const guestsDataSource: DataSource<Guest> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'email', headerName: 'Email', width: 200, flex: 1 },
    { field: 'telephone', headerName: 'Telephone', width: 140 },
    { field: 'address_1', headerName: 'Address 1', width: 140 },
    { field: 'address_2', headerName: 'Address 2', width: 140 },
    { field: 'city', headerName: 'City', width: 140 },
    { field: 'county', headerName: 'County', width: 140 },
    { field: 'postcode', headerName: 'Postcode', width: 140 },
    { field: 'guest_notes', headerName: 'Notes', width: 200, flex: 1 },
    { field: 'modified', headerName: 'Date last modified', width: 225 },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    const guestsStore = await getGuests();

    let filteredGuests = [...guestsStore];

    // Apply filters (example only)
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }

        filteredGuests = filteredGuests.filter((guest) => {
          const guestValue = guest[field];

          switch (operator) {
            case 'contains':
              return String(guestValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return guestValue === value;
            case 'startsWith':
              return String(guestValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(guestValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return (guestValue as number) > value;
            case '<':
              return (guestValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortModel?.length) {
      filteredGuests.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if ((a[field] as number) < (b[field] as number)) {
            return sort === 'asc' ? -1 : 1;
          }
          if ((a[field] as number) > (b[field] as number)) {
            return sort === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedGuests = filteredGuests.slice(start, end);

    return {
      items: paginatedGuests,
      itemCount: filteredGuests.length,
    };
  },
  getOne: async (guestId) => {
    const guestsStore = await getGuest(guestId);

    if (!guestsStore) {
      throw new Error('Guest not found');
    }
    return guestsStore;
  },
  createOne: async (data) => {
    const newGuest = {
      ...data,
    } as Guest;

    const res = createGuest(newGuest);
    if (!res) {
      throw new Error('Guest not created.');
    }

    return newGuest;
  },
  updateOne: async (guestId, data) => {
    let updatedGuest: Guest | null = null;

    updatedGuest = {
      ...data,
    } as Guest;

    updateGuest(guestId, updatedGuest);

    if (!updatedGuest) {
      throw new Error('Guest not found');
    }
    return updatedGuest;
  },
  deleteOne: async (guestId) => {

    deleteGuest(guestId);
  },
  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    email: z.string({ required_error: 'Email is required' }).nonempty('Email is required'),
    telephone: z.string({ required_error: 'Telephone is required' }).nonempty('Telephone is required'),
    address_1: z.string({ required_error: 'Address 1 is required' }).nonempty('Address 1 is required'),
    address_2: z.string({ required_error: 'Address 2 is required' }).nonempty('Address 2 is required'),
    city: z.string({ required_error: 'City is required' }).nonempty('City is required'),
    county: z.string({ required_error: 'County is required' }).nonempty('County is required'),
    postcode: z.string({ required_error: 'Postcode is required' }).nonempty('Postcode is required'),
  })['~standard'].validate,
};

export const guestsCache = new DataSourceCache();
