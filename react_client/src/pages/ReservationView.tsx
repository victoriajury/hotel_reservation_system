/*
TO DO:
- Get list of rooms to populate selection list
  Function to check if room available for selected dates

- Get special offers and display if they exist

- Price override
  Options for per night or total
  Warn if above default rate

- Total price and number of nights sumary at bottom of section

- Exisitng guest selection (search as you type function)

- Add new guest on save

- Add additional info field to models

- Get invoice summary
- Get payments summary

*/

import * as React from 'react';
import { useLoaderData, redirect, useParams, useNavigate, useFetcher, data } from 'react-router-dom';
import { createReservation, getReservation, updateReservation } from '../data/reservations';
import { DataModelId, Guest } from '../data/data_models';

import Alert from '@mui/joy/Alert';
import Avatar from '@mui/joy/Avatar';
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
import Option from '@mui/joy/Option';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Select from '@mui/joy/Select';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';


import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CommuteRoundedIcon from '@mui/icons-material/CommuteRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';

import CountrySelector from '../layouts/components/CountrySelector';
import ModalDelete from '../layouts/components/ModalDelete';
import PageSectionTabs from '../layouts/components/PageSectionTabs';
import { CancelRounded, CurrencyPound } from '@mui/icons-material';


export function getReservationId() {
  const params: any = useParams()
  if (params?.reservationId) {
    return Number(params?.reservationId) as DataModelId
  }
  return null
}

export async function loader({ params }: { params: { reservationId?: string } }) {
  if (params.reservationId) {
    const reservation = await getReservation(params.reservationId);
    return reservation;
  }
  return redirect(`/reservations`);
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

  // Form validation
  const errors: Record<string, string> = {};
  const required = [
    newGuest.name,
    newGuest.email,
    newGuest.telephone,
    newGuest.address_1,
    newGuest.city,
    newGuest.postcode,
    newGuest.county,
  ]

  const fieldNames = ['name', 'email', 'telephone', 'address_1', 'city', 'postcode', 'county'];

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
  // const id = formData.get('id') as number | null;

  let updatedGuest: Guest | null = null;
  updatedGuest = {
    ...newGuest,
  } as Guest;

  // if (updatedGuest && id != null) {
  //   await updateGuest(id, updatedGuest);
  //   return redirect(`/guests`);

  //   // Add new record
  // } else {
  //   const guest = await createGuest(newGuest);
  //   return redirect(`/guest-profile/${guest.id}`);
  // }
}

