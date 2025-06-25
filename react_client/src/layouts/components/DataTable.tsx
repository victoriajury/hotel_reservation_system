/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { DataModelId, DataModel } from '../../data/data_models';

import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';

import DataTableSearchFilters from './DataTableSearchFilters';
// import DataTableRowActions from './DataTableRowActions';

export interface TableColumn<T> {
  key: keyof DataModel;
  label: string;
  numeric: boolean;
  width?: number;
  disablePadding?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends DataModel> {
  data: T[];
  columns: TableColumn<T>[];
  objName?: string;
  editPath?: string;
  onDelete?: (id: DataModelId) => void;
}


function labelDisplayedRows({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}) {
  return `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<T>(
  order: Order,
  orderBy: keyof T,
): (
  a: T,
  b: T,
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface EnhancedTableProps<T extends DataModel> {
  columns: TableColumn<T>[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DataModel) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead<T extends DataModel>(props: EnhancedTableProps<T>) {
  const { columns, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof DataModel) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <thead >
      <tr>
        <th>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                'aria-label': 'select all desserts',
              },
            }}
          // sx={{ verticalAlign: '' }}
          />
        </th>
        {columns.map((headCell) => {
          const active = orderBy === headCell.key;
          return (
            <th
              key={headCell.key as string}
              aria-sort={
                active
                  ? ({ asc: 'ascending', desc: 'descending' } as const)[order]
                  : undefined
              }
              // set default width if none set
              style={headCell.width ? { width: headCell.width, padding: '12px 6px' } : { minWidth: 120, padding: '12px 6px' }}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link
                underline="none"
                color="neutral"
                textColor={active ? 'primary.plainColor' : undefined}
                component="button"
                onClick={createSortHandler(headCell.key)}
                endDecorator={
                  <ArrowDownwardIcon
                    sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                  />
                }
                sx={{
                  fontWeight: 'lg',
                  '& svg': {
                    transition: '0.2s',
                    transform:
                      active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  },
                  '&:hover': { '& svg': { opacity: 1 } },
                }}
              >
                {headCell.label}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}


interface EnhancedTableToolbarProps {
  numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          py: 1,
          // pl: { sm: 2 },
          // pr: { xs: 1, sm: 1 },
          borderRadius: 'sm'
        },
        numSelected > 0 && {
          bgcolor: 'background.level1',
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography level='body-sm' sx={{ flex: '1 1 100%', pl: 2 }} component="div">
          {numSelected} selected
        </Typography>
      ) : (

        <DataTableSearchFilters />

      )}
      {numSelected > 0 && (
        // TODO: if delete, show button, or bulk set status
        <Tooltip title="Delete">
          <IconButton size="sm" color="danger" variant="solid" sx={{mr: 1}}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}


export default function DataTable<T extends DataModel>({ data, columns }: DataTableProps<T>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DataModel>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DataModel,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => String(n.id));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event: React.MouseEvent<unknown>, id: DataModelId) => {
    const selectedIndex = selected.indexOf(String(id));
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, String(id));
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };
  const getLabelDisplayedRowsTo = () => {
    if (data.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? data.length
      : Math.min(data.length, (page + 1) * rowsPerPage);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  return (
    <React.Fragment>
      <EnhancedTableToolbar numSelected={selected.length} />
      <Sheet
        variant="outlined"
        sx={{
          width: '100%',
          boxShadow: 'sm',
          borderRadius: 'sm',
          overflow: 'auto'
        }}
      >

        <Table
          aria-labelledby="tableTitle"
          hoverRow
          stickyHeader
          stickyFooter
          sx={{
            '--TableCell-selectedBackground': (theme) =>
              theme.vars.palette.success.softBg,
            '& thead th:nth-of-type(1)': {
              width: '40px',
            }
          }}
        >
          <EnhancedTableHead
            columns={columns}
            numSelected={selected.length}
            order={order}
            orderBy={String(orderBy)}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <tbody>
            {[...data]
              .sort(getComparator<T>(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = selected.includes(String(row.id));
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <tr
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id as number}
                    // selected={isItemSelected}
                    style={
                      isItemSelected
                        ? ({
                          '--TableCell-dataBackground':
                            'var(--TableCell-selectedBackground)',
                          '--TableCell-headBackground':
                            'var(--TableCell-selectedBackground)',
                        } as React.CSSProperties)
                        : {}
                    }
                  >
                    <th scope="row">
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                        sx={{ verticalAlign: 'top' }}
                      />
                    </th>
                    {columns.map((col) => (
                      <td key={col.key as string}>
                        <Typography level="body-xs">
                          {col.render ? col.render(row) : String(row[col.key])}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                );
              })}
            {emptyRows > 0 && (
              <tr
                style={
                  {
                    height: `calc(${emptyRows} * 40px)`,
                    '--TableRow-hoverBackground': 'transparent',
                  } as React.CSSProperties
                }
              >
                <td colSpan={columns.length + 1} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={columns.length + 1}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
                    {labelDisplayedRows({
                      from: data.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: data.length === -1 ? -1 : data.length,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        data.length !== -1
                          ? page >= Math.ceil(data.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
