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

if (!connectionString) {
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

  sourceName:
    string;

  sourceUrl:
    string;

  sourceNote:
    string;

  description:
    string;
}

const referenceRanges:
  ReferenceRangeSeedItem[] = [
    {
      biomarkerCode:
        'GLU',

      unit:
        'mg/dL',

      minAgeYears:
        18,

      maxAgeYears:
        null,

      lowerBound:
        '70',

      upperBound:
        '99',

      sex:
        BiomarkerReferenceSex.ANY,

      context:
        BiomarkerReferenceContext.FASTING,

      sourceName:
        'NIDDK / CDC',

      sourceUrl:
        'https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis',

      sourceNote:
        'Faixa inicial usada para validação do mecanismo automático de glicose plasmática em jejum em adultos. Os limites diagnósticos e a interpretação clínica dependem do contexto.',

      description:
        'Glicose plasmática em jejum para adultos, utilizada inicialmente para validar o mecanismo de resolução automática da Higeia.',
    },
  ];

async function seedBiomarkerReferenceRanges():
Promise<void> {
  console.log(
    'Iniciando seed das faixas de referência...',
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

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
      console.warn(
        `Biomarcador não encontrado: ${item.biomarkerCode}`,
      );

      skipped += 1;

      continue;
    }

    const existing =
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
      existing
    ) {
      await prisma.biomarkerReferenceRange.update({
        where: {
          id:
            existing.id,
        },

        data: {
          lowerBound:
            item.lowerBound,

          upperBound:
            item.upperBound,

          sourceName:
            item.sourceName,

          sourceUrl:
            item.sourceUrl,

          sourceNote:
            item.sourceNote,

          description:
            item.description,

          active:
            true,
        },
      });

      updated += 1;

      console.log(
        `Atualizado: ${biomarker.name} (${item.context})`,
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

        sourceName:
          item.sourceName,

        sourceUrl:
          item.sourceUrl,

        sourceNote:
          item.sourceNote,

        description:
          item.description,

        active:
          true,
      },
    });

    created += 1;

    console.log(
      `Criado: ${biomarker.name} (${item.context})`,
    );
  }

  console.log('');

  console.log(
    'Seed das faixas de referência concluído.',
  );

  console.log(
    `Criados: ${created}`,
  );

  console.log(
    `Atualizados: ${updated}`,
  );

  console.log(
    `Ignorados: ${skipped}`,
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