'use client'
import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
} from '@mui/material';
import {
  Store as StoreIcon,
  SupervisorAccount as RoleIcon,
  Dashboard as DashboardIcon,
  Person as UserIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
  // ... other icons
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  path: string;
  icon: JSX.Element;
  roles: string[];
}

interface UserData {
  role: string;
  firstName: string;
  lastName: string;
  // add other user properties
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    roles: ['admin', 'merchant'], // All roles can access dashboard
  },
  {
    text: 'Merchants',
    path: '/merchants',
    icon: <StoreIcon />,
    roles: ['admin'], // Both admin and merchant can access
  },
  {
    text: 'Users',
    path: '/users',
    icon: <UserIcon />,
    roles: ['admin'], // Only admin can access
  },
  {
    text: 'Roles',
    path: '/roles',
    icon: <RoleIcon />,
    roles: ['admin'], // Only admin can access
  },
  {
    text: 'Permissions',
    path: '/permissions',
    icon: <SecurityIcon />,
    roles: ['admin'],
  },
  // ... other menu items
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    try {
      const user = localStorage.getItem('user');

      console.log("localstorage", user)
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setUserName(`${userData.firstName} ${userData.lastName}`);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      // Update this URL to your new backend
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );
  console.log("filteredMenuItems",filteredMenuItems)
  console.log("userRole",userRole)
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {userName}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* This creates space for the AppBar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={pathname?.startsWith(item.path)}
                  onClick={() => router.push(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* This creates space for the AppBar */}
        {children}
      </Box>
    </Box>
  );
}  
