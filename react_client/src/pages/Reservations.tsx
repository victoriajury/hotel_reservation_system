import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getReservations } from '../data/reservations';
import { Reservation } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const reservations = await getReservations();
  return { reservations };
}

const reservationsColumns = [
  { 
    key: 'start_date',
    label: 'Check-In',
    render: (guest: Reservation) =>
      new Date(guest.modified).toLocaleString(),
  }, 
  { 
    key: 'end_date',
    label: 'Check-Out',
    render: (guest: Reservation) =>
      new Date(guest.modified).toLocaleString(),
  },
  { key: 'status', label: 'Status' },
  { key: 'total_room_base_price', label: 'Price' },
  {
    key: 'modified',
    label: 'Last Modified',
    render: (guest: Reservation) =>
      new Date(guest.modified).toLocaleString(),
  },
];

export default function ReservationsPage() {
  const { reservations } = useLoaderData();
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
          Reservations
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>
      {/* Desktop View */}
      <DataTable data={reservations} columns={reservationsColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}