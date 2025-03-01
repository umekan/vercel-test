"use client";

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname } from 'next/navigation';
import { getToolById } from '@/lib/toolsRegistry';

interface NavbarProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export default function Navbar({ drawerWidth, handleDrawerToggle }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();

  // Get page title based on the current path
  const getPageTitle = () => {
    if (pathname === '/') {
      return 'Image Processing Tools';
    }
    
    if (pathname.startsWith('/tools/')) {
      const toolId = pathname.split('/').pop();
      if (toolId) {
        const tool = getToolById(toolId);
        return tool ? tool.name : 'Tool Not Found';
      }
    }
    
    return 'Image Processing Tools';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getPageTitle()}
        </Typography>
        {!isMobile && (
          <Box>
            <Button color="inherit">Help</Button>
            <Button color="inherit">About</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}