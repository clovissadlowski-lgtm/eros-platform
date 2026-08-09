import 'dotenv/config';

import {
  randomUUID,
} from 'node:crypto';

import {
  PrismaService,
} from '../src/common/database/prisma.service';

import {
  AllergenCatalogType,
  AllergenTerminologySystem,
} from '../src/generated/prisma/enums';

interface SeedAllergen {
  name: string;
  normalizedName: string;
  type: AllergenCatalogType;
  description: string;
  synonyms: string[];
  externalCodes?: Array<{
    system: AllergenTerminologySystem;
    code: string;
    display: string;
    isPrimary: boolean;
  }>;
}

const allergens:
  SeedAllergen[] = [
    {
      name:
        'Amoxicilina',

      normalizedName:
        'amoxicilina',

      type:
        AllergenCatalogType
          .ACTIVE_INGREDIENT,

      description:
        'Princípio ativo antibacteriano da classe das penicilinas.',

      synonyms: [
        'Amoxicillin',
      ],
    },

    {
      name:
        'Penicilina',

      normalizedName:
        'penicilina',

      type:
        AllergenCatalogType
          .ACTIVE_INGREDIENT,

      description:
        'Substância da classe dos antibióticos beta-lactâmicos.',

      synonyms: [
        'Penicillin',
        'Penicilinas',
      ],
    },

    {
      name:
        'Leite de vaca',

      normalizedName:
        'leite de vaca',

      type:
        AllergenCatalogType
          .FOOD,

      description:
        'Alérgeno alimentar relacionado ao leite de origem bovina.',

      synonyms: [
        'Leite',
        'Leite bovino',
      ],
    },

    {
      name:
        'Ácaros da poeira doméstica',

      normalizedName:
        'acaros da poeira domestica',

      type:
        AllergenCatalogType
          .ENVIRONMENTAL,

      description:
        'Alérgeno ambiental associado aos ácaros encontrados na poeira doméstica.',

      synonyms: [
        'Ácaro',
        'Ácaros',
        'Ácaro da poeira',
        'Ácaros da poeira',
      ],
    },

    {
      name:
        'Poeira doméstica',

      normalizedName:
        'poeira domestica',

      type:
        AllergenCatalogType
          .ENVIRONMENTAL,

      description:
        'Exposição ambiental à poeira presente em ambientes internos.',

      synonyms: [
        'Poeira',
        'Pó doméstico',
      ],
    },
  ];

function normalizeTerm(
  value: string,
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .trim()
    .toLowerCase();
}

async function main(): Promise<void> {
  const prisma =
    new PrismaService();

  await prisma.$connect();

  try {
    for (
      const allergen
      of allergens
    ) {
      const catalogItem =
        await prisma
          .allergenCatalog
          .upsert({
            where: {
              normalizedName:
                allergen
                  .normalizedName,
            },

            update: {
              name:
                allergen.name,

              type:
                allergen.type,

              description:
                allergen
                  .description,

              isActive:
                true,

              updatedAt:
                new Date(),
            },

            create: {
              id:
                randomUUID(),

              name:
                allergen.name,

              normalizedName:
                allergen
                  .normalizedName,

              type:
                allergen.type,

              description:
                allergen
                  .description,

              isActive:
                true,

              createdAt:
                new Date(),

              updatedAt:
                new Date(),
            },
          });

      for (
        const synonym
        of allergen.synonyms
      ) {
        const normalizedTerm =
          normalizeTerm(
            synonym,
          );

        await prisma
          .allergenSynonym
          .upsert({
            where: {
              allergenCatalogId_normalizedTerm:
                {
                  allergenCatalogId:
                    catalogItem.id,

                  normalizedTerm,
                },
            },

            update: {
              term:
                synonym,
            },

            create: {
              id:
                randomUUID(),

              allergenCatalogId:
                catalogItem.id,

              term:
                synonym,

              normalizedTerm,

              createdAt:
                new Date(),
            },
          });
      }

      for (
        const externalCode
        of allergen.externalCodes ??
        []
      ) {
        await prisma
          .allergenExternalCode
          .upsert({
            where: {
              system_code: {
                system:
                  externalCode
                    .system,

                code:
                  externalCode
                    .code,
              },
            },

            update: {
              allergenCatalogId:
                catalogItem.id,

              display:
                externalCode
                  .display,

              isPrimary:
                externalCode
                  .isPrimary,

              updatedAt:
                new Date(),
            },

            create: {
              id:
                randomUUID(),

              allergenCatalogId:
                catalogItem.id,

              system:
                externalCode
                  .system,

              code:
                externalCode
                  .code,

              display:
                externalCode
                  .display,

              version:
                null,

              isPrimary:
                externalCode
                  .isPrimary,

              createdAt:
                new Date(),

              updatedAt:
                new Date(),
            },
          });
      }

      console.log(
        `Allergen catalog: ${allergen.name}`,
      );
    }

    console.log('');
    console.log(
      'Catálogo inicial de alérgenos preparado com sucesso.',
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(
  (
    error: unknown,
  ) => {
    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);