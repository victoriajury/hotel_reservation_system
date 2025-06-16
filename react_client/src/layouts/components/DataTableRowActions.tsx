import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataModelId } from '../../data/data_models';

import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Modal from '@mui/joy/Modal';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import ModalDelete from './ModalDelete';

interface RowActionProps {
  id: DataModelId;
  objName: string;
  editPath?: string;
  onDelete?: (id: DataModelId) => void;
}

export default function DataTableRowActions({ id, objName, editPath, onDelete }: RowActionProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          <MenuItem onClick={() => navigate(editPath + `/${id}`)}>Edit</MenuItem>
          {onDelete &&
            <React.Fragment>
              <Divider />
              <MenuItem onClick={() => setOpen(true)} color="danger">Delete</MenuItem>
            </React.Fragment>
          }
        </Menu>
      </Dropdown>
      {onDelete &&
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDelete id={id} objName={objName} onDelete={onDelete} setOpen={setOpen} />
      </Modal>
      }
    </React.Fragment>
  );
}