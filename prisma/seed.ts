import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const modules = [
  'dashboard',
  'merchants',
  'users',
  'roles',
  'permissions'
];

const actions = [
  'view',
  'create',
  'edit',
  'delete'
];

const roles = [
  'admin',
  'merchant'
];

async function main() {
  console.log('Starting seed...');

  // Create permissions
  console.log('Creating permissions...');
  for (const module of modules) {
    for (const action of actions) {
      const permissionName = `${action}_${module}`;
      await prisma.permissions.upsert({
        where: { name: permissionName },
        update: {},
        create: {
          name: permissionName,
        },
      });
    }
  }

  // Create roles
  console.log('Creating roles...');
  for (const roleName of roles) {
    await prisma.roles.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
      },
    });
  }

  // Assign permissions to roles
  console.log('Assigning permissions to roles...');
  
  // Get all roles and permissions
  const [adminRole, merchantRole] = await Promise.all(
    roles.map(name => 
      prisma.roles.findUnique({ where: { name } })
    )
  );

  const allPermissions = await prisma.permissions.findMany();

  // Admin gets all permissions
  if (adminRole) {
    await Promise.all(
      allPermissions.map(permission =>
        prisma.role_permissions.upsert({
          where: {
            roleId_permissionId: {
              roleId: adminRole.id,
              permissionId: permission.id,
            }
          },
          update: {},
          create: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        })
      )
    );
  }

  // Merchant gets limited permissions
  if (merchantRole) {
    const merchantPermissions = allPermissions.filter(p => 
      // Merchants can only access dashboard and merchants modules
      (p.name.includes('dashboard') || p.name.includes('merchants')) &&
      // Merchants can't delete anything
      !p.name.startsWith('delete_')
    );

    await Promise.all(
      merchantPermissions.map(permission =>
        prisma.role_permissions.upsert({
          where: {
            roleId_permissionId: {
              roleId: merchantRole.id,
              permissionId: permission.id,
            }
          },
          update: {},
          create: {
            roleId: merchantRole.id,
            permissionId: permission.id,
          },
        })
      )
    );
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 