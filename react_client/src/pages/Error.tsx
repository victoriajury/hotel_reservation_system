import * as React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';


export default function ErrorPage() {


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 5,
          flexDirection: 'column',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography level="h2" component="h1">
          404: Page Not Found
        </Typography>
        <Typography level="body-md" sx={{ mb: 2 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button 
          size="sm"
          component={Link}
          variant="solid" 
          color="primary" 
          to="/"
          >
            Return to dashboard
        </Button>
      </Box>
    </>
  );
}