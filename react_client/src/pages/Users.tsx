import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import { getUsers } from '../data/users';
import { User } from '../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import DataTable, { TableColumn } from '../layouts/components/DataTable';
import DataList from '../layouts/components/DataList';


export async function loader() {
  const users = await getUsers();
  return { users };
}

export default function UsersPage() {
  const { users } = useLoaderData() as { users: User[]};

const usersColumns: TableColumn<User>[] = [
  { key: 'username', label: 'Username', numeric: false },
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
          Users
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
      <DataTable data={users} columns={usersColumns} />
      {/* Mobile View */}
      <DataList />
    </>
  );
}