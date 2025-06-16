import * as React from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';
import { getGuests, deleteGuest } from '../data/guests';
import { Guest, DataModelId } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const guests = await getGuests();
  return { guests };
}

export default function GuestsPage() {
  const navigate = useNavigate();
  const { guests } = useLoaderData();
  const { revalidate } = useRevalidator();

  const handleDelete = async (id: DataModelId) => {
    await deleteGuest(id.toString());
    revalidate();
  };

  const guestColumns = [
    {
      key: 'name',
      label: 'Name',
      width: 150,
      render: (guest: Guest) =>
        <Link onClick={() => navigate(`/guest-profile/${guest.id}`)}>{guest.name}</Link>
    },
    {
      key: 'email',
      label: 'Email',
      width: 200,
      render: (guest: Guest) =>
        <Link onClick={e => { e.preventDefault(); window.open(`mailto:${guest.email}`); }}>{guest.email}</Link>
    },
    { key: 'telephone', label: 'Phone', width: 150 },
    { key: 'city', label: 'City', width: 120 },
    {
      key: 'guest_notes',
      label: 'Notes',
      width: 150,
      render: (guest: Guest) =>
        guest.guest_notes ? guest.guest_notes : ' - '
    },
    {
      key: 'modified',
      label: 'Last Modified',
      width: 150,
      render: (guest: Guest) =>
        new Date(guest.modified).toLocaleString(),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2" component="h1">
          Guests
        </Typography>
        <Button
          onClick={() => navigate('/guest-profile/new')}
          color="primary"
          startDecorator={<PersonAddAltRoundedIcon />}
          size="sm"
        >
          Add Guest
        </Button>
      </Box>
      {/* Desktop View */}
      <DataTable data={guests} columns={guestColumns} editPath='/guest-profile' onDelete={handleDelete} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}