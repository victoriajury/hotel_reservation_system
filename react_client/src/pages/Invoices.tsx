import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getInvoices } from '../data/invoices';
import { Invoice } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';


export async function loader() {
  const invoices = await getInvoices();
  return { invoices };
}

const invoiceColumns = [
  { key: 'reservation_id', label: 'Booking No.' },
  { 
    key: 'amount_paid', 
    label: 'Amount Paid',
    render: (invoice: Invoice) =>
      '\u00A3 ' + String(invoice.amount_paid.toFixed(2)),
  },
  {
    key: 'modified',
    label: 'Last Modified',
    render: (invoice: Invoice) =>
      new Date(invoice.modified).toLocaleString(),
  },
];

export default function InvoicesPage() {
  const { invoices } = useLoaderData();
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
          Invoices
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
      <DataTable data={invoices} columns={invoiceColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}