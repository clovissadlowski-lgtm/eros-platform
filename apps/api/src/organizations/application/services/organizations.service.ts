import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  Organization,
  OrganizationStatus,
} from '../../domain/entities/organization.entity';
import { OrganizationNotFoundError } from '../../domain/errors/organization-not-found.error';
import { OrganizationSlugAlreadyExistsError } from '../../domain/errors/organization-slug-already-exists.error';
import { OrganizationsRepository } from '../../domain/repositories/organizations.repository';

export interface CreateOrganizationInput {
  name: string;
  slug: string;
}

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async createOrganization(
    input: CreateOrganizationInput,
  ): Promise<Organization> {
    const name = input.name.trim();
    const slug = this.normalizeSlug(input.slug);

    const existingOrganization =
      await this.organizationsRepository.findBySlug(
        slug,
      );

    if (existingOrganization) {
      throw new OrganizationSlugAlreadyExistsError(
        slug,
      );
    }

    const timestamp = new Date().toISOString();

    const organization: Organization = {
      id: randomUUID(),
      name,
      slug,
      status: OrganizationStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.organizationsRepository.create(
      organization,
    );
  }

  async listOrganizations(): Promise<
    Organization[]
  > {
    return this.organizationsRepository.list();
  }

  async getOrganizationById(
    organizationId: string,
  ): Promise<Organization> {
    const organization =
      await this.organizationsRepository.findById(
        organizationId,
      );

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    return organization;
  }

  async getOrganizationBySlug(
    slug: string,
  ): Promise<Organization> {
    const normalizedSlug =
      this.normalizeSlug(slug);

    const organization =
      await this.organizationsRepository.findBySlug(
        normalizedSlug,
      );

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    return organization;
  }

  private normalizeSlug(slug: string): string {
    return slug
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}