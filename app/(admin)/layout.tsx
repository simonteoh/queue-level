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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          router.replace('/login');
          return false;
        }

        const userData = JSON.parse(user) as UserData;
        if (!userData.role) {
          localStorage.removeItem('user');
          router.replace('/login');
          return false;
        }

        setUserRole(userData.role);
        setUserName(`${userData.firstName} ${userData.lastName}`);
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        router.replace('/login');
        return false;
      }
    };

    const auth = checkAuth();
    setIsAuthenticated(auth);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      // First, clear the local storage and state
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      
      // Then attempt to call the logout API
      // Only if it's configured
      if (process.env.NEXT_PUBLIC_API_URL) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging
          timeout: 5000,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't need to handle the error since we already cleared local storage
    } finally {
      // Always redirect to login
      router.replace('/login');
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

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
        <Toolbar />
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
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}  
