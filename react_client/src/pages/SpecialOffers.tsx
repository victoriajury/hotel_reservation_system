import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getSpecialOffers } from '../data/special_offers';
import { SpecialOffer } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const offers = await getSpecialOffers();
  return { offers };
}

const offerColumns = [
  { key: 'title', label: 'Offer' },
  { key: 'room_type_name', label: 'Room Type' },
  {
    key: 'price_per_night',
    label: 'Price',
    render: (offer: SpecialOffer) =>
      '\u00A3 ' + String(offer.price_per_night.toFixed(2)),
  },
  {
    key: 'start_date',
    label: 'Start Date',
    render: (offer: SpecialOffer) =>
      new Date(offer.modified).toLocaleDateString(),
  },
  {
    key: 'end_date',
    label: 'End Date',
    render: (offer: SpecialOffer) =>
      new Date(offer.modified).toLocaleDateString(),
  },
  {
    key: 'modified',
    label: 'Last Modified',
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
      <DataTable data={offers} columns={offerColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}