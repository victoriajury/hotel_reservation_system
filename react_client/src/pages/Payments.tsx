import * as React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { getPayments } from '../data/payments';
import { Payment } from '../data/data_models';

import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable, { TableColumn } from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';

export async function loader() {
  const payments = await getPayments();
  return { payments };
}

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { payments } = useLoaderData() as { payments: Payment[] };

  const paymentColumns: TableColumn<Payment>[] = [
    {
      key: 'invoice_id',
      label: 'Invoice No.',
      numeric: true,
      width: 150,
      render: (payment: Payment) =>
        <Link onClick={() => navigate(`/invoices/${payment.invoice_id}`)}>
          #INV-{String(payment.invoice_id).padStart(5, '0')}
        </Link>
    },
    {
      key: 'reservation_id',
      label: 'Booking No.',
      numeric: true,
      width: 150,
      render: (payment: Payment) =>
        <Link onClick={() => navigate(`/reservations/${payment.reservation_id}`)}>
          #{String(payment.reservation_id).padStart(5, '0')}
        </Link>
    },
    {
      key: 'entered_date',
      label: 'Date',
      numeric: false,
      width: 150,
      render: (payment: Payment) =>
        new Date(payment.entered_date).toLocaleDateString(),
    },
    {
      key: 'guest_name',
      label: 'Guest',
      numeric: false,
      width: 260,
      render: (payment: Payment) =>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar size="sm">{payment.guest_name?.charAt(0)}</Avatar>
          <div>
            <Typography level="body-xs">
              <Link onClick={() => navigate(`/guest-profile/${payment.guest_id}`)}>
                {payment.guest_name}
              </Link>
            </Typography><br />
            <Typography level="body-xs">{payment.guest_email}</Typography>
          </div>
        </Box>
    },
    {
      key: 'amount',
      label: 'Total',
      numeric: true,
      width: 150,
      render: (payment: Payment) =>
        '\u00A3 ' + String(payment.amount.toFixed(2)),
    },
    {
      key: 'modified',
      label: 'Last Modified',
      numeric: false,
      width: 150,
      render: (payment: Payment) =>
        new Date(payment.modified).toLocaleString(),
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
      <DataTable data={payments} objName='Payment' columns={paymentColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}