import 'dotenv/config';

import { PrismaService } from '../src/common/database/prisma.service';

import {
  MedicationSynonymType,
  MedicationTerminologySystem,
} from '../src/generated/prisma/enums';

function normalizeTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

async function main(): Promise<void> {
  const prisma = new PrismaService();

  await prisma.$connect();

  try {
    // -------------------------------------------------------------------------
    // LOSARTANA
    // -------------------------------------------------------------------------

    const losartan = await prisma.medicationCatalog.upsert({
      where: {
        normalizedName: normalizeTerm('Losartana'),
      },

      update: {
        name: 'Losartana',
        activeIngredient: 'Losartana potássica',
        normalizedActiveIngredient: normalizeTerm('Losartana potássica'),
        description:
          'Medicamento canônico para testes do catálogo Higeia.',
        isActive: true,
      },

      create: {
        name: 'Losartana',
        normalizedName: normalizeTerm('Losartana'),
        activeIngredient: 'Losartana potássica',
        normalizedActiveIngredient: normalizeTerm('Losartana potássica'),
        description:
          'Medicamento canônico para testes do catálogo Higeia.',
        isActive: true,
      },
    });

    const losartanSynonyms = [
      {
        term: 'Cozaar',
        type: MedicationSynonymType.BRAND_NAME,
      },
      {
        term: 'Losartana potássica',
        type: MedicationSynonymType.ALTERNATIVE_NAME,
      },
    ];

    for (const synonym of losartanSynonyms) {
      const normalizedTerm = normalizeTerm(synonym.term);

      await prisma.medicationSynonym.upsert({
        where: {
          medicationCatalogId_normalizedTerm: {
            medicationCatalogId: losartan.id,
            normalizedTerm,
          },
        },

        update: {
          term: synonym.term,
          type: synonym.type,
        },

        create: {
          medicationCatalogId: losartan.id,
          term: synonym.term,
          normalizedTerm,
          type: synonym.type,
        },
      });
    }

    await prisma.medicationExternalCode.upsert({
      where: {
        system_code: {
          system: MedicationTerminologySystem.ATC,
          code: 'C09CA01',
        },
      },

      update: {
        medicationCatalogId: losartan.id,
        display: 'Losartan',
        isPrimary: true,
      },

      create: {
        medicationCatalogId: losartan.id,
        system: MedicationTerminologySystem.ATC,
        code: 'C09CA01',
        display: 'Losartan',
        isPrimary: true,
      },
    });

    // -------------------------------------------------------------------------
    // METFORMINA
    // -------------------------------------------------------------------------

    const metformin = await prisma.medicationCatalog.upsert({
      where: {
        normalizedName: normalizeTerm('Metformina'),
      },

      update: {
        name: 'Metformina',
        activeIngredient: 'Cloridrato de metformina',
        normalizedActiveIngredient: normalizeTerm(
          'Cloridrato de metformina',
        ),
        description:
          'Medicamento canônico para testes do catálogo Higeia.',
        isActive: true,
      },

      create: {
        name: 'Metformina',
        normalizedName: normalizeTerm('Metformina'),
        activeIngredient: 'Cloridrato de metformina',
        normalizedActiveIngredient: normalizeTerm(
          'Cloridrato de metformina',
        ),
        description:
          'Medicamento canônico para testes do catálogo Higeia.',
        isActive: true,
      },
    });

    await prisma.medicationSynonym.upsert({
      where: {
        medicationCatalogId_normalizedTerm: {
          medicationCatalogId: metformin.id,
          normalizedTerm: normalizeTerm('Glifage'),
        },
      },

      update: {
        term: 'Glifage',
        type: MedicationSynonymType.BRAND_NAME,
      },

      create: {
        medicationCatalogId: metformin.id,
        term: 'Glifage',
        normalizedTerm: normalizeTerm('Glifage'),
        type: MedicationSynonymType.BRAND_NAME,
      },
    });

    // -------------------------------------------------------------------------
    // OMEPRAZOL
    // -------------------------------------------------------------------------

    const omeprazole = await prisma.medicationCatalog.upsert({
      where: {
        normalizedName: normalizeTerm('Omeprazol'),
      },

      update: {
        name: 'Omeprazol',
        activeIngredient: 'Omeprazol',
        normalizedActiveIngredient: normalizeTerm('Omeprazol'),
        description:
          'Medicamento canônico para testes do catálogo Higeia.',
        isActive: true,
      },

      create: {
        name: 'Omeprazol',
        normalizedName: normalizeTerm('Omeprazol'),
        activeIngredient: 'Omeprazol',
        normalizedActiveIngredient: normalizeTerm('Omeprazol'),
        description:
          'Medicamento canônico para testes do catálogo Higeia.',
        isActive: true,
      },
    });

    // -------------------------------------------------------------------------
    // AMOXICILINA
    // -------------------------------------------------------------------------

    const amoxicillin = await prisma.medicationCatalog.upsert({
      where: {
        normalizedName: normalizeTerm('Amoxicilina'),
      },

      update: {
        name: 'Amoxicilina',
        activeIngredient: 'Amoxicilina',
        normalizedActiveIngredient: normalizeTerm('Amoxicilina'),
        description:
          'Medicamento antibacteriano da classe das penicilinas.',
        isActive: true,
      },

      create: {
        name: 'Amoxicilina',
        normalizedName: normalizeTerm('Amoxicilina'),
        activeIngredient: 'Amoxicilina',
        normalizedActiveIngredient: normalizeTerm('Amoxicilina'),
        description:
          'Medicamento antibacteriano da classe das penicilinas.',
        isActive: true,
      },
    });

    await prisma.medicationSynonym.upsert({
      where: {
        medicationCatalogId_normalizedTerm: {
          medicationCatalogId: amoxicillin.id,
          normalizedTerm: normalizeTerm('Amoxicillin'),
        },
      },

      update: {
        term: 'Amoxicillin',
        type: MedicationSynonymType.ALTERNATIVE_NAME,
      },

      create: {
        medicationCatalogId: amoxicillin.id,
        term: 'Amoxicillin',
        normalizedTerm: normalizeTerm('Amoxicillin'),
        type: MedicationSynonymType.ALTERNATIVE_NAME,
      },
    });

    // -------------------------------------------------------------------------
    // RESULTADO
    // -------------------------------------------------------------------------

    console.log(
      'Catálogo de medicamentos de desenvolvimento preparado com sucesso.',
    );

    console.log('');
    console.log(`Losartana: ${losartan.id}`);
    console.log(`Metformina: ${metformin.id}`);
    console.log(`Omeprazol: ${omeprazole.id}`);
    console.log(`Amoxicilina: ${amoxicillin.id}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});