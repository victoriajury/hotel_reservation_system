import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getGuests } from '../data/guests';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

import { Guest } from '../data/data_models';

export async function loader() {
  const guests = await getGuests();
  return { guests };
}

const guestColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'telephone', label: 'Phone' },
  { key: 'city', label: 'City' },
  {
    key: 'modified',
    label: 'Last Modified',
    render: (guest: Guest) =>
      new Date(guest.modified).toLocaleString(),
  },
];

export default function GuestsPage() {
  const { guests } = useLoaderData();
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
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
          {guests.length} guests found
        </Typography>
      </Box>
      {/* Desktop View */}
      <DataTable data={guests} columns={guestColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}