import * as React from 'react';
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

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import CountrySelector from '../layouts/components/CountrySelector';



export default function GuestProfile() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const sections = [
    { label: 'Guest Info', ref: React.useRef<HTMLDivElement>(null) },
    { label: 'Notes', ref: React.useRef<HTMLDivElement>(null) },
    { label: 'Bookings', ref: React.useRef<HTMLDivElement>(null) },
    { label: 'Reviews', ref: React.useRef<HTMLDivElement>(null) },
    { label: 'Settings', ref: React.useRef<HTMLDivElement>(null) },
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

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -67, md: -77 },
          bgcolor: 'background.body',
          zIndex: 9995,
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
            {sections.map((section) => (
              <Tab sx={{ borderRadius: '6px 6px 0 0' }} key={section.label}>{section.label}</Tab>
            ))}
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
                  <Input size="sm" placeholder="Name" />
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
                    sx={{ flexGrow: 1 }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Telephone</FormLabel>
                  <Input 
                    size="sm"
                    startDecorator={<PhoneRoundedIcon />}
                    placeholder="07123 456 789"
                  />
                </FormControl>
              </Stack>

              {/* Address */}
              <Stack direction="column"  spacing={2} sx={{ flexGrow: 1 }}>
                <FormControl
                  sx={{
                    display: {
                      sm: 'flex-column',
                      md: 'flex-row',
                    },
                  }}
                  >
                  <FormLabel>Address</FormLabel>
                  <Input sx={{ mb: 1}} size="sm" placeholder="Address Line 1" />
                  <Input sx={{ mb: 1}}  size="sm" placeholder="Address Line 2" />
                  <Input sx={{ mb: 1}}  size="sm" placeholder="City" />
                  <Stack direction="row" spacing={2}>
                    <Input size="sm" placeholder="Postcode" />
                    <Input size="sm" placeholder="County/Region" sx={{ flexGrow: 1 }} />
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
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
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
            />
            <FormHelperText color="danger" sx={{ mt: 0.75, fontSize: 'xs' }}>
              <Alert color="danger">Do not store payment or card details here.</Alert>
            </FormHelperText>
          </Stack>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
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
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" startDecorator={<DeleteRoundedIcon />} variant="solid" color='danger'>
                Delete guest
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
}