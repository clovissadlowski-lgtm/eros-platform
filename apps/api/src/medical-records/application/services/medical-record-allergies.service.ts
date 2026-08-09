import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  randomUUID,
} from 'node:crypto';

import {
  AllergenCatalogType,
} from '../../../allergen-catalog/domain/entities/allergen-catalog.entity';

import {
  AllergenCatalogRepository,
} from '../../../allergen-catalog/domain/repositories/allergen-catalog.repository';

import {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
  MedicalRecordAllergy,
} from '../../domain/entities/medical-record-allergy.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  MedicalRecordAllergiesRepository,
} from '../../domain/repositories/medical-record-allergies.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

export interface CreateAllergyInput {
  allergenCatalogId?: string;

  /*
   * Compatibilidade temporária com testes e
   * chamadas internas anteriores ao catálogo.
   *
   * A API pública não aceita mais substance/type.
   */
  substance?: string;
  type?: AllergyType;

  reaction?: string;
  severity?: AllergySeverity;
  status?: AllergyStatus;
  identifiedAt?: string;
  notes?: string;
}

export interface UpdateAllergyInput {
  allergenCatalogId?: string;

  /*
   * Compatibilidade temporária com chamadas
   * internas anteriores à padronização.
   *
   * A API pública não permite edição livre
   * de substance/type.
   */
  substance?: string;
  type?: AllergyType;

  reaction?: string | null;
  severity?: AllergySeverity | null;
  status?: AllergyStatus;
  identifiedAt?: string | null;
  notes?: string | null;
}

@Injectable()
export class MedicalRecordAllergiesService {
  constructor(
    private readonly allergiesRepository:
      MedicalRecordAllergiesRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,

    private readonly allergenCatalogRepository:
      AllergenCatalogRepository,
  ) {}

  async create(
    patientId: string,
    organizationId: string,
    input: CreateAllergyInput,
  ): Promise<MedicalRecordAllergy> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const canonicalAllergen =
      input.allergenCatalogId
        ? await this.getAllergenCatalogItem(
            input.allergenCatalogId,
          )
        : null;

    const substance =
      canonicalAllergen?.name ??
      (
        input.substance
          ? this.normalizeRequiredText(
              input.substance,
            )
          : null
      );

    if (!substance) {
      throw new BadRequestException(
        'An allergen from the canonical catalog is required.',
      );
    }

    const type =
      canonicalAllergen
        ? this.mapCatalogTypeToAllergyType(
            canonicalAllergen.type,
          )
        : input.type;

    if (!type) {
      throw new BadRequestException(
        'Allergy type is required.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const allergy:
      MedicalRecordAllergy = {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        allergenCatalogId:
          canonicalAllergen?.id ??
          null,

        substance,

        type,

        reaction:
          this.normalizeOptionalText(
            input.reaction,
          ),

        severity:
          input.severity ??
          null,

        status:
          input.status ??
          AllergyStatus.ACTIVE,

        identifiedAt:
          this.normalizeOptionalDate(
            input.identifiedAt,
          ),

        notes:
          this.normalizeOptionalText(
            input.notes,
          ),

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    return this.allergiesRepository.create(
      allergy,
    );
  }

  async listByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<MedicalRecordAllergy[]> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this.allergiesRepository
      .listByMedicalRecordId(
        organizationId,
        medicalRecord.id,
      );
  }

  async update(
    patientId: string,
    organizationId: string,
    allergyId: string,
    input: UpdateAllergyInput,
  ): Promise<MedicalRecordAllergy> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const allergy =
      await this.allergiesRepository
        .findById(
          organizationId,
          allergyId,
        );

    if (
      !allergy ||
      allergy.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const canonicalAllergen =
      input.allergenCatalogId !== undefined
        ? await this.getAllergenCatalogItem(
            input.allergenCatalogId,
          )
        : null;

    const updated:
      MedicalRecordAllergy = {
        ...allergy,

        allergenCatalogId:
          canonicalAllergen
            ? canonicalAllergen.id
            : allergy.allergenCatalogId,

        substance:
          canonicalAllergen
            ? canonicalAllergen.name
            : input.substance !== undefined
              ? this.normalizeRequiredText(
                  input.substance,
                )
              : allergy.substance,

        type:
          canonicalAllergen
            ? this.mapCatalogTypeToAllergyType(
                canonicalAllergen.type,
              )
            : input.type ??
              allergy.type,

        reaction:
          input.reaction !== undefined
            ? this.normalizeOptionalText(
                input.reaction,
              )
            : allergy.reaction,

        severity:
          input.severity !== undefined
            ? input.severity
            : allergy.severity,

        status:
          input.status ??
          allergy.status,

        identifiedAt:
          input.identifiedAt !== undefined
            ? this.normalizeOptionalDate(
                input.identifiedAt,
              )
            : allergy.identifiedAt,

        notes:
          input.notes !== undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : allergy.notes,

        updatedAt:
          new Date().toISOString(),
      };

    return this.allergiesRepository.update(
      updated,
    );
  }

  async remove(
    patientId: string,
    organizationId: string,
    allergyId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const allergy =
      await this.allergiesRepository
        .findById(
          organizationId,
          allergyId,
        );

    if (
      !allergy ||
      allergy.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this.allergiesRepository.delete(
      organizationId,
      allergyId,
    );
  }

  private async getAllergenCatalogItem(
    allergenCatalogId: string,
  ) {
    const allergen =
      await this
        .allergenCatalogRepository
        .findActiveById(
          allergenCatalogId,
        );

    if (!allergen) {
      throw new BadRequestException(
        'Allergen does not exist or is inactive.',
      );
    }

    return allergen;
  }

  private mapCatalogTypeToAllergyType(
    catalogType: AllergenCatalogType,
  ): AllergyType {
    switch (catalogType) {
      case AllergenCatalogType.MEDICATION:
      case AllergenCatalogType.ACTIVE_INGREDIENT:
        return AllergyType.MEDICATION;

      case AllergenCatalogType.FOOD:
        return AllergyType.FOOD;

      case AllergenCatalogType.ENVIRONMENTAL:
        return AllergyType.ENVIRONMENTAL;

      case AllergenCatalogType.CONTACT:
        return AllergyType.CONTACT;

      case AllergenCatalogType.BIOLOGICAL:
      case AllergenCatalogType.CHEMICAL:
      case AllergenCatalogType.OTHER:
      default:
        return AllergyType.OTHER;
    }
  }

  private async getMedicalRecord(
    organizationId: string,
    patientId: string,
  ) {
    const medicalRecord =
      await this.medicalRecordsRepository
        .findByPatientId(
          organizationId,
          patientId,
        );

    if (!medicalRecord) {
      throw new MedicalRecordNotFoundError();
    }

    return medicalRecord;
  }

  private normalizeRequiredText(
    value: string,
  ): string {
    return value.trim();
  }

  private normalizeOptionalText(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized.length > 0
      ? normalized
      : null;
  }

  private normalizeOptionalDate(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null ||
      value.trim().length === 0
    ) {
      return null;
    }

    return value;
  }
}