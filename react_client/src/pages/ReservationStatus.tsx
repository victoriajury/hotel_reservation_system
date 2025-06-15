import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getReservationStatuses } from '../data/reservation_statuses';
import { ReservationStatus } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const statuses = await getReservationStatuses();
  return { statuses };
}

const resStatusColumns = [
  {
    key: 'status',
    label: 'Status',
    render: (status: ReservationStatus) =>
      <Typography startDecorator={<SquareRoundedIcon htmlColor={status.bg_color} style={{ fontSize: "24px" }} />} >{status.status}</Typography>
  },
  { key: 'description', label: 'Description' },
];

export default function ReservationStatusPage() {
  const { statuses } = useLoaderData();
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
          Reservation Statuses
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
      <DataTable data={statuses} columns={resStatusColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}