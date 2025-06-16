import * as React from 'react';
import { DataModelId } from '../../data/data_models';

import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface ModalProps {
  id: DataModelId;
  onDelete: (id: DataModelId) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalDelete({ id, onDelete, setOpen }: ModalProps) {
  return (
    <ModalDialog variant="outlined" role="alertdialog">
      <DialogTitle>
        <DeleteRoundedIcon />
        Delete Guest
      </DialogTitle>
      <Divider />
      <DialogContent>
        Are you sure you want to delete this guest?
      </DialogContent>
      <DialogActions>
        <Button variant="solid" color="danger" onClick={() => { setOpen(false); onDelete(id) }}>
          Delete
        </Button>
        <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </ModalDialog>
  );
}