export default function ReservationView() {
  let navigate = useNavigate();
  let fetcher = useFetcher();
  let errors = fetcher.data?.errors;

  const [open, setOpen] = React.useState<boolean>(false);

  const isEditMode = (getReservationId()) ? true : false;
  let reservation = [];
  if (isEditMode) {
    reservation = useLoaderData();
  }

  // Page tab sections
  const sections = [
    { label: 'Rooms & Dates', desc: 'Select room, dates and prices.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Guest Info', desc: 'Contact details and billing address.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Additional Info', desc: 'Special requests and check-in details.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Invoice', desc: 'Billing summary and extras.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
    { label: 'Payments', desc: 'Payment summary and amount due.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
  ];

  const scrollOffset = 60;

  // const handleDelete = async (id: DataModelId) => {
  //   await deleteGuest(id.toString())
  //   navigate('/guests')
  // };

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
            {isEditMode ? <span>Booking No. #{String(reservation.id).padStart(5, '0')}</span>
              : <span>New Booking</span>}
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
          {isEditMode && <input type="hidden" defaultValue={reservation.id} name="id" />}
          <Stack spacing={4}>

            <Card key={sections[0].label} ref={sections[0].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">{sections[0].label}</Typography>
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

                  {/* Select Rooms */}
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Room</FormLabel>
                    <FormControl error={errors?.name}>
                      <Select size='sm' placeholder="Choose a room...">
                        <Option value={1}>Room 1</Option>
                        <Option value={2}>Room 2</Option>
                        <Option value={3}>Room 3</Option>
                        <Option value={4}>Room 4</Option>
                      </Select>
                      {errors?.name ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.name}
                        </FormHelperText> : null}
                    </FormControl>
                  </Stack>

                  {/* Dates */}
                  <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
                    <Grid sx={{ p: 0, pr: { xs: 0, md: 1 }, pb: { xs: 2, md: 0 }, width: { xs: '100%', md: '50%' } }}>
                      <FormControl error={errors?.start_date} sx={{ flexGrow: 0 }}>
                        <FormLabel>Check-in</FormLabel>
                        <Input
                          size="sm"
                          startDecorator={<LoginRoundedIcon />}
                          type='date'
                          defaultValue={reservation.end_date ? new Date(reservation.start_date).toISOString().split('T')[0] : ''}
                          slotProps={{
                            input: {
                              max: reservation.end_date ? new Date(reservation.end_date).toISOString().split('T')[0] : '',
                            },
                          }}
                          sx={{ flexGrow: 1 }}
                        />
                        {errors?.start_date ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.start_date}
                          </FormHelperText> : null}
                      </FormControl>
                    </Grid>
                    <Grid sx={{ p: 0, pl: { xs: 0, md: 1 }, width: { xs: '100%', md: '50%' } }}>
                      <FormControl error={errors?.end_date}>
                        <FormLabel>Check-out</FormLabel>
                        <Input
                          size="sm"
                          startDecorator={<LogoutRoundedIcon />}
                          type='date'
                          defaultValue={reservation.end_date ? new Date(reservation.end_date).toISOString().split('T')[0] : ''}
                          slotProps={{
                            input: {
                              min: reservation.end_date ? new Date(reservation.start_date).toISOString().split('T')[0] : '',
                            },
                          }}
                        />
                        {errors?.end_date ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.end_date}
                          </FormHelperText> : null}
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* No. of Guests */}
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl error={errors?.name}>
                      <RadioGroup defaultValue="outlined" orientation='horizontal' name="radio-buttons-group" sx={{ display: 'flex', gap: 2 }} >
                        <Radio label="1" value="1" size="sm" />
                        <Radio label="2" value="2" size="sm" />
                      </RadioGroup>
                      {errors?.name ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.name}
                        </FormHelperText> : null}
                    </FormControl>
                  </Stack>

                  {/* Offers */}
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Special Offers Available</FormLabel>
                    <FormControl error={errors?.name}>


                      <RadioGroup
                        aria-label="platform"
                        defaultValue="Website"
                        overlay
                        name="platform"
                        sx={{
                          flexDirection: 'row',
                          gap: 2,
                          [`& .${radioClasses.checked}`]: {
                            [`& .${radioClasses.action}`]: {
                              inset: -1,
                              border: '3px solid',
                              borderColor: 'success.400',
                            },
                          },
                          [`& .${radioClasses.radio}`]: {
                            display: 'contents',
                            '& > svg': {
                              zIndex: 2,
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              bgcolor: 'background.surface',
                              borderRadius: '50%',

                            },
                          },
                        }}
                      >
                        {['Offer 1', 'Offer 2', 'Offer 3'].map((value) => (
                          <Sheet
                            key={value}
                            variant="outlined"
                            sx={{
                              borderRadius: 'md',
                              boxShadow: 'sm',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 2,
                              width: '50%',
                            }}
                          >
                            <Radio id={value} value={value} checkedIcon={<CheckCircleRoundedIcon />} color='success' />
                            <Avatar variant="soft" size="sm" color='success'><LocalOfferRoundedIcon /></Avatar>
                            <FormLabel sx={{ alignSelf: 'center' }} htmlFor={value}>{value}</FormLabel>
                          </Sheet>
                        ))}
                      </RadioGroup>

                    </FormControl>
                  </Stack>

                  {/* Price Overide */}
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Price Override</FormLabel>
                    <FormControl error={errors?.name}>
                      {/*
                        Use React state to control the value of the input.
                      */}
                      {(() => {
                        const [overridePrice, setOverridePrice] = React.useState('');
                        // This is a workaround to use state inside the render tree.
                        // In a real project, lift this state up to the parent component.
                        (ReservationView as any).overridePrice = overridePrice;
                        (ReservationView as any).setOverridePrice = setOverridePrice;
                        return (
                          <Input
                            size="sm"
                            id="override_price"
                            placeholder="Enter total price to override the calculated room rate."
                            name="override_price"
                            type='number'
                            value={overridePrice}
                            onChange={e => setOverridePrice(e.target.value)}
                            startDecorator={<CurrencyPound />}
                            endDecorator={
                              <Button
                                variant="soft"
                                color="neutral"
                                startDecorator={<CancelRounded />}
                                onClick={() => setOverridePrice('')}
                              >
                                Clear
                              </Button>
                            }
                          />
                        );
                      })()}
                      {errors?.name ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.name}
                        </FormHelperText> : null}
                    </FormControl>
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
                <Typography level="title-md">{sections[1].label}</Typography>
                {sections[1].desc && <Typography level="body-sm">
                  {sections[1].desc}
                </Typography>}
              </Box>
              <Divider />

              <Stack
                direction="column"
                spacing={3}
                sx={{ display: { xs: 'flex', md: 'flex' }, my: 1 }}
              >
                <Stack spacing={2}>
                  {/* Rooms */}
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Guest Name</FormLabel>
                    <FormControl error={errors?.name}>
                      <Input size="sm" placeholder="Name" name="name" defaultValue={reservation.guest_name} />
                      {errors?.name ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.name}
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
                          defaultValue={reservation.guest_email}
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
                          defaultValue={reservation.guest_telephone}
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
                      <Input size="sm" placeholder="Address Line 1" name="address_1" defaultValue={reservation.guest_address} />
                      {errors?.address_1 ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.address_1}
                        </FormHelperText> : null}

                      {/* <Input sx={{ mt: 1 }} size="sm" placeholder="Address Line 2" name="address_2" defaultValue={guest.address_2} />
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
                      </Grid> */}
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

            <Card key={sections[2].label} ref={sections[2].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">{sections[2].label}</Typography>
                {sections[2].desc && <Typography level="body-sm">
                  {sections[2].desc}
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
                  defaultValue={reservation.reservation_notes}
                />
                <FormHelperText color="danger" sx={{ mt: 0.75, fontSize: 'xs' }}>
                  <Alert color="danger">Do not store payment or card details here.</Alert>
                </FormHelperText>


                {/* Phone & Email */}
                <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
                  <Grid sx={{ p: 0, pr: { xs: 0, md: 1 }, pb: { xs: 2, md: 0 }, width: { xs: '100%', md: '50%' } }}>
                    <FormControl error={errors?.email} sx={{ flexGrow: 0 }}>
                      <FormLabel>Arival time</FormLabel>
                      <Input
                        size="sm"
                        startDecorator={<ScheduleRoundedIcon />}
                        placeholder="Check-in time"
                        name="arrival_time"
                        defaultValue={reservation.arrival_time}
                        sx={{ flexGrow: 1 }}
                      />
                      {errors?.email ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.email}
                        </FormHelperText> : null}
                    </FormControl>
                  </Grid>
                  <Grid sx={{ p: 0, pl: { xs: 0, md: 1 }, width: { xs: '100%', md: '50%' } }}>
                    <FormControl error={errors?.telephone}>
                      <FormLabel>Method of transport</FormLabel>
                      <Input
                        size="sm"
                        startDecorator={<CommuteRoundedIcon />}
                        placeholder="How are they arriving?"
                        name="telephone"
                        defaultValue={reservation.guest_telephone}
                      />
                      {errors?.telephone ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.telephone}
                        </FormHelperText> : null}
                    </FormControl>
                  </Grid>
                </Grid>

                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <FormLabel>How did they hear about us?</FormLabel>
                  <FormControl error={errors?.name}>
                    <Input size="sm" startDecorator={<CampaignRoundedIcon />} placeholder="Name" name="name" />
                    {errors?.name ?
                      <FormHelperText>
                        <InfoOutlined />
                        {errors.name}
                      </FormHelperText> : null}
                  </FormControl>
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
          </Stack>
        </fetcher.Form>

        {isEditMode &&
          <React.Fragment>
            <Card key={sections[3].label} ref={sections[3].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">{sections[3].label}</Typography>
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
                <Typography level="title-md">{sections[4].label}</Typography>
                {sections[4].desc && <Typography level="body-sm">
                  {sections[4].desc}
                </Typography>}
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>

              </Stack>
            </Card>

            <Card key={sections[4].label} ref={sections[4].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">{sections[4].label}</Typography>
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
            {/* <Modal open={open} onClose={() => setOpen(false)}>
              <ModalDelete id={guest.id} objName='Guest' onDelete={handleDelete} setOpen={setOpen} />
            </Modal> */}
          </React.Fragment>
        }
      </Stack>
    </Box>
  );
}