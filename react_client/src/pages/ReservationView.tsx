/*
TO DO:
- Price override
  Options for per night or total
  Warn if above default rate

- Exisitng guest selection (search as you type function)

- Add new guest on save

- Add additional info fields to models

- Get invoice summary
- Get payments summary

*/

import * as React from 'react';
import { useLoaderData, redirect, useParams, useNavigate, useFetcher, data } from 'react-router-dom';
import { createReservation, getReservation, updateReservation } from '../data/reservations';
import { getAvailableRoomsByDate } from '../data/rooms';
import { getSpecialOffersByReservationDate } from '../data/special_offers'
import { getTransportMethods } from '../data/transport_methods';
import { getMarketingSources } from '../data/marketing_sources';
import { DataModelId, Reservation, Room, MarketingSource, TransportMethod, SpecialOffer } from '../data/data_models';

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


import BedroomParentRoundedIcon from '@mui/icons-material/BedroomParentRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CommuteRoundedIcon from '@mui/icons-material/CommuteRounded';
import CurrencyPoundRounded from '@mui/icons-material/CurrencyPoundRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';


import CountrySelector from '../layouts/components/CountrySelector';
import ModalDelete from '../layouts/components/ModalDelete';
import PageSectionTabs from '../layouts/components/PageSectionTabs';


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

  const newReservation: Omit<Reservation, "id"> = {
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    status_id: Number(formData.get('status_id')),
    guest_id: Number(formData.get('guest_id')),
    number_of_guests: Number(formData.get('number_of_guests')),
    total_room_base_price: Number(formData.get('total_room_base_price')),
    special_offer_applied_title: formData.get('special_offer_applied_title') as string,
    special_offer_discount: formData.get('special_offer_discount') as string,
    reservation_notes: formData.get('reservation_notes') as string,
    guest_arrival_time: formData.get('guest_arrival_time') as string,
    guest_transport_method: formData.get('guest_transport_method') as string,
    guest_marketing_source: formData.get('guest_marketing_source') as string,
    modified_by_id: 1,
  };

  // Form validation
  const errors: Record<string, string> = {};
  const required = [
    newReservation.start_date,
    newReservation.end_date,
    newReservation.status_id,
    newReservation.guest_id,
    newReservation.number_of_guests,
    newReservation.total_room_base_price,
  ]

  const fieldNames = ['start_date', 'end_date', 'status_id', 'guest_id', 'number_of_guests', 'total_room_base_price'];

  fieldNames.forEach((key, idx) => {
    if (!required[idx] || (typeof required[idx] === "string" && required[idx].trim() === "")) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} is required`;
    }
  });
  // if (newReservation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newReservation.email as string)) {
  //   errors.email = "Invalid email address";
  // }
  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  // Update existing
  // const id = formData.get('id') as number | null;

  let updatedGuest: Reservation | null = null;
  updatedGuest = {
    ...newReservation,
  } as Reservation;

  // if (updatedGuest && id != null) {
  //   await updateGuest(id, updatedGuest);
  //   return redirect(`/guests`);

  //   // Add new record
  // } else {
  //   const guest = await createGuest(newGuest);
  //   return redirect(`/guest-profile/${guest.id}`);
  // }
}

export async function getAvailableRoomsByDatesList(start_date: string, end_date: string) {
  const available_rooms = await getAvailableRoomsByDate(start_date, end_date)
  return available_rooms
}
export async function getSpecialOffersList(start_date: string, end_date: string) {
  const special_offers = await getSpecialOffersByReservationDate(start_date, end_date)
  return special_offers
}
export async function getTransportMethodsList() {
  const transport_methods = await getTransportMethods()
  return transport_methods
}
export async function getMarketingSourcesList() {
  const marketing_sources = await getMarketingSources()
  return marketing_sources
}

export default function ReservationView() {
  let navigate = useNavigate();
  let fetcher = useFetcher();
  let errors = fetcher.data?.errors;

  const [start_date, setStartDate] = React.useState('');
  const [end_date, setEndDate] = React.useState('');
  const [number_of_nights, setNumberOfNights] = React.useState<number>(0);
  const [available_rooms, setAvailableRooms] = React.useState<Room[]>([]);
  const [selected_room, setSelectedRoom] = React.useState<Room>();
  const [special_offers, setSpecialOffers] = React.useState<SpecialOffer[]>();
  const [special_offers_by_room, setSpecialOffersByRoom] = React.useState<SpecialOffer[]>();
  const [selected_offer, setSelectedOffer] = React.useState<SpecialOffer>();
  const [overridePrice, setOverridePrice] = React.useState('');
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  React.useEffect(() => {
    if (start_date && end_date) {
      getAvailableRoomsByDatesList(start_date, end_date).then(setAvailableRooms);
      getSpecialOffersList(start_date, end_date).then(setSpecialOffers);
    }
    dateDiff();
  }, [start_date, end_date]);

  React.useEffect(() => {
    if (selected_room) {
      const total = calculateTotalPrice();
      setTotalPrice(total)
    }
  }, [selected_room]);

  React.useEffect(() => {
    if (overridePrice && Number(overridePrice) > 0) {
      setTotalPrice(Number(overridePrice));
    }
  }, [overridePrice]);

  const cancelOverride = () => {
    setOverridePrice('');
    const total = calculateTotalPrice();
    setTotalPrice(total)
  }

  const dateDiff = () => {
    if (!start_date || !end_date) return 0;
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNumberOfNights(diffDays > 0 ? diffDays : 0);
    return diffDays > 0 ? diffDays : 0;
  }

  const calculateTotalPrice = () => {
    if (!selected_room || number_of_nights <= 0) {
      setTotalPrice(0);
      return 0;
    }

    let pricePerNight = selected_offer ? selected_offer.price_per_night : selected_room.base_price_per_night

    return pricePerNight * number_of_nights;
  }

  const resetRoomSelection = () => {
    setTotalPrice(0);
    setSelectedRoom(undefined);
    setAvailableRooms([]);

    setSelectedOffer(undefined);
    setSpecialOffers([])
    setSpecialOffersByRoom([]);
  }

  const [transport_methods, setTransportMethods] = React.useState<Awaited<ReturnType<typeof getTransportMethodsList>>>([]);
  const [marketing_sources, setMarketingSources] = React.useState<Awaited<ReturnType<typeof getMarketingSourcesList>>>([]);

  React.useEffect(() => {
    getTransportMethodsList().then(setTransportMethods);
    getMarketingSourcesList().then(setMarketingSources);
  }, []);

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

                  {/* Dates */}
                  <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
                    <Grid sx={{ p: 0, pr: { xs: 0, md: 1 }, pb: { xs: 2, md: 0 }, width: { xs: '100%', md: '50%' } }}>
                      <FormControl error={errors?.start_date} sx={{ flexGrow: 0 }}>
                        <FormLabel>Check-in</FormLabel>
                        <Input
                          size="sm"
                          startDecorator={<LoginRoundedIcon />}
                          type='date'
                          value={start_date}
                          onChange={e => { setStartDate(e.target.value); resetRoomSelection() }}
                          defaultValue={reservation.end_date ? new Date(reservation.start_date).toISOString().split('T')[0] : ''}
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
                          value={end_date}
                          onChange={e => { setEndDate(e.target.value); resetRoomSelection() }}
                          defaultValue={reservation.end_date ? new Date(reservation.end_date).toISOString().split('T')[0] : ''}
                        />
                        {errors?.end_date ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.end_date}
                          </FormHelperText> : null}
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Select Rooms */}
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Room</FormLabel>
                    <FormControl error={errors?.room_id}>
                      {(!start_date || !end_date) ?
                        <Select
                          size='sm'
                          placeholder="Please select check-in and check-out dates."
                          disabled
                          startDecorator={<BedroomParentRoundedIcon />}
                        ></Select>
                        :
                        <Select
                          size='sm'
                          placeholder="Choose room..."
                          name="room_id"
                          defaultValue={reservation.room_id ? reservation.room_id : ""}
                          startDecorator={<BedroomParentRoundedIcon />}
                          onChange={(_event, room_id) => {
                            setSelectedOffer(undefined);
                            const room = available_rooms.find(r => r.id === room_id);
                            setSelectedRoom(room);
                            const offersForRoom = special_offers?.filter(offer => offer.room_type === room?.room_type) || [];
                            setSpecialOffersByRoom(offersForRoom);
                            setSelectedOffer(offersForRoom.length > 0 ? offersForRoom[0] : undefined);
                          }}
                        >
                          {available_rooms.map((room: Room) => (
                            <Option
                              key={room.id}
                              value={room.id}
                            >
                              Room {room.room_number} - {room.room_type_name} (Base price: &pound; {room.base_price_per_night.toFixed(2)})
                            </Option>
                          ))}
                        </Select>}
                      {errors?.room_id ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.room_id}
                        </FormHelperText> : null}
                    </FormControl>
                  </Stack>

                  {/* No. of Guests */}
                  {selected_room &&
                    <Stack spacing={1} sx={{ flexGrow: 1 }}>
                      <FormLabel>Number of Guests</FormLabel>
                      <FormControl error={errors?.number_of_guests}>
                        <RadioGroup
                          orientation='horizontal'
                          defaultValue={reservation.number_of_guests ? reservation.number_of_guests : ""}
                          name="number_of_guests"
                          sx={{ display: 'flex', gap: 2 }}
                        >
                          {Array.from({ length: (selected_room) ? selected_room.room_max_occupants : 0 }, (_, i) => {
                            const occupants = i + 1;
                            return (
                              <Radio
                                key={occupants}
                                label={occupants}
                                value={occupants}
                                size="sm"
                              />
                            );
                          })}
                        </RadioGroup>
                        {errors?.number_of_guests ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.number_of_guests}
                          </FormHelperText> : null}
                      </FormControl>
                    </Stack>}

                  {/* Special Offers */}
                  {special_offers_by_room && special_offers_by_room.length > 0 &&
                    <Stack spacing={1} sx={{ flexGrow: 1 }}>
                      <FormLabel>Special Offers Available</FormLabel>
                      <FormControl error={errors?.name}>
                        <RadioGroup
                          aria-label="platform"
                          value={selected_offer ? selected_offer.id : undefined}
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
                          {special_offers_by_room.map((offer) => (
                            <Sheet
                              key={offer.id}
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
                              onClick={() => {
                                setSelectedOffer(offer);
                                if (number_of_nights > 0) {
                                  setTotalPrice(offer.price_per_night * number_of_nights);
                                }
                              }}
                            >
                              <Radio
                                id={String(offer.id)}
                                value={offer.id}
                                checkedIcon={<CheckCircleRoundedIcon />}
                                color='success'
                              />
                              <Avatar variant="soft" size="sm" color='success'><LocalOfferRoundedIcon /></Avatar>
                              <FormLabel sx={{ alignSelf: 'center', textAlign: 'center' }} htmlFor={offer.title}>
                                {offer.title}<br />
                                &pound; {offer.price_per_night.toFixed(2)} per night
                              </FormLabel>
                            </Sheet>
                          ))}
                        </RadioGroup>

                      </FormControl>
                    </Stack>}

                  {/* Price Overide */}
                  {selected_room &&
                    <Stack spacing={1} sx={{ flexGrow: 1 }}>
                      <FormLabel>Price Override</FormLabel>
                      <FormControl error={errors?.name}>

                        <Input
                          size="sm"
                          id="override_price"
                          placeholder="Enter total price to override the calculated room rate."
                          name="override_price"
                          type='number'
                          value={overridePrice}
                          onChange={e => setOverridePrice(e.target.value)}
                          startDecorator={<CurrencyPoundRounded />}
                          endDecorator={
                            <Button
                              variant="soft"
                              color="neutral"
                              startDecorator={<CancelRounded />}
                              onClick={() => cancelOverride()}
                            >
                              Clear
                            </Button>
                          }
                        />

                        {errors?.name ?
                          <FormHelperText>
                            <InfoOutlined />
                            {errors.name}
                          </FormHelperText> : null}
                      </FormControl>
                    </Stack>}

                </Stack>
              </Stack>
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardActions sx={{ alignItems: 'stretch', justifyContent: 'space-between', pt: 2 }}>
                  <Alert color='primary'>
                    <Typography level="body-lg" sx={{ px: 2, textAlign: 'center' }}>
                      {number_of_nights && number_of_nights > 0 ?
                        (number_of_nights == 1 ? number_of_nights + ' night' :
                          number_of_nights + ' nights') : '-'}
                    </Typography>
                    <Typography level="body-sm">
                      <strong>Arrival:</strong> {start_date ? new Date(start_date).toDateString() : " - "}<br />
                      <strong>Departure:</strong> {end_date ? new Date(end_date).toDateString() : " - "}
                    </Typography>
                  </Alert>
                  <Alert color='success'>
                    <Typography level="body-lg">
                      Room Total: &pound;&nbsp;{totalPrice.toFixed(2)}
                    </Typography>
                  </Alert>
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

            {/* Additional Info */}
            <Card key={sections[2].label} ref={sections[2].ref} sx={{ scrollMarginTop: scrollOffset }}>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">{sections[2].label}</Typography>
                {sections[2].desc && <Typography level="body-sm">
                  {sections[2].desc}
                </Typography>}
              </Box>
              <Divider />

              <Stack spacing={2} sx={{ my: 1 }}>
                <FormHelperText color="danger" sx={{ mt: 0.75, fontSize: 'xs' }}>
                  <Alert color="danger">Do not store payment or card details here.</Alert>
                </FormHelperText>
                <Textarea
                  size="sm"
                  minRows={4}
                  sx={{ mt: 1.5 }}
                  placeholder="Special requests, notes, etc."
                  name="reservation_notes"
                  defaultValue={reservation.reservation_notes ? reservation.reservation_notes : ""}
                />

                {/* Arrival Time & Transport */}
                <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
                  <Grid sx={{ p: 0, pr: { xs: 0, md: 1 }, pb: { xs: 2, md: 0 }, width: { xs: '100%', md: '50%' } }}>
                    <FormControl error={errors?.guest_arrival_time} sx={{ flexGrow: 0 }}>
                      <FormLabel>Arrival time</FormLabel>
                      <Select
                        size='sm'
                        placeholder="Choose a time.."
                        name="guest_arrival_time"
                        defaultValue={reservation.guest_arrival_time ? reservation.guest_arrival_time : ""}
                        startDecorator={<CommuteRoundedIcon />}
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0') + ':00';
                          return (
                            <Option key={hour} value={hour}>
                              {hour}
                            </Option>
                          );
                        })}
                      </Select>
                      {errors?.guest_arrival_time ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.guest_arrival_time}
                        </FormHelperText> : null}
                    </FormControl>
                  </Grid>
                  <Grid sx={{ p: 0, pl: { xs: 0, md: 1 }, width: { xs: '100%', md: '50%' } }}>
                    <FormControl error={errors?.guest_transport_method}>
                      <FormLabel>Method of transport</FormLabel>
                      <Select
                        size='sm'
                        placeholder="Choose a mode of transport..."
                        name="guest_transport_method"
                        defaultValue={reservation.guest_transport_method ? reservation.guest_transport_method : ""}
                        startDecorator={<CommuteRoundedIcon />}
                      >
                        {transport_methods.map((transport: TransportMethod) => (
                          <Option key={transport.id} value={transport.transport_name}>{transport.transport_name}</Option>
                        ))}
                      </Select>
                      {errors?.guest_transport_method ?
                        <FormHelperText>
                          <InfoOutlined />
                          {errors.guest_transport_method}
                        </FormHelperText> : null}
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Marketing Source */}
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                  <FormLabel>How did they hear about us?</FormLabel>
                  <FormControl error={errors?.guest_marketing_source}>
                    <Select
                      size='sm'
                      placeholder="Choose a marketing source..."
                      name="guest_marketing_source"
                      defaultValue={reservation.guest_marketing_source ? reservation.guest_marketing_source : ""}
                      startDecorator={<CampaignRoundedIcon />}
                    >
                      {marketing_sources.map((source: MarketingSource) => (
                        <Option key={source.id} value={source.source_name}>{source.source_name}</Option>
                      ))}
                    </Select>
                    {errors?.guest_marketing_source ?
                      <FormHelperText>
                        <InfoOutlined />
                        {errors.guest_marketing_source}
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