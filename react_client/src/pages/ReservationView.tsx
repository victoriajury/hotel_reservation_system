/*
TO DO:

- Get invoice summary
- Get payments summary
- Event timeline

breakpoints:

    xs: 0
    sm: 600
    md: 900
    lg: 1200
    xl: 1536

*/

import * as React from 'react';
import { useLoaderData, redirect, useParams, useNavigate } from 'react-router-dom';
import { getReservationStatuses } from '../data/reservation_status';
import { getReservation } from '../data/reservations';
import { DataModelId, Reservation, ReservationStatus, Room } from '../data/data_models';
import { dateDiff } from '../utils';

import Alert from '@mui/joy/Alert';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Grid from '@mui/joy/Grid';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Modal from '@mui/joy/Modal';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import BedroomParentRoundedIcon from '@mui/icons-material/BedroomParentRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CommuteRoundedIcon from '@mui/icons-material/CommuteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

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
    const statuses = await getReservationStatuses();
    return { reservation, statuses };
  }
  return redirect(`/reservations`);
}
export default function ReservationView() {
  const { reservation, statuses } = useLoaderData() as { reservation: Reservation; statuses: ReservationStatus[] };
  let navigate = useNavigate();

  const roomsTotal = () => {
    return dateDiff(reservation.start_date, reservation.end_date) * reservation.rooms.reduce((sum, room) => sum + room.base_price_per_night_charged, 0)
  }

  // Page tab sections
  const sections = [
    { label: 'Guest Details', desc: 'Contact and address information.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Additional Info', desc: 'Special requests and check-in details.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: true },
    { label: 'Billing', desc: 'View balance due and generate invoice.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
    { label: 'Payments', desc: 'View payment history and payment details.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
    { label: 'Timeline', desc: 'Reservation actions timeline history.', ref: React.useRef<HTMLDivElement>(null), showOnNewPage: false },
  ];

  const scrollOffset = { xs: 125, sm: 125, md: 68, lg: 68, xl: 68 };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { xs: -59, sm: -67, md: -77 },
          bgcolor: 'background.body',
          zIndex: 900,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 }, mb: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Typography level="h2" component="h1" sx={{ mt: 0, fontSize: { xs: 'var(--joy-fontSize-xl2)', sm: 'var(--joy-fontSize-xl3)' } }}>
            Booking No. #{String(reservation.id).padStart(5, '0')}
          </Typography>
          <Chip
            variant="soft"
            size="lg"
            sx={{
              ml: 2,
              background: (
                statuses.find((status: ReservationStatus) => status.status === reservation.status)?.bg_color + 'aa' /* with opacity set for dark mode */
              ),
            }}
          >
            {reservation.status}
          </Chip>
        </Box>

        <PageSectionTabs sections={sections} isEditMode />
      </Box>

      {/* Sticky side-bar */}
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          float: { md: 'unset', lg: 'right' },
          position: { md: 'unset', lg: 'sticky' },
          top: { sm: -67, md: 20 },
          right: 0,
          width: { lg: '360px', xl: '450px' },
          maxWidth: { xs: 'unset', md: '900px', lg: '360px', xl: '450px' },
          mx: 3, ml: { xs: 3, lg: 0 },
          px: { xs: 2, md: 6 },
          p: { xs: 2, md: 3 },
        }}
      >
        <Card sx={{ scrollMarginTop: { xs: scrollOffset.xs, md: scrollOffset.md } }}>
          <Sheet
            color='primary'
            variant='soft'
            sx={{
              borderRadius: 'sm',
              p: 1,
              mb: 1,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
              textAlign: 'center'
            }}
          >
            <div>
              <Typography level="body-xs" sx={{ fontWeight: 'lg', mb: 1 }}>
                Check-in
              </Typography>
              <Typography sx={{ fontWeight: 'lg', fontSize: 12 }}>{days[new Date(reservation.start_date).getDay()]}</Typography>
              <Typography sx={{ fontWeight: 'lg' }}>{new Date(reservation.start_date).toDateString().substring(3)}</Typography>
            </div>
            <div>
              <Typography level="body-xs" sx={{ fontWeight: 'lg', mb: 1 }}>
                Check-out
              </Typography>
              <Typography sx={{ fontWeight: 'lg', fontSize: 12 }}>{days[new Date(reservation.end_date).getDay()]}</Typography>
              <Typography sx={{ fontWeight: 'lg' }}>{new Date(reservation.end_date).toDateString().substring(3)}</Typography>
            </div>
            <div style={{ flex: 0.8 }}>
              <Typography level="body-xs" sx={{ fontWeight: 'lg', mb: { xs: 0.5, md: 1 } }}>
                Nights
              </Typography>
              <Typography sx={{ fontWeight: 'lg', fontSize: 32 }}>{dateDiff(reservation.start_date, reservation.end_date)}</Typography>
            </div>
          </Sheet>

          <Box sx={{ maxHeight: { xs: 'unset', lg: '48vh' }, overflow: 'hidden auto' }}>
            {reservation.rooms.map((room: Room) =>
              <Card
                orientation="horizontal"
                size="sm"
                sx={{ bgcolor: 'background.surface', borderRadius: 'sm', mb: 1 }}
              >
                <CardOverflow>
                  <AspectRatio
                    ratio="1"
                    sx={{ minWidth: 70, '& img[data-first-child]': { p: 1 } }}
                  >
                    <img
                      src={`http://127.0.0.1:5000/img/hotel_rooms/${room.room_photo}`}
                      srcSet={`http://127.0.0.1:5000/img/hotel_rooms/${room.room_photo}`}
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                </CardOverflow>
                <CardContent>
                  <Typography level="title-md" startDecorator={<BedroomParentRoundedIcon />}>Room: {room.room_number}
                    {room.room_number_of_occupants > 1
                      ? <Typography level="body-sm" startDecorator={<PeopleRoundedIcon />} sx={{ ml: 2 }}>
                        {room.room_number_of_occupants} people
                      </Typography>

                      : <Typography level="body-sm" startDecorator={<PersonRoundedIcon />} sx={{ ml: 2 }}>
                        {room.room_number_of_occupants} person
                      </Typography>}
                  </Typography>
                  <Typography level="body-sm">{room.room_type_name} - &pound; {room.base_price_per_night_charged.toFixed(2)} per night</Typography>
                </CardContent>
              </Card>
            )}
          </Box>


          <Card color='success' variant='soft'>
            <Typography level="body-md" sx={{ fontWeight: 'lg', textAlign: 'center' }}>
              {reservation.rooms.length > 1 ? "Rooms" : "Room"} Total: &pound;&nbsp;{roomsTotal().toFixed(2)}
            </Typography>
          </Card>

          <Typography level="body-sm" sx={{ mt: 0 }}>
            Booked on: {new Date(reservation.created).toDateString()} at {new Date(reservation.created).toLocaleTimeString()}
            <br />
            <Typography level="body-xs">
              Last modified: {new Date(reservation.modified).toDateString()} at {new Date(reservation.modified).toLocaleTimeString()}
            </Typography>
          </Typography>


        </Card>
      </Stack>

      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: { xs: 'unset', md: '900px', xl: 'unset' },
          mx: 3,
          px: { xs: 2, md: 6 },
          p: { xs: 2, md: 3 },
        }}
      >
        <Stack spacing={4}>

          {/* Guest info */}
          <Card key={sections[0].label} ref={sections[0].ref} sx={{ scrollMarginTop: { xs: scrollOffset.xs, md: scrollOffset.md } }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">{sections[0].label}</Typography>
              {sections[0].desc && <Typography level="body-sm">
                {sections[0].desc}
              </Typography>}
            </Box>
            <Divider />
            <Box>
              <Typography level='title-md' startDecorator={<Avatar color='primary'
                variant='soft' sx={{ mr: 1 }} />}>
                {reservation.guest_name}
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography level='body-sm' startDecorator={<HomeRoundedIcon sx={{ mx: 1 }} />}>{reservation.guest_address}</Typography>
              <Typography level='body-sm' startDecorator={<EmailRoundedIcon sx={{ mx: 1 }} />}>{reservation.guest_email}</Typography>
              <Typography level='body-sm' startDecorator={<PhoneRoundedIcon sx={{ mx: 1 }} />}>{reservation.guest_telephone}</Typography>
            </Stack>
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="solid" color="primary" startDecorator={<AccountBoxRoundedIcon />} onClick={() => navigate(`/guest-profile/${reservation.guest_id}`)}>
                  View Profile
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>

          {/* Additional Info */}
          <Card key={sections[1].label} ref={sections[1].ref} sx={{ scrollMarginTop: { xs: scrollOffset.xs, md: scrollOffset.md } }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">{sections[1].label}</Typography>
              {sections[1].desc && <Typography level="body-sm">
                {sections[1].desc}
              </Typography>}

            </Box>
            <Divider />
            <Grid container spacing={2} sx={{ p: 0, m: 0 }}>
              <Grid sx={{ pb: { xs: 2, lg: 0 }, width: { xs: '100%', xl: '70%' } }}>
                <Card
                  variant="outlined"
                  sx={{ bgcolor: 'background.body', overflow: 'auto', mb: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography level="body-md" startDecorator={<Avatar sx={{ mr: 1 }} size='sm'><EditNoteRoundedIcon /></Avatar>}>Reservation notes</Typography>

                  </Box>
                  <CardContent>
                    <Typography level="body-sm">
                      {reservation.reservation_notes ? reservation.reservation_notes : 'No notes or special requests.'}
                    </Typography>
                  </CardContent>
                  <CardActions buttonFlex="1 50px">
                    <Button variant="soft" color="neutral">
                      Add note
                    </Button>
                  </CardActions>
                </Card>
                <Alert color="danger" size='sm'>Do not store payment or card details here.</Alert>

              </Grid>
              <Grid sx={{ width: { xs: '100%', xl: '30%' } }}>
                <Stack spacing={2} sx={{ my: 1 }}>
                  <Typography level='body-sm' startDecorator={<ScheduleRoundedIcon sx={{ mx: 1 }} />}>
                    <Typography sx={{ fontWeight: 'lg', mr: 1 }}>Arrival Time{": "}
                      <Typography sx={{ fontWeight: 'sm' }}>{reservation.guest_arrival_time ? reservation.guest_arrival_time : " None stated"}
                        {Number(reservation.guest_arrival_time.split(':')[0]) < 12 ? '\xa0AM' : '\xa0PM'}</Typography>
                    </Typography>
                  </Typography>

                  <Typography level='body-sm' startDecorator={<CommuteRoundedIcon sx={{ mx: 1 }} />}>
                    <Typography sx={{ fontWeight: 'lg', mr: 1 }}>Method of transport{": "}
                      <Typography sx={{ fontWeight: 'sm' }}>{reservation.guest_transport_method ? reservation.guest_transport_method : " None stated"}</Typography>
                    </Typography>
                  </Typography>

                  <Typography level='body-sm' startDecorator={<CampaignRoundedIcon sx={{ mx: 1 }} />}>
                    <Typography sx={{ fontWeight: 'lg', mr: 1 }}>Marketing source{": "}
                      <Typography sx={{ fontWeight: 'sm' }}>{reservation.guest_marketing_source ? reservation.guest_marketing_source : " None stated"}</Typography>
                    </Typography>
                  </Typography>
                </Stack>

              </Grid>
            </Grid>


          </Card>

          <Card key={sections[2].label} ref={sections[2].ref} sx={{ scrollMarginTop: { xs: scrollOffset.xs, md: scrollOffset.md } }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">{sections[2].label}</Typography>
              {sections[2].desc && <Typography level="body-sm">
                {sections[2].desc}
              </Typography>}
            </Box>
            <Divider />
            <Stack spacing={2} sx={{ my: 1 }}>

              <Table size='sm' sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' } }}>
                <thead>
                  <tr>
                    <th style={{ width: '60%' }}><Typography level='body-md'>Invoice Summary</Typography></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Cost</td><td>&pound; {roomsTotal().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Additional charges</td><td>&pound; 0.00</td>
                  </tr>
                  <tr>
                    <td>
                      Discount
                      {reservation.special_offer_applied_title ? (
                        <>
                          : <LocalOfferRoundedIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> {reservation.special_offer_applied_title}
                        </>
                      ) : ""}
                    </td>
                    <td>&pound; {reservation.special_offer_discount ? reservation.special_offer_discount.toFixed(2) : "0.00"}</td>
                  </tr>
                  <tr>
                    <td>Paid to date</td><td>&pound; 0.00</td>
                  </tr>
                  <tr>
                    <td>Total Due</td><td><Typography level='body-lg'>&pound; 0.00</Typography></td>
                  </tr>
                </tbody>
              </Table>
            </Stack>
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="soft" color="success" startDecorator={<ReceiptLongRoundedIcon />}>
                  Generate Invoice
                </Button>
                <Button size="sm" variant="solid" color="primary" startDecorator={<PrintRoundedIcon />}>
                  Print Invoice
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>

          <Card key={sections[3].label} ref={sections[3].ref} sx={{ scrollMarginTop: { xs: scrollOffset.xs, md: scrollOffset.md } }}>
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

          <Card key={sections[4].label} ref={sections[4].ref} sx={{ scrollMarginTop: { xs: scrollOffset.xs, md: scrollOffset.md } }}>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">{sections[4].label}</Typography>
              {sections[4].desc && <Typography level="body-sm">
                {sections[4].desc}
              </Typography>}
            </Box>
            <Divider />

            <List sx={{ maxWidth: '400px', m: 'auto', '--ListItemDecorator-size': '40px', gap: 2 }}>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemDecorator
                  sx={{
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      height: '100%',
                      width: '3px',
                      bgcolor: 'divider',
                      left: 'calc(var(--ListItem-paddingLeft) + 11px)',
                      top: '50%',
                    },
                  }}
                >
                  <Avatar
                    sx={{ '--Avatar-size': '24px' }}
                  ><CheckCircleRoundedIcon /></Avatar>
                </ListItemDecorator>
                <ListItemContent>
                  <Typography level="title-sm">Event</Typography>
                  <Typography level="body-xs">Action description</Typography>
                </ListItemContent>
                <Typography level="body-xs">{new Date().toLocaleString()}</Typography>
              </ListItem>

              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemDecorator
                  sx={{
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      height: '100%',
                      width: '3px',
                      bgcolor: 'divider',
                      left: 'calc(var(--ListItem-paddingLeft) + 11px)',
                      top: '50%',
                    },
                  }}
                >
                  <Avatar
                    sx={{ '--Avatar-size': '24px' }}
                  ><EditRoundedIcon /></Avatar>
                </ListItemDecorator>
                <ListItemContent>
                  <Typography level="title-sm">Event</Typography>
                  <Typography level="body-xs">Action description</Typography>
                </ListItemContent>
                <Typography level="body-xs">{new Date().toLocaleString()}</Typography>
              </ListItem>

              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemDecorator>
                  <Avatar
                    sx={{ '--Avatar-size': '24px' }}
                  ><CancelRounded sx={{ color: '#f66151aa' }} /></Avatar>
                </ListItemDecorator>
                <ListItemContent>
                  <Typography level="title-sm">Event</Typography>
                  <Typography level="body-xs">Action description</Typography>
                </ListItemContent>
                <Typography level="body-xs">{new Date().toLocaleString()}</Typography>
              </ListItem>
            </List>

            <Stack spacing={2} sx={{ my: 1 }}>

            </Stack>
          </Card>


          {/* <Modal open={open} onClose={() => setOpen(false)}>
              <ModalDelete id={guest.id} objName='Guest' onDelete={handleDelete} setOpen={setOpen} />
            </Modal> */}
        </Stack>
      </Stack>


    </Box>
  );
}