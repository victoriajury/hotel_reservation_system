import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/joy/styles';


export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Outlet />
    </StyledEngineProvider>
  );
}
