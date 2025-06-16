import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, {listItemButtonClasses, ListItemButtonProps } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { closeSidebar } from '../../utils';
import Logo from './Logo';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

interface NavListItemButtonProps extends Omit<ListItemButtonProps, 'component' | 'to' | 'selected'> {
  to: string;
  children: React.ReactNode;
}

const NavListItemButton: React.FC<NavListItemButtonProps> = ({ to, children }) => {
  const location = useLocation();
  const isSelected = location.pathname === to;

  return (
    <ListItemButton
      role="menuitem"
      component={NavLink}
      to={to}
      selected={isSelected}
    >
      {children}
    </ListItemButton>
  );
};

export default function Sidebar() {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 1000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Logo />
        <Typography level="title-md">Reservation System</Typography>
      </Box>
      <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" />
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <NavListItemButton to="/">
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Dashboard</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem>
            <NavListItemButton to="/calendar">
              <CalendarMonthRounded />
              <ListItemContent>
                <Typography level="title-sm">Calendar</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem>
            <NavListItemButton to="/reservations">
              <RoomServiceRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Reservations</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem>
            <NavListItemButton to="/special-offers">
              <LocalOfferRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Special Offers</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem>
            <NavListItemButton to="/guests">
              <GroupRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Guests</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem>
            <NavListItemButton to="/invoices">
              <ReceiptLongRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Invoices</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem>
            <NavListItemButton to="/payments">
              <PaymentRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Payments</Typography>
              </ListItemContent>
            </NavListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <SettingsRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Settings</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? {
                          transform: 'rotate(180deg)',
                        }
                        : {
                          transform: 'none',
                        },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <NavListItemButton to="/reservation-statuses">Reservation Statuses</NavListItemButton>
                </ListItem>
                <ListItem>
                  <NavListItemButton to="/room-types">Room Types</NavListItemButton>
                </ListItem>
                <ListItem>
                  <NavListItemButton to="/rooms">Rooms</NavListItemButton>
                </ListItem>
                <ListItem>
                  <NavListItemButton to="/users">Users</NavListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">Siriwat K.</Typography>
          <Typography level="body-xs">siriwatk@test.com</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral">
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
