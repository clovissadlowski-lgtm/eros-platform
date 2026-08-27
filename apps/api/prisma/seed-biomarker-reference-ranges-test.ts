import 'dotenv/config';

import {
  PrismaPg,
} from '@prisma/adapter-pg';

import {
  BiomarkerReferenceContext,
  BiomarkerReferenceSex,
  PrismaClient,
} from '../src/generated/prisma/client';

const connectionString =
  process.env.DATABASE_URL;

if (
  !connectionString
) {
  throw new Error(
    'DATABASE_URL is not configured.',
  );
}

const adapter =
  new PrismaPg({
    connectionString,
  });

const prisma =
  new PrismaClient({
    adapter,
  });

interface ReferenceRangeSeedItem {
  biomarkerCode: string;

  unit: string;

  minAgeYears:
    number | null;

  maxAgeYears:
    number | null;

  lowerBound:
    string | null;

  upperBound:
    string | null;

  sex:
    BiomarkerReferenceSex;

  context:
    BiomarkerReferenceContext;

  description:
    string;

  sourceName:
    string;

  sourceNote:
    string;
}

const referenceRanges:
  ReferenceRangeSeedItem[] = [
    {
      biomarkerCode:
        'HGB',

      unit:
        'g/dL',

      minAgeYears:
        18,

      maxAgeYears:
        120,

      lowerBound:
        '13.5',

      upperBound:
        '17.5',

      sex:
        BiomarkerReferenceSex.MALE,

      context:
        BiomarkerReferenceContext.GENERAL,

      description:
        'Faixa de referência de teste para hemoglobina em adultos do sexo masculino.',

      sourceName:
        'Higeia - Teste interno',

      sourceNote:
        'Faixa cadastrada exclusivamente para validação funcional do motor de referência laboratorial.',
    },

    {
      biomarkerCode:
        'HGB',

      unit:
        'g/dL',

      minAgeYears:
        18,

      maxAgeYears:
        120,

      lowerBound:
        '12.0',

      upperBound:
        '15.5',

      sex:
        BiomarkerReferenceSex.FEMALE,

      context:
        BiomarkerReferenceContext.GENERAL,

      description:
        'Faixa de referência de teste para hemoglobina em adultos do sexo feminino.',

      sourceName:
        'Higeia - Teste interno',

      sourceNote:
        'Faixa cadastrada exclusivamente para validação funcional do motor de referência laboratorial.',
    },
  ];

async function seedBiomarkerReferenceRanges():
  Promise<void> {
  console.log(
    'Iniciando seed das faixas de referência de teste...',
  );

  let created =
    0;

  let updated =
    0;

  for (
    const item
    of referenceRanges
  ) {
    const biomarker =
      await prisma.biomarkerCatalog.findFirst({
        where: {
          code:
            item.biomarkerCode,

          active:
            true,
        },
      });

    if (
      !biomarker
    ) {
      throw new Error(
        `Biomarcador ${item.biomarkerCode} não foi encontrado no catálogo.`,
      );
    }

    const existingRange =
      await prisma.biomarkerReferenceRange.findFirst({
        where: {
          biomarkerCatalogId:
            biomarker.id,

          unit:
            item.unit,

          minAgeYears:
            item.minAgeYears,

          maxAgeYears:
            item.maxAgeYears,

          sex:
            item.sex,

          context:
            item.context,
        },
      });

    if (
      existingRange
    ) {
      await prisma.biomarkerReferenceRange.update({
        where: {
          id:
            existingRange.id,
        },

        data: {
          lowerBound:
            item.lowerBound,

          upperBound:
            item.upperBound,

          description:
            item.description,

          sourceName:
            item.sourceName,

          sourceUrl:
            null,

          sourceNote:
            item.sourceNote,

          active:
            true,
        },
      });

      updated +=
        1;

      console.log(
        `Atualizada: ${biomarker.name} | ${item.sex} | ${item.lowerBound} - ${item.upperBound} ${item.unit}`,
      );

      continue;
    }

    await prisma.biomarkerReferenceRange.create({
      data: {
        biomarkerCatalogId:
          biomarker.id,

        unit:
          item.unit,

        minAgeYears:
          item.minAgeYears,

        maxAgeYears:
          item.maxAgeYears,

        lowerBound:
          item.lowerBound,

        upperBound:
          item.upperBound,

        sex:
          item.sex,

        context:
          item.context,

        description:
          item.description,

        sourceName:
          item.sourceName,

        sourceUrl:
          null,

        sourceNote:
          item.sourceNote,

        active:
          true,
      },
    });

    created +=
      1;

    console.log(
      `Criada: ${biomarker.name} | ${item.sex} | ${item.lowerBound} - ${item.upperBound} ${item.unit}`,
    );
  }

  console.log(
    '',
  );

  console.log(
    'Seed das faixas de referência concluído.',
  );

  console.log(
    `Criadas: ${created}`,
  );

  console.log(
    `Atualizadas: ${updated}`,
  );

  console.log(
    `Total processado: ${referenceRanges.length}`,
  );
}

seedBiomarkerReferenceRanges()
  .catch(
    (
      error,
    ) => {
      console.error(
        'Erro ao executar seed das faixas de referência:',
        error,
      );

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );