import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  Organization,
  OrganizationStatus,
} from '../../domain/entities/organization.entity';
import { OrganizationsRepository } from '../../domain/repositories/organizations.repository';

@Injectable()
export class PrismaOrganizationsRepository
  implements OrganizationsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    organization: Organization,
  ): Promise<Organization> {
    const createdOrganization =
      await this.prisma.organization.create({
        data: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          status: organization.status,
          createdAt: new Date(
            organization.createdAt,
          ),
          updatedAt: new Date(
            organization.updatedAt,
          ),
        },
      });

    return this.toDomain(createdOrganization);
  }

  async findById(
    id: string,
  ): Promise<Organization | null> {
    const organization =
      await this.prisma.organization.findUnique({
        where: {
          id,
        },
      });

    return organization
      ? this.toDomain(organization)
      : null;
  }

  async findBySlug(
    slug: string,
  ): Promise<Organization | null> {
    const organization =
      await this.prisma.organization.findUnique({
        where: {
          slug,
        },
      });

    return organization
      ? this.toDomain(organization)
      : null;
  }

  async list(): Promise<Organization[]> {
    const organizations =
      await this.prisma.organization.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

    return organizations.map(
      (organization) =>
        this.toDomain(organization),
    );
  }

  private toDomain(
    organization: {
      id: string;
      name: string;
      slug: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ): Organization {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      status:
        organization.status as OrganizationStatus,
      createdAt:
        organization.createdAt.toISOString(),
      updatedAt:
        organization.updatedAt.toISOString(),
    };
  }
}