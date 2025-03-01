"use client";

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { toolsList } from '@/lib/toolsRegistry';
import { getTranslations } from '@/lib/i18n';
import Image from 'next/image';

// Dynamically import Material UI icons
import HomeIcon from '@mui/icons-material/Home';
import CropFreeIcon from '@mui/icons-material/CropFree';
import PaletteIcon from '@mui/icons-material/Palette';
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge';
import TextFieldsIcon from '@mui/icons-material/TextFields';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

// Map of icon names to their components
const iconMap: Record<string, React.ComponentType> = {
  'Home': HomeIcon,
  'CropFree': CropFreeIcon,
  'Palette': PaletteIcon,
  'PhotoSizeSelectLarge': PhotoSizeSelectLargeIcon,
  'TextFields': TextFieldsIcon,
};

export default function Sidebar({ drawerWidth, mobileOpen, handleDrawerToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = getTranslations();

  const handleToolSelect = (toolId: string) => {
    router.push(`/tools/${toolId}`);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Image
          src="/next.svg"
          alt="Logo"
          width={100}
          height={30}
          className="dark:invert"
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t.common.imageTools}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={pathname === '/'} 
            onClick={() => router.push('/')}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t.common.home} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {toolsList.map((tool) => (
          <ListItem key={tool.id} disablePadding>
            <ListItemButton 
              selected={pathname === `/tools/${tool.id}`} 
              onClick={() => handleToolSelect(tool.id)}
            >
              <ListItemIcon>
                {renderIcon(tool.icon)}
              </ListItemIcon>
              <ListItemText primary={tool.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}