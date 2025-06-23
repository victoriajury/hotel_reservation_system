
import { Reservation } from '../../data/data_models';

import Chip from '@mui/joy/Chip';

import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';


export default function StatusChip({ reservation }: { reservation: Reservation }) {
  const statusIcons = {
    "Paid in Full": <CheckRoundedIcon />,
    "Pending": <HourglassTopRoundedIcon />,
    "Confirmed": <InventoryRoundedIcon />,
    "Cancelled": <BlockIcon />,
    "Checked-in": <LoginRoundedIcon />
  }
  
  return (
    <Chip
      variant="soft"
      size="sm"
      startDecorator={
          statusIcons[(reservation.status || '') as keyof typeof statusIcons]
      }
      sx={{
          background: (reservation.status_color) + 'aa' /* with opacity set for dark mode */
      }}
    >
      {reservation.status}
    </Chip>
  )
}