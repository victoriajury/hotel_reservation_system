import * as React from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import ColorSchemeToggle from './components/ColorSchemeToggle';
import Sidebar from './components/Sidebar';
import Header from './components/Header';


export default function DashboardLayout() {
  const location = useLocation();
  return (

    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* TO DO */}
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                component={RouterLink}
                to="/"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                component={RouterLink}
                to="/"
                sx={{ fontSize: 12, fontWeight: 500 }}
              >
                Parent Page
              </Link>
              <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                Current Page Name
              </Typography>
            </Breadcrumbs>
            <ColorSchemeToggle sx={{ ml: 'auto' }} />
          </Box>
          {/* Main page content */}
          <Outlet />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
