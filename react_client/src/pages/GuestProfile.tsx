import * as React from 'react';
import { useLoaderData, redirect, Form, useParams, useNavigate } from 'react-router-dom';
import { createGuest, getGuest, updateGuest, deleteGuest } from '../data/guests';
import { DataModelId, Guest } from '../data/data_models';

import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import Modal from '@mui/joy/Modal';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import CountrySelector from '../layouts/components/CountrySelector';
import ModalDelete from '../layouts/components/ModalDelete';

export function getGuestId() {
  const params: any = useParams()
  if (params?.guestId) {
    return Number(params?.guestId) as DataModelId
  }
  return null
}

export async function loader({ params }: { params: { guestId?: string } }) {
  if (params.guestId) {
    const guest = await getGuest(params.guestId);
    return guest;
  }
  return redirect(`/guests`);
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const newGuest: Omit<Guest, "id"> = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    telephone: formData.get('telephone') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postcode: formData.get('postcode') as string,
    county: formData.get('county') as string,
    // country: formData.get('country') as string,
    guest_notes: formData.get('guest_notes') as string,
    modified_by_id: 1,
  };

  const id = formData.get('id') as number | null;

  let updatedGuest: Guest | null = null;
  updatedGuest = {
    ...newGuest,
  } as Guest;

  if (updatedGuest && id != null) {
    const guest = await updateGuest(id, updatedGuest);
    if (guest) {
      return redirect(`/guest-profile/${guest.id}`);
    }
  }

  else {
    const guest = await createGuest(newGuest);
    return redirect(`/guest-profile/${guest.id}`);
  }
}

