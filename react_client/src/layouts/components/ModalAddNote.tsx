import * as React from 'react';
import { DataModelId } from '../../data/data_models';

import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Textarea from '@mui/joy/Textarea';

import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

interface ModalProps {
  id: DataModelId;
  objName: string;
  onSave: (note: string) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalAddNote({ id, objName, onSave, setOpen }: ModalProps) {
  const [noteText, setNoteText] = React.useState('');

  return (
    <ModalDialog variant="outlined" role="alertdialog" minWidth={500}>
      <DialogTitle>
        <EditNoteRoundedIcon />
        Add new {objName.toLowerCase()} note
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Textarea
          size="sm"
          minRows={4}
          sx={{ mt: 1.5 }}
          placeholder="Special requests, notes, etc."
          name="reservation_notes"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="solid"
          color="primary"
          onClick={() => {
            setOpen(false);
            onSave(noteText);
          }}
        >
          Save
        </Button>
        <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </ModalDialog>
  );
}