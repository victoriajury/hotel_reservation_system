import * as React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { getReservations } from '../data/reservations';
import { getReservationStatuses } from '../data/reservation_status';
import { Reservation, ReservationStatus } from '../data/data_models';
import { dateDiff } from '../utils';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const reservations = await getReservations();
  const statuses = await getReservationStatuses();

  return { reservations, statuses };
}

export default function ReservationsPage() {
  const navigate = useNavigate();
  const { reservations, statuses } = useLoaderData() as { reservations: Reservation[]; statuses: ReservationStatus[] };

  const statusIcons = {
    "Paid in Full": <CheckRoundedIcon />,
    "Pending": <HourglassTopRoundedIcon />,
    "Confirmed": <InventoryRoundedIcon />,
    "Cancelled": <BlockIcon />,
    "Checked-in": <LoginRoundedIcon />
  }

  const reservationsColumns = [
    {
      key: 'id',
      label: 'Booking No.',
      width: 120,
      render: (reservation: Reservation) =>
        <Link onClick={() => navigate(`/reservations/${reservation.id}`)}>
          #{String(reservation.id).padStart(5, '0')}
        </Link>
    },
    {
      key: 'start_date',
      label: 'Check-In',
      width: 120,
      render: (reservation: Reservation) =>
        new Date(reservation.start_date).toLocaleDateString(),
    },
    {
      key: 'end_date',
      label: 'Check-Out',
      width: 120,
      render: (reservation: Reservation) =>
        new Date(reservation.end_date).toLocaleDateString(),
    },
    {
      key: 'guest_name',
      label: 'Guest',
      width: 260,
      render: (reservation: Reservation) =>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar size="sm">{reservation.guest_name.charAt(0)}</Avatar>
          <div>
            <Typography level="body-xs"><Link onClick={() => navigate(`/guest-profile/${reservation.guest_id}`)}>{reservation.guest_name}</Link></Typography><br />
            <Typography level="body-xs">{reservation.guest_email}</Typography>
          </div>
        </Box>
    },
    {
      key: 'status',
      label: 'Status',
      width: 130,
      render: (reservation: Reservation) =>
        <Chip
          variant="soft"
          size="sm"
          startDecorator={
            statusIcons[
              (statuses.find((status: ReservationStatus) => status.status === reservation.status)?.status || '') as keyof typeof statusIcons
            ]
          }
          sx={{
            background: (
              statuses.find((status: ReservationStatus) => status.status === reservation.status)?.bg_color + 'aa' /* with opacity set for dark mode */
            )
          }}
        >
          {reservation.status}
        </Chip>
    },
    {
      key: 'total_room_base_price',
      label: 'Price',
      render: (reservation: Reservation) =>
        '\u00A3 ' + String((dateDiff(reservation.start_date, reservation.end_date) * reservation.rooms.reduce((sum, room) => sum + room.base_price_per_night_charged, 0)).toFixed(2))
    },
    {
      key: 'guest_transport_method',
      label: 'Arriving By'
    },
    {
      key: 'modified',
      label: 'Last Modified',
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