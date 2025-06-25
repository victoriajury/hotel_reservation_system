
import * as React from 'react';

import { getReservationStatuses } from '../../data/reservation_status';
import { DataModel, ReservationStatus } from '../../data/data_models';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { TableColumn } from './DataTable';

interface DataTableSearchFiltersProps<T extends DataModel> {
  columns: TableColumn<T>[];
  onFilterChange?: (selectedValue: string) => void;
}

export async function getReservationStatusesList() {
  const statuses = await getReservationStatuses();
  return statuses;
}


export default function DataTableSearchFilters<T extends DataModel>({ columns, onFilterChange }: DataTableSearchFiltersProps<T>) {
  const [open, setOpen] = React.useState(false);
  const hasStatusColumn: boolean = columns.some((col) => col.key === 'status');
  const hasDateColumns: boolean = columns.some((col) => col.key.toString().includes('date') || col.key.toString().includes('created'));
  const [statusOptions, setStatusOptions] = React.useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  React.useEffect(() => {
    if (hasStatusColumn) {
      getReservationStatusesList()
        .then((statuses: ReservationStatus[]) =>
          setStatusOptions(statuses.map((s) => s.status))
        );
    }
  }, [hasStatusColumn]);

  const createFilterHandler = (status: string) => {
    setSelectedStatus(status ?? '');
    onFilterChange && onFilterChange(status ?? '');
  }

  const renderFilters = () => (
    <React.Fragment>
      {hasStatusColumn &&
        <FormControl size="sm">
          <FormLabel sx={{ minWidth: 40 }}>Status:</FormLabel>
          <Select
            size="sm"
            placeholder="Filter by status"
            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            value={selectedStatus}
            onChange={(_, value) => createFilterHandler(value ?? 'all')}
          >
            <Option value="all">All</Option>
            {statusOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </FormControl>}

      {hasDateColumns &&
        <React.Fragment>
          <FormControl size="sm">
            <FormLabel sx={{ minWidth: 40 }}>Start Date:</FormLabel>
            <Input size="sm" type='date' placeholder="Start Date" />
          </FormControl>
          <FormControl size="sm">
            <FormLabel sx={{ minWidth: 40 }}>End Date:</FormLabel>
            <Input size="sm" type='date' placeholder="End Date" />
          </FormControl>
        </React.Fragment>}
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          // py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl size="sm">
          <FormLabel sx={{ minWidth: 40 }}>Search:</FormLabel>
          <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>
    </React.Fragment>
  )

}
