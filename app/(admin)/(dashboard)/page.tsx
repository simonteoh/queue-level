import * as React from 'react';
import Typography from '@mui/material/Typography';
import { prisma } from '@/lib/prisma'; // Example using Prisma



export default async function HomePage() {
  const users = await prisma.merchants.findMany(); // Direct DB query

  console.log("home page", users)
  const isClient = typeof window !== 'undefined';

  console.log(isClient ? 'Client Component' : 'Server Component');

  return (    
      <Typography>
        Welcome to Crowd Level
      </Typography>
  );
}
