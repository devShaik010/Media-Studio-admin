import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Article as ArticleIcon,
  ChevronLeft as ChevronLeftIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const Layout = ({ children, onLogout }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { path: '/', title: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/new', title: 'Upload', icon: <UploadIcon /> },
    { path: '/manage', title: 'Manage Articles', icon: <ArticleIcon /> },
    { path: '/settings', title: 'Settings', icon: <SettingsIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Media Studio Point
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleUserMenuClick}>
              <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
            >
              <MenuItem>
                <ListItemIcon>
                  <AccountIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={onLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : 72,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            backgroundColor: '#f8fafc'
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'hidden' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  mb: 1,
                  mx: 1,
                  borderRadius: 1,
                  backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.title} />}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${open ? DRAWER_WIDTH : 72}px)`,
          transition: 'width 0.3s ease',
          backgroundColor: '#f1f5f9',
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ 
          backgroundColor: 'white',
          borderRadius: 1,
          p: 3,
          minHeight: 'calc(100vh - 112px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;