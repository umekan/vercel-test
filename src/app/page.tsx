// src/app/page.tsx
import React from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button 
} from '@mui/material';
import { toolsList } from '@/lib/toolsRegistry';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';

// Dynamic imports for Material UI icons

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center mb-8">
          <Typography variant="h3" component="h1" gutterBottom>
            Image Processing Tools
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            A collection of useful tools for working with images
          </Typography>
        </div>

        <Grid container spacing={4}>
          {toolsList.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href={`/tools/${tool.id}`} passHref>
                    <Button size="small">Open Tool</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <div className="mt-12 text-center">
          <Typography variant="body1">
            Select a tool from the sidebar or cards above to get started.
          </Typography>
        </div>
      </div>
    </AppLayout>
  );
}