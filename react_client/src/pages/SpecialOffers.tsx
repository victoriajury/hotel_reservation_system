import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getSpecialOffers } from '../data/special_offers';
import { SpecialOffer } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Switch from '@mui/joy/Switch';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable, { TableColumn } from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const offers = await getSpecialOffers();
  return { offers };
}

export default function SpecialOffersPage() {
  const { offers } = useLoaderData() as { offers: SpecialOffer[] };

  const offerColumns: TableColumn<SpecialOffer>[] = [
    { key: 'title', label: 'Offer Title', numeric: false, width: 250 },
    { key: 'room_type_name', label: 'Room Type', numeric: false, width: 120 },
    {
      key: 'price_per_night',
      label: 'Price (per night)',
      numeric: true,
      width: 130,
      render: (offer: SpecialOffer) =>
        '\u00A3 ' + String(offer.price_per_night.toFixed(2)),
    },
    {
      key: 'start_date',
      label: 'Start Date',
      numeric: false,
      width: 120,
      render: (offer: SpecialOffer) =>
        new Date(offer.modified).toDateString(),
    },
    {
      key: 'end_date',
      label: 'End Date',
      numeric: false,
      width: 120,
      render: (offer: SpecialOffer) =>
        new Date(offer.modified).toDateString(),
    },
    {
      key: 'is_enabled',
      label: 'Active',
      numeric: false,
      width: 80,
      render: (offer: SpecialOffer) =>
        // TODO: switch is_enabled state from the datatable view
        <Switch size='sm'
          checked={offer.is_enabled}
        />
    },
    {
      key: 'modified',
      label: 'Last Modified',
      numeric: false,
      width: 120,
      render: (offer: SpecialOffer) =>
        new Date(offer.modified).toLocaleString(),
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
          Special Offers
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
      <DataTable data={offers} objName="Offer" columns={offerColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}