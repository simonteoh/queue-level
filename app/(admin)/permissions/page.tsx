'use client'
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
  role_permissions: {
    id: number;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
  } | null;
}

export default function Permissions() {
  const router = useRouter();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Role Permissions</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push('/permissions/add')}
        >
          Add Permission
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles?.map((role: Role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => router.push(`/permissions/edit/${role.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 