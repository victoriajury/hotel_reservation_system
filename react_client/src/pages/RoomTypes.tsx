import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getRoomTypes } from '../data/room_types';
import { RoomType } from '../data/data_models';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable, { TableColumn } from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';


export async function loader() {
  const roomTypes = await getRoomTypes();
  return { roomTypes };
}

const BASE_URL = 'http://127.0.0.1:5000';

export default function RoomTypesPage() {
  const { roomTypes } = useLoaderData() as {roomTypes: RoomType[] };

  const roomTypesColumns: TableColumn<RoomType>[] = [
    {
      key: 'photo',
      label: 'Image',
      numeric: false,
      render: (roomTypes: RoomType) =>
        <Avatar size="lg" src={`${BASE_URL}/img/hotel_rooms/${roomTypes.photo}`} style={{ borderRadius: "5px" }} />,
    },
    { key: 'type_name', label: 'Room Type Name', numeric: false, },
    {
      key: 'base_price_per_night',
      label: 'Price',
      numeric: true,
      render: (roomTypes: RoomType) =>
        '\u00A3 ' + String(roomTypes.base_price_per_night.toFixed(2)),
    },
    { key: 'amenities', label: 'Amenities', numeric: false, },
    { key: 'max_occupants', label: 'Max. Occupants', numeric: true, },
    {
      key: 'modified',
      label: 'Last Modified',
      numeric: false,
      render: (roomTypes: RoomType) =>
        new Date(roomTypes.modified).toLocaleString(),
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
          Room Types
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
      <DataTable data={roomTypes} columns={roomTypesColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}