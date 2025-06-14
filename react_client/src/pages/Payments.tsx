import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getPayments } from '../data/payments';
import { Payment } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const payments = await getPayments();
  return { payments };
}

const paymentColumns = [
  { key: 'invoice_id', label: 'Invoice No.' },
  { 
    key: 'amount', 
    label: 'Total',
    render: (payment: Payment) =>
      '\u00A3 ' + String(payment.amount.toFixed(2)),
  },
  {
    key: 'modified',
    label: 'Last Modified',
    render: (payment: Payment) =>
      new Date(payment.modified).toLocaleString(),
  },
];

export default function PaymentsPage() {
  const { payments } = useLoaderData();
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
          Payments
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
      <DataTable data={payments} columns={paymentColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}