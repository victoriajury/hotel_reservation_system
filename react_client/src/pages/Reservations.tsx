import * as React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { getReservations } from '../data/reservations';
import { Reservation } from '../data/data_models';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';

import StatusChip from '../layouts/components/StatusChip';
import DataTable, { TableColumn } from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';


export async function loader() {
  const reservations = await getReservations();
  return { reservations };
}

export default function ReservationsPage() {
  const navigate = useNavigate();
  const { reservations } = useLoaderData() as { reservations: Reservation[] };

  const reservationsColumns: TableColumn<Reservation>[] = [
    {
      key: 'id',
      label: 'Booking No.',
      numeric: true,
      width: 120,
      render: (reservation: Reservation) =>
        <Link onClick={() => navigate(`/reservations/${reservation.id}`)}>
          #{String(reservation.id).padStart(5, '0')}
        </Link>
    },
    {
      key: 'start_date',
      label: 'Check-In',
      numeric: false,
      width: 120,
      render: (reservation: Reservation) =>
        new Date(reservation.start_date).toLocaleDateString(),
    },
    {
      key: 'end_date',
      label: 'Check-Out',
      numeric: false,
      width: 120,
      render: (reservation: Reservation) =>
        new Date(reservation.end_date).toLocaleDateString(),
    },
    {
      key: 'guest_name',
      label: 'Guest',
      numeric: false,
      width: 260,
      render: (reservation: Reservation) =>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar size="sm">{reservation.guest_name?.charAt(0)}</Avatar>
          <div>
            <Typography level="body-xs"><Link onClick={() => navigate(`/guest-profile/${reservation.guest_id}`)}>{reservation.guest_name}</Link></Typography><br />
            <Typography level="body-xs">{reservation.guest_email}</Typography>
          </div>
        </Box>
    },
    {
      key: 'status',
      label: 'Status',
      numeric: false,
      width: 130,
      render: (reservation: Reservation) =>
        <StatusChip reservation={reservation} />
    },
    {
      key: 'computed_total_price',
      label: 'Room Cost',
      numeric: true,
      width: 120,
      render: (reservation: Reservation) => 
        '\u00A3 ' + String((reservation.computed_total_price).toFixed(2)),
    },
    {
      key: 'guest_transport_method',
      label: 'Arriving By',
      numeric: false,
      width: 120,
    },
    {
      key: 'modified',
      label: 'Last Modified',
      numeric: false,
      width: 130,
      render: (reservation: Reservation) =>
        new Date(reservation.modified).toLocaleString(),
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
          Reservations
        </Typography>
        <Button
          onClick={() => navigate('/reservations/new')}
          color="primary"
          startDecorator={<LibraryAddRoundedIcon />}
          size="sm"
        >
          New Booking
        </Button>
      </Box>
      {/* Desktop View */}
      <DataTable data={reservations} objName='Reservation' columns={reservationsColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}