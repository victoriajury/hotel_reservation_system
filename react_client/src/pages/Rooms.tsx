import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getRooms } from '../data/rooms';
import { Room } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const rooms = await getRooms();
  return { rooms };
}

const roomsColumns = [
  { key: 'room_number', label: 'Room No.' },
  { key: 'room_type_name', label: 'Room Type' },
  {
    key: 'modified',
    label: 'Last Modified',
    render: (rooms: Room) =>
      new Date(rooms.modified).toLocaleString(),
  },
];

export default function RoomsPage() {
  const { rooms } = useLoaderData();
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
          Rooms
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
      <DataTable data={rooms} columns={roomsColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}