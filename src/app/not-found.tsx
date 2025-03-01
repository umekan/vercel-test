import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { getTranslations } from '@/lib/i18n';

export default async function NotFound() {
  const t = getTranslations();
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
            {t.pages.notFound.title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {t.pages.notFound.message}
          </Typography>
          
          <Link href="/" passHref>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              {t.common.backToHome}
            </Button>
          </Link>
        </Paper>
      </Box>
    </AppLayout>
  );
}