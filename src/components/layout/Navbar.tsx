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
import { getTranslations } from '@/lib/i18n';

interface NavbarProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export default function Navbar({ drawerWidth, handleDrawerToggle }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const t = getTranslations();

  // Get page title based on the current path
  const getPageTitle = () => {
    if (pathname === '/') {
      return t.common.appName;
    }
    
    if (pathname.startsWith('/tools/')) {
      const toolId = pathname.split('/').pop();
      if (toolId) {
        const tool = getToolById(toolId);
        return tool ? tool.name : t.common.toolNotFound;
      }
    }
    
    return t.common.appName;
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
            <Button color="inherit">{t.common.help}</Button>
            <Button color="inherit">{t.common.about}</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}