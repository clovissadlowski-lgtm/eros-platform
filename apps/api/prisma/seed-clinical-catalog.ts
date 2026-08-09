import 'dotenv/config';

import {
  PrismaService,
} from '../src/common/database/prisma.service';

import {
  ClinicalConceptType,
  TerminologySystem,
} from '../src/generated/prisma/enums';

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
    const hypertension =
      await prisma.clinicalConditionCatalog.upsert({
        where: {
          normalizedName:
            normalizeTerm(
              'Hipertensão arterial',
            ),
        },

        update: {
          name:
            'Hipertensão arterial',

          conceptType:
            ClinicalConceptType.DISEASE,

          category:
            'Cardiovascular',

          description:
            'Condição clínica canônica para testes do catálogo Higeia.',

          isActive:
            true,
        },

        create: {
          name:
            'Hipertensão arterial',

          normalizedName:
            normalizeTerm(
              'Hipertensão arterial',
            ),

          conceptType:
            ClinicalConceptType.DISEASE,

          category:
            'Cardiovascular',

          description:
            'Condição clínica canônica para testes do catálogo Higeia.',

          isActive:
            true,
        },
      });

    const hypertensionSynonyms = [
      'HAS',
      'Hipertensão',
      'Pressão alta',
      'Hipertensão arterial sistêmica',
    ];

    for (
      const term of
        hypertensionSynonyms
    ) {
      const normalizedTerm =
        normalizeTerm(
          term,
        );

      await prisma.clinicalConditionSynonym.upsert({
        where: {
          clinicalConditionId_normalizedTerm: {
            clinicalConditionId:
              hypertension.id,

            normalizedTerm,
          },
        },

        update: {
          term,
        },

        create: {
          clinicalConditionId:
            hypertension.id,

          term,

          normalizedTerm,
        },
      });
    }

    await prisma.clinicalConditionExternalCode.upsert({
      where: {
        system_code: {
          system:
            TerminologySystem.ICD_10,

          code:
            'I10',
        },
      },

      update: {
        clinicalConditionId:
          hypertension.id,

        display:
          'Hipertensão essencial (primária)',

        isPrimary:
          true,
      },

      create: {
        clinicalConditionId:
          hypertension.id,

        system:
          TerminologySystem.ICD_10,

        code:
          'I10',

        display:
          'Hipertensão essencial (primária)',

        isPrimary:
          true,
      },
    });

    const diabetes =
      await prisma.clinicalConditionCatalog.upsert({
        where: {
          normalizedName:
            normalizeTerm(
              'Diabetes mellitus tipo 2',
            ),
        },

        update: {
          name:
            'Diabetes mellitus tipo 2',

          conceptType:
            ClinicalConceptType.DISEASE,

          category:
            'Metabólica',

          description:
            'Condição clínica canônica para testes do catálogo Higeia.',

          isActive:
            true,
        },

        create: {
          name:
            'Diabetes mellitus tipo 2',

          normalizedName:
            normalizeTerm(
              'Diabetes mellitus tipo 2',
            ),

          conceptType:
            ClinicalConceptType.DISEASE,

          category:
            'Metabólica',

          description:
            'Condição clínica canônica para testes do catálogo Higeia.',

          isActive:
            true,
        },
      });

    const diabetesSynonyms = [
      'DM2',
      'Diabetes tipo 2',
      'Diabetes mellitus 2',
    ];

    for (
      const term of
        diabetesSynonyms
    ) {
      const normalizedTerm =
        normalizeTerm(
          term,
        );

      await prisma.clinicalConditionSynonym.upsert({
        where: {
          clinicalConditionId_normalizedTerm: {
            clinicalConditionId:
              diabetes.id,

            normalizedTerm,
          },
        },

        update: {
          term,
        },

        create: {
          clinicalConditionId:
            diabetes.id,

          term,

          normalizedTerm,
        },
      });
    }

    console.log(
      'Catálogo clínico de desenvolvimento preparado com sucesso.',
    );

    console.log('');
    console.log(
      `Hipertensão arterial: ${hypertension.id}`,
    );
    console.log(
      `Diabetes mellitus tipo 2: ${diabetes.id}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(
  (error: unknown) => {
    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);