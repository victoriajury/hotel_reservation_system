import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getSpecialOffers } from '../data/special_offers';
import { SpecialOffer } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Switch from '@mui/joy/Switch';
import Typography from '@mui/joy/Typography';


import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const offers = await getSpecialOffers();
  return { offers };
}


const offerColumns = [
  { key: 'title', label: 'Offer Title', width: 250 },
  { key: 'room_type_name', label: 'Room Type', width: 120 },
  {
    key: 'price_per_night',
    label: 'Price (per night)',
    width: 130,
    render: (offer: SpecialOffer) =>
      '\u00A3 ' + String(offer.price_per_night.toFixed(2)),
  },
  {
    key: 'start_date',
    label: 'Start Date',
    width: 120,
    render: (offer: SpecialOffer) =>
      new Date(offer.modified).toDateString(),
  },
  {
    key: 'end_date',
    label: 'End Date',
    width: 120,
    render: (offer: SpecialOffer) =>
      new Date(offer.modified).toDateString(),
  },
  {
    key: 'is_enabled',
    label: 'Active',
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
    width: 120,
    render: (offer: SpecialOffer) =>
      new Date(offer.modified).toLocaleString(),
  },
];

export default function SpecialOffersPage() {
  const { offers } = useLoaderData();
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