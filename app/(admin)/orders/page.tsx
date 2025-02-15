import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Image from 'next/image';

// Sample data - you can replace this with your actual data
const orders = [
  {
    id: 1,
    name: 'Carbonara Spaghetti',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=200&h=200&fit=crop', 
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=200&h=200&fit=crop',
  },
];

export default function OrdersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>
                  <Image
                    src={order.image}
                    alt={order.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