export default function GuestProfile() {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState<boolean>(false);
  const isEditMode = (getGuestId()) ? true : false;

  let guest = [];
  if (isEditMode) {
    guest = useLoaderData();
  }

  const [tabIndex, setTabIndex] = React.useState(0);
  const sections = [
    { label: 'Guest Info', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Notes', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true  },
    { label: 'Bookings', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false  },
    { label: 'Reviews', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false  },
    { label: 'Settings', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false  },
  ];

  const handleTabChange = (
    _event: React.SyntheticEvent<Element, Event> | null,
    newValue: string | number | null
  ) => {
    if (newValue === null) return;
    const index = typeof newValue === 'number' ? newValue : Number(newValue);
    setTabIndex(index);
    const section = sections[index];

    if (section?.ref.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollOffset = 60;

  const handleDelete = async (id: DataModelId) => {
    await deleteGuest(id.toString())
    navigate('/guests')
  };
  
  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -67, md: -77 },
          bgcolor: 'background.body',
          zIndex: 900,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Typography level="h2" component="h1" sx={{ mt: 0, mb: 3 }}>
            Guest profile
          </Typography>
        </Box>
        <Tabs value={tabIndex} defaultValue={undefined} onChange={handleTabChange} sx={{ bgcolor: 'transparent' }}>
          <TabList
            tabFlex={1}
            size="sm"
            sx={{
              pl: { xs: 0, md: 4 },
              justifyContent: 'left',
              [`&& .${tabClasses.root}`]: {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&::after': {
                    height: '2px',
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            { sections.map((section) => 
              !isEditMode && !section.showOnNewPage
              ? ""
              : <Tab sx={{ borderRadius: '6px 6px 0 0' }} key={section.label}>{section.label}</Tab>
            )}
          </TabList>
        </Tabs>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Form method="post" name="guest-form">
          {isEditMode && <input type="hidden" defaultValue={guest.id} name="id" />}

          <Card key={sections[0].label} ref={sections[0].ref} sx={{ scrollMarginTop: scrollOffset }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Guest Info</Typography>
              <Typography level="body-sm">
                Guest name, address and contact details.
              </Typography>
            </Box>
            <Divider />

            <Stack
              direction="column"
              spacing={3}
              sx={{ display: { xs: 'flex', md: 'flex' }, my: 1 }}
            >
              <Stack spacing={2}>
                {/* Name */}
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input size="sm" placeholder="Name" name="name" defaultValue={guest.name} />
                  </FormControl>
                </Stack>

                {/* Phone & Email */}
                <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      size="sm"
                      type="email"
                      startDecorator={<EmailRoundedIcon />}
                      placeholder="email@example.com"
                      name="email"
                      defaultValue={guest.email}
                      sx={{ flexGrow: 1 }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Telephone</FormLabel>
                    <Input
                      size="sm"
                      startDecorator={<PhoneRoundedIcon />}
                      placeholder="07123 456 789"
                      name="telephone"
                      defaultValue={guest.telephone}
                    />
                  </FormControl>
                </Stack>

                {/* Address */}
                <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
                  <FormControl
                    sx={{
                      display: {
                        sm: 'flex-column',
                        md: 'flex-row',
                      },
                    }}
                  >
                    <FormLabel>Address</FormLabel>
                    <Input sx={{ mb: 1 }} size="sm" placeholder="Address Line 1" name="address_1" defaultValue={guest.address_1} />
                    <Input sx={{ mb: 1 }} size="sm" placeholder="Address Line 2" name="address_2" defaultValue={guest.address_2} />
                    <Input sx={{ mb: 1 }} size="sm" placeholder="City" name="city" defaultValue={guest.city} />
                    <Stack direction="row" spacing={2}>
                      <Input size="sm" placeholder="Postcode" name="postcode" defaultValue={guest.postcode} />
                      <Input size="sm" placeholder="County/Region" name="county" defaultValue={guest.county} sx={{ flexGrow: 1 }} />
                    </Stack>
                  </FormControl>
                  <div>
                    <CountrySelector />
                  </div>
                </Stack>
              </Stack>
            </Stack>
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral" onClick={() => navigate('/guests')}>
                  Cancel
                </Button>
                <Button size="sm" variant="solid" type="submit">
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Form>
        <Form method="post" name="guest-form">
          <Card key={sections[1].label} ref={sections[1].ref} sx={{ scrollMarginTop: scrollOffset }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Notes</Typography>
              <Typography level="body-sm">
                Include any special request, dietary requirements, etc. (Notes are not shared with guests.)
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={2} sx={{ my: 1 }}>
              <Textarea
                size="sm"
                minRows={4}
                sx={{ mt: 1.5 }}
                placeholder="Special requests, notes, etc."
                name="guest_notes"
                defaultValue={guest.guest_notes}
              />
              <FormHelperText color="danger" sx={{ mt: 0.75, fontSize: 'xs' }}>
                <Alert color="danger">Do not store payment or card details here.</Alert>
              </FormHelperText>
            </Stack>
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral" onClick={() => navigate('/guests')}>
                  Cancel
                </Button>
                <Button size="sm" variant="solid" type="submit">
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Form>
        {isEditMode &&
          <React.Fragment>
            <Card key={sections[2].label} ref={sections[2].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Bookings</Typography>
                <Typography level="body-sm">
                  Previous reservations.
                </Typography>
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>

              </Stack>
            </Card>
            <Card key={sections[3].label} ref={sections[3].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Reviews</Typography>
                <Typography level="body-sm">
                  Guest reviews and comments.
                </Typography>
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>

              </Stack>
            </Card>
            <Card key={sections[4].label} ref={sections[4].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Settings</Typography>
              </Box>
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                  <Button size="sm" variant="outlined" color="neutral" onClick={() => navigate('/guests')}>
                    Cancel
                  </Button>
                  <Button size="sm" startDecorator={<DeleteRoundedIcon />} variant="solid" color='danger' onClick={() => setOpen(true)} >
                    Delete guest
                  </Button>
                </CardActions>
              </CardOverflow>
            </Card>
            <Modal open={open} onClose={() => setOpen(false)}>
              <ModalDelete id={guest.id} objName='Guest' onDelete={handleDelete} setOpen={setOpen} />
            </Modal>
          </React.Fragment>
        }
      </Stack>
    </Box>
  );
}