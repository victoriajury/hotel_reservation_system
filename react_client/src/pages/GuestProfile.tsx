/*
TO DO:
- Add viewMode to disable inputs whrn edit button clicked.
- Enable save button only on change
- Newsletter preferences
- Populate sections from database
*/

import * as React from 'react';
import { useLoaderData, redirect, useParams, useNavigate, useFetcher, data } from 'react-router-dom';
import { createGuest, getGuest, updateGuest, deleteGuest } from '../data/guests';
import { DataModelId, Guest } from '../data/data_models';

import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';


import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

import CountrySelector from '../layouts/components/CountrySelector';
import ModalDelete from '../layouts/components/ModalDelete';
import PageSectionTabs from '../layouts/components/PageSectionTabs';

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
    guest_name: formData.get('guest_name') as string,
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

  // Form validation
  const errors: Record<string, string> = {};
  const required = [
    newGuest.guest_name,
    newGuest.email,
    newGuest.telephone,
    newGuest.address_1,
    newGuest.city,
    newGuest.postcode,
    newGuest.county,
  ]

  const fieldNames = ['guest_name', 'email', 'telephone', 'address_1', 'city', 'postcode', 'county'];

  fieldNames.forEach((key, idx) => {
    if (!required[idx] || (typeof required[idx] === "string" && required[idx].trim() === "")) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} is required`;
    }
  });
  if (newGuest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newGuest.email as string)) {
    errors.email = "Invalid email address";
  }
  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  // Update existing
  const id = formData.get('id') as number | null;

  let updatedGuest: Guest | null = null;
  updatedGuest = {
    ...newGuest,
  } as Guest;

  if (updatedGuest && id != null) {
    await updateGuest(id, updatedGuest);
    return redirect(`/guests`);

    // Add new record
  } else {
    const guest = await createGuest(newGuest);
    return redirect(`/guest-profile/${guest.id}`);
  }
}

export default function GuestProfile() {
  let navigate = useNavigate();
  let fetcher = useFetcher();
  let errors = fetcher.data?.errors;

  const [open, setOpen] = React.useState<boolean>(false);

  const isEditMode = (getGuestId()) ? true : false;
  let guest = [];
  if (isEditMode) {
    guest = useLoaderData();
  }

  const sections = [
    { label: 'Guest Info', desc: 'Guest name, address and contact details.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Notes', desc: 'Include any special request, dietary requirements, etc. (Notes are not shared with guests.)',  ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Bookings', desc:'Previous reservations.',  ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
    { label: 'Reviews', desc:'Guest reviews and comments.',  ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
    { label: 'Settings', desc:'',  ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
  ];

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
        <PageSectionTabs sections={sections} isEditMode={isEditMode} />
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          p: { xs: 2, md: 3 },
        }}
      >
        <fetcher.Form method="post">
          {isEditMode && <input type="hidden" defaultValue={guest.id} name="id" />}
          <Stack spacing={4}>

            <Card key={sections[0].label} ref={sections[0].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Guest Info</Typography>
                {sections[0].desc && <Typography level="body-sm">
                  {sections[0].desc}
                </Typography>}
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
                    <FormControl error={errors?.guest_name}>
                      <Input size="sm" placeholder="Name" name="guest_name" defaultValue={guest.guest_name} />
                      {errors?.guest_name ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.guest_name}
                        </FormHelperText> : null}
                    </FormControl>
                  </Stack>

                  {/* Phone & Email */}
                  <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
                    <Grid sx={{ p: 0, pr: { xs: 0, md: 1 }, pb: { xs: 2, md: 0 }, width: { xs: '100%', md: '60%' } }}>
                      <FormControl error={errors?.email} sx={{ flexGrow: 0 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          size="sm"
                          startDecorator={<EmailRoundedIcon />}
                          placeholder="email@example.com"
                          name="email"
                          defaultValue={guest.email}
                          sx={{ flexGrow: 1 }}
                        />
                        {errors?.email ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.email}
                          </FormHelperText> : null}
                      </FormControl>
                    </Grid>
                    <Grid sx={{ p: 0, pl: { xs: 0, md: 1 }, width: { xs: '100%', md: '40%' } }}>
                      <FormControl error={errors?.telephone}>
                        <FormLabel>Telephone</FormLabel>
                        <Input
                          size="sm"
                          startDecorator={<PhoneRoundedIcon />}
                          placeholder="e.g. 07123 456 789"
                          name="telephone"
                          defaultValue={guest.telephone}
                        />
                        {errors?.telephone ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.telephone}
                          </FormHelperText> : null}
                      </FormControl>
                    </Grid>
                  </Grid>


                  {/* Address */}
                  <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
                    <FormControl error={errors?.address_1 || errors?.address_2 || errors?.city || errors?.postcode || errors?.county}
                      sx={{
                        display: {
                          sm: 'flex-column',
                          md: 'flex-row',
                        },
                      }}
                    >
                      <FormLabel>Address</FormLabel>
                      <Input size="sm" placeholder="Address Line 1" name="address_1" defaultValue={guest.address_1} />
                      {errors?.address_1 ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.address_1}
                        </FormHelperText> : null}

                      <Input sx={{ mt: 1 }} size="sm" placeholder="Address Line 2" name="address_2" defaultValue={guest.address_2} />
                      {errors?.address_2 ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.address_2}
                        </FormHelperText> : null}

                      <Input sx={{ mt: 1 }} size="sm" placeholder="City" name="city" defaultValue={guest.city} />
                      {errors?.city ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.city}
                        </FormHelperText> : null}

                      <Grid container spacing={1} sx={{ p: 0, m: 0, mt: 1 }}>
                        <Grid sx={{ p: 0, pr: { xs: 0, md: 1 }, pb: { xs: 1, md: 0 }, width: { xs: '100%', md: '50%' } }}>
                          <Input size="sm" placeholder="Postcode" name="postcode" defaultValue={guest.postcode} />
                          {errors?.postcode ?
                            <FormHelperText>
                              <InfoOutlined />
                              {errors.postcode}
                            </FormHelperText> : null}
                        </Grid>
                        <Grid sx={{ p: 0, pl: { xs: 0, md: 1 }, width: { xs: '100%', md: '50%' } }}>
                          <Input size="sm" placeholder="County/Region" name="county" defaultValue={guest.county} sx={{ flexGrow: 1 }} />
                          {errors?.county ?
                            <FormHelperText>
                              <InfoOutlined />
                              {errors.county}
                            </FormHelperText> : null}
                        </Grid>
                      </Grid>
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

            <Card key={sections[1].label} ref={sections[1].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Notes</Typography>
                {sections[1].desc && <Typography level="body-sm">
                  {sections[1].desc}
                </Typography>}
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
          </Stack>
        </fetcher.Form>
        {isEditMode &&
          <React.Fragment>
            <Card key={sections[2].label} ref={sections[2].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Bookings</Typography>
                {sections[2].desc && <Typography level="body-sm">
                  {sections[2].desc}
                </Typography>}
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>

              </Stack>
            </Card>
            <Card key={sections[3].label} ref={sections[3].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Reviews</Typography>
                {sections[3].desc && <Typography level="body-sm">
                  {sections[3].desc}
                </Typography>}
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>

              </Stack>
            </Card>
            <Card key={sections[4].label} ref={sections[4].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Settings</Typography>
                {sections[4].desc && <Typography level="body-sm">
                  {sections[4].desc}
                </Typography>}
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