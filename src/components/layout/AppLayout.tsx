"use client";

import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './Drawer';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';
import { getToolById } from '@/lib/toolsRegistry';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 240;
  const pathname = usePathname();

  // Create a theme based on system preference
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* Top navigation bar */}
        <Navbar 
          drawerWidth={drawerWidth} 
          handleDrawerToggle={handleDrawerToggle} 
        />
        
        {/* Sidebar drawer */}
        <Sidebar 
          drawerWidth={drawerWidth} 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle} 
        />
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
          }}
        >
          <Toolbar /> {/* This is for spacing below the AppBar */}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}