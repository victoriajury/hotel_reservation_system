import * as React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { getInvoices } from '../data/invoices';
import { Invoice } from '../data/data_models';

import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';


export async function loader() {
  const invoices = await getInvoices();
  return { invoices };
}

export default function InvoicesPage() {
  const { invoices } = useLoaderData() as { invoices: Invoice[] }
  const navigate = useNavigate();


  const invoiceColumns = [
    {
      key: 'id',
      label: 'Invoice No.',
      width: 120,
      render: (invoice: Invoice) =>
        <Link onClick={() => navigate(`/invoices/${invoice.id}`)}>
          #INV-{String(invoice.id).padStart(5, '0')}
        </Link>
    },
    {
      key: 'reservation_id',
      label: 'Booking No.',
      width: 120,
      render: (invoice: Invoice) =>
        <Link onClick={() => navigate(`/reservations/${invoice.reservation_id}`)}>
          #{String(invoice.reservation_id).padStart(5, '0')}
        </Link>
    },
    {
      key: 'created',
      label: 'Date',
      width: 120,
      render: (invoice: Invoice) =>
        new Date(invoice.created).toLocaleDateString(),
    },
    {
      key: 'guest_name',
      label: 'Guest',
      width: 260,
      render: (invoice: Invoice) =>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar size="sm">{invoice.guest_name.charAt(0)}</Avatar>
          <div>
            <Typography level="body-xs"><Link onClick={() => navigate(`/guest-profile/${invoice.guest_id}`)}>{invoice.guest_name}</Link></Typography><br />
            <Typography level="body-xs">{invoice.guest_email}</Typography>
          </div>
        </Box>
    },
    {
      key: 'invoice_total',
      label: 'Total',
      width: 120,
      render: (invoice: Invoice) =>
        '\u00A3 ' + String((invoice.invoice_total).toFixed(2)),
    },
    {
      key: 'amount_paid',
      label: 'Outstanding',
      width: 120,
      render: (invoice: Invoice) => {
        const outstanding = invoice.invoice_total - invoice.amount_paid;
        return (<Typography color={outstanding > 0 ? 'danger' : 'neutral'}>
          &pound; {String((outstanding).toFixed(2))}
        </Typography>)
      }
    },
    {
      key: 'modified',
      label: 'Last Modified',
      width: 120,
      render: (invoice: Invoice) =>
        new Date(invoice.modified).toLocaleString(),
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
      <DataTable data={invoices} objName='Invoice' columns={invoiceColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}