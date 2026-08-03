import { randomUUID } from 'node:crypto';

import { ScryptPasswordHasher } from '../src/auth/infrastructure/crypto/scrypt-password-hasher';
import { PrismaService } from '../src/common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  UserStatus,
} from '../src/generated/prisma/enums';

async function main(): Promise<void> {
  const prisma = new PrismaService();
  const passwordHasher =
    new ScryptPasswordHasher();

  const email = 'usuario@higeia.test';
  const plainPassword =
    'StrongPassword#2026';

  const organizationSlug =
    'clinica-higeia-teste';

  await prisma.$connect();

  try {
    const passwordHash =
      await passwordHasher.hash(
        plainPassword,
      );

    const organization =
      await prisma.organization.upsert({
        where: {
          slug: organizationSlug,
        },
        update: {
          name: 'Clínica Higeia Teste',
          status: OrganizationStatus.ACTIVE,
          updatedAt: new Date(),
        },
        create: {
          id: randomUUID(),
          name: 'Clínica Higeia Teste',
          slug: organizationSlug,
          status: OrganizationStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

    const user =
      await prisma.user.upsert({
        where: {
          email,
        },
        update: {
          name: 'Usuário de Teste Higeia',
          passwordHash,
          status: UserStatus.ACTIVE,
          lastLoginAt: null,
          updatedAt: new Date(),
        },
        create: {
          id: randomUUID(),
          name: 'Usuário de Teste Higeia',
          email,
          passwordHash,
          status: UserStatus.ACTIVE,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

    const membership =
      await prisma.membership.upsert({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId:
              organization.id,
          },
        },
        update: {
          role: MembershipRole.OWNER,
          status: MembershipStatus.ACTIVE,
          updatedAt: new Date(),
        },
        create: {
          id: randomUUID(),
          userId: user.id,
          organizationId:
            organization.id,
          role: MembershipRole.OWNER,
          status: MembershipStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

    console.log(
      'Ambiente de autenticação preparado.',
    );

    console.log('');
    console.log(`Usuário ID: ${user.id}`);
    console.log(`E-mail: ${email}`);
    console.log(`Senha: ${plainPassword}`);

    console.log('');
    console.log(
      `Organização ID: ${organization.id}`,
    );
    console.log(
      `Organização: ${organization.name}`,
    );
    console.log(
      `Slug: ${organization.slug}`,
    );

    console.log('');
    console.log(
      `Membership ID: ${membership.id}`,
    );
    console.log(
      `Membership role: ${membership.role}`,
    );
    console.log(
      `Membership status: ${membership.status}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});