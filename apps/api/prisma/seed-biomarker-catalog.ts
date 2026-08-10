import 'dotenv/config';

import {
  PrismaPg,
} from '@prisma/adapter-pg';

import {
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

interface BiomarkerSeedItem {
  name: string;

  code: string;

  defaultUnit:
    string | null;

  description: string;
}

const biomarkers:
BiomarkerSeedItem[] = [
  {
    name:
      'Hemoglobina',

    code:
      'HGB',

    defaultUnit:
      'g/dL',

    description:
      'Concentração de hemoglobina no sangue.',
  },

  {
    name:
      'Hematócrito',

    code:
      'HCT',

    defaultUnit:
      '%',

    description:
      'Percentual do volume sanguíneo ocupado por hemácias.',
  },

  {
    name:
      'Leucócitos',

    code:
      'WBC',

    defaultUnit:
      '/µL',

    description:
      'Contagem total de leucócitos no sangue.',
  },

  {
    name:
      'Plaquetas',

    code:
      'PLT',

    defaultUnit:
      '/µL',

    description:
      'Contagem de plaquetas no sangue.',
  },

  {
    name:
      'Glicose',

    code:
      'GLU',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração de glicose no sangue.',
  },

  {
    name:
      'Hemoglobina glicada',

    code:
      'HBA1C',

    defaultUnit:
      '%',

    description:
      'Hemoglobina glicada utilizada para avaliação do controle glicêmico ao longo do tempo.',
  },

  {
    name:
      'Colesterol total',

    code:
      'CHOL',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração total de colesterol no sangue.',
  },

  {
    name:
      'Colesterol HDL',

    code:
      'HDL',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração de colesterol transportado por lipoproteínas de alta densidade.',
  },

  {
    name:
      'Colesterol LDL',

    code:
      'LDL',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração de colesterol transportado por lipoproteínas de baixa densidade.',
  },

  {
    name:
      'Triglicerídeos',

    code:
      'TG',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração de triglicerídeos no sangue.',
  },

  {
    name:
      'Creatinina',

    code:
      'CREA',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração sérica de creatinina, utilizada na avaliação da função renal.',
  },

  {
    name:
      'Ureia',

    code:
      'UREA',

    defaultUnit:
      'mg/dL',

    description:
      'Concentração de ureia no sangue.',
  },

  {
    name:
      'TSH',

    code:
      'TSH',

    defaultUnit:
      'µUI/mL',

    description:
      'Hormônio estimulante da tireoide.',
  },

  {
    name:
      'T4 livre',

    code:
      'FT4',

    defaultUnit:
      'ng/dL',

    description:
      'Concentração da fração livre da tiroxina.',
  },

  {
    name:
      'Ferritina',

    code:
      'FERRITIN',

    defaultUnit:
      'ng/mL',

    description:
      'Proteína relacionada ao armazenamento de ferro no organismo.',
  },

  {
    name:
      'Vitamina D 25-OH',

    code:
      '25OHVITD',

    defaultUnit:
      'ng/mL',

    description:
      'Concentração sérica de 25-hidroxivitamina D.',
  },

  {
    name:
      'Vitamina B12',

    code:
      'B12',

    defaultUnit:
      'pg/mL',

    description:
      'Concentração sérica de vitamina B12.',
  },

  {
    name:
      'AST / TGO',

    code:
      'AST',

    defaultUnit:
      'U/L',

    description:
      'Aspartato aminotransferase, enzima utilizada na avaliação laboratorial hepática e muscular.',
  },

  {
    name:
      'ALT / TGP',

    code:
      'ALT',

    defaultUnit:
      'U/L',

    description:
      'Alanina aminotransferase, enzima utilizada principalmente na avaliação laboratorial hepática.',
  },

  {
    name:
      'Proteína C reativa',

    code:
      'CRP',

    defaultUnit:
      'mg/L',

    description:
      'Marcador laboratorial relacionado à resposta inflamatória.',
  },
];

async function seedBiomarkerCatalog():
Promise<void> {
  console.log(
    'Iniciando seed do catálogo de biomarcadores...',
  );

  let created = 0;
  let updated = 0;

  for (
    const biomarker
    of biomarkers
  ) {
    const existing =
      await prisma.biomarkerCatalog.findFirst({
        where: {
          OR: [
            {
              code:
                biomarker.code,
            },

            {
              name:
                biomarker.name,
            },
          ],
        },
      });

    if (
      existing
    ) {
      await prisma.biomarkerCatalog.update({
        where: {
          id:
            existing.id,
        },

        data: {
          name:
            biomarker.name,

          code:
            biomarker.code,

          defaultUnit:
            biomarker.defaultUnit,

          description:
            biomarker.description,

          active:
            true,
        },
      });

      updated += 1;

      console.log(
        `Atualizado: ${biomarker.name}`,
      );

      continue;
    }

    await prisma.biomarkerCatalog.create({
      data: {
        name:
          biomarker.name,

        code:
          biomarker.code,

        defaultUnit:
          biomarker.defaultUnit,

        description:
          biomarker.description,

        active:
          true,
      },
    });

    created += 1;

    console.log(
      `Criado: ${biomarker.name}`,
    );
  }

  console.log('');

  console.log(
    'Seed do catálogo de biomarcadores concluído.',
  );

  console.log(
    `Criados: ${created}`,
  );

  console.log(
    `Atualizados: ${updated}`,
  );

  console.log(
    `Total processado: ${biomarkers.length}`,
  );
}

seedBiomarkerCatalog()
  .catch(
    (
      error,
    ) => {
      console.error(
        'Erro ao executar seed do catálogo de biomarcadores:',
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