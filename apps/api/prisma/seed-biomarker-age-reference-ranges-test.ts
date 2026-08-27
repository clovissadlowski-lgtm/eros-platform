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
  biomarkerCode:
    string;

  unit:
    string;

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
        59,

      lowerBound:
        '12.0',

      upperBound:
        '15.5',

      sex:
        BiomarkerReferenceSex.FEMALE,

      context:
        BiomarkerReferenceContext.GENERAL,

      description:
        'Faixa controlada de teste para hemoglobina em mulheres adultas de 18 a 59 anos.',

      sourceName:
        'Higeia - Teste interno',

      sourceNote:
        'Faixa sintética utilizada exclusivamente para validação funcional da seleção por idade.',
    },

    {
      biomarkerCode:
        'HGB',

      unit:
        'g/dL',

      minAgeYears:
        60,

      maxAgeYears:
        120,

      lowerBound:
        '11.5',

      upperBound:
        '15.0',

      sex:
        BiomarkerReferenceSex.FEMALE,

      context:
        BiomarkerReferenceContext.GENERAL,

      description:
        'Faixa controlada de teste para hemoglobina em mulheres com 60 anos ou mais.',

      sourceName:
        'Higeia - Teste interno',

      sourceNote:
        'Faixa sintética utilizada exclusivamente para validação funcional da seleção por idade.',
    },
  ];

async function seedBiomarkerAgeReferenceRanges():
  Promise<void> {
  console.log(
    'Iniciando seed das faixas de referência por idade...',
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
        `Atualizada: ${biomarker.name} | ${item.sex} | ${item.minAgeYears}-${item.maxAgeYears} anos | ${item.lowerBound}-${item.upperBound} ${item.unit}`,
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
      `Criada: ${biomarker.name} | ${item.sex} | ${item.minAgeYears}-${item.maxAgeYears} anos | ${item.lowerBound}-${item.upperBound} ${item.unit}`,
    );
  }

  console.log(
    '',
  );

  console.log(
    'Seed das faixas de referência por idade concluído.',
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

seedBiomarkerAgeReferenceRanges()
  .catch(
    (
      error,
    ) => {
      console.error(
        'Erro ao executar seed das faixas de referência por idade:',
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