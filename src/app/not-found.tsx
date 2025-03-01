import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';

export default function NotFound() {
  return (
    <AppLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 120px)', // Adjust for app bar and padding
        }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            p: 5, 
            maxWidth: 500, 
            textAlign: 'center',
            borderRadius: 2 
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
          
          <Typography variant="h5" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The tool or page you're looking for doesn't exist or has been moved.
          </Typography>
          
          <Link href="/" passHref>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Back to Home
            </Button>
          </Link>
        </Paper>
      </Box>
    </AppLayout>
  );
}