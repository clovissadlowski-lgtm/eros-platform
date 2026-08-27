import {
  PrismaService,
} from '../src/common/database/prisma.service';

function normalizeTerm(
  value: string,
): string {
  return value
    .normalize(
      'NFD',
    )
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .trim()
    .toLowerCase();
}

interface DietaryItemSeed {
  name: string;

  type:
    | 'FOOD'
    | 'NUTRIENT'
    | 'COMPONENT'
    | 'INGREDIENT'
    | 'OTHER';

  category: string | null;

  description: string | null;

  synonyms: string[];
}

const dietaryItems:
  DietaryItemSeed[] = [
    {
      name:
        'Lactose',

      type:
        'COMPONENT',

      category:
        'Carboidratos',

      description:
        'Carboidrato naturalmente presente no leite e em seus derivados.',

      synonyms: [
        'Açúcar do leite',
      ],
    },

    {
      name:
        'Glúten',

      type:
        'COMPONENT',

      category:
        'Proteínas',

      description:
        'Conjunto de proteínas presente em determinados cereais e produtos derivados.',

      synonyms: [
        'Gluten',
      ],
    },

    {
      name:
        'Vitamina K',

      type:
        'NUTRIENT',

      category:
        'Vitaminas',

      description:
        'Nutriente pertencente ao grupo das vitaminas lipossolúveis.',

      synonyms: [
        'Vitamin K',
      ],
    },

    {
      name:
        'Tomate',

      type:
        'FOOD',

      category:
        'Hortaliças',

      description:
        'Alimento de origem vegetal utilizado em preparações alimentares diversas.',

      synonyms: [
        'Tomates',
      ],
    },

    {
      name:
        'Leite',

      type:
        'FOOD',

      category:
        'Leites e derivados',

      description:
        'Alimento utilizado diretamente ou como ingrediente em diversas preparações.',

      synonyms: [
        'Leite de vaca',
        'Leite bovino',
      ],
    },

    {
      name:
        'Amendoim',

      type:
        'FOOD',

      category:
        'Leguminosas',

      description:
        'Alimento de origem vegetal consumido isoladamente ou como ingrediente.',

      synonyms: [
        'Amendoins',
        'Peanut',
      ],
    },
  ];

async function main():
  Promise<void> {
  const prisma =
    new PrismaService();

  await prisma.$connect();

  try {
    for (
      const item
      of dietaryItems
    ) {
      const normalizedName =
        normalizeTerm(
          item.name,
        );

      const catalogItem =
        await prisma
          .dietaryItemCatalog
          .upsert({
            where: {
              normalizedName,
            },

            update: {
              name:
                item.name,

              type:
                item.type,

              category:
                item.category,

              description:
                item.description,

              isActive:
                true,
            },

            create: {
              name:
                item.name,

              normalizedName,

              type:
                item.type,

              category:
                item.category,

              description:
                item.description,

              isActive:
                true,
            },
          });

      await prisma
        .dietaryItemSynonym
        .deleteMany({
          where: {
            dietaryItemCatalogId:
              catalogItem.id,
          },
        });

      if (
        item.synonyms.length >
        0
      ) {
        await prisma
          .dietaryItemSynonym
          .createMany({
            data:
              item.synonyms.map(
                (
                  synonym,
                ) => ({
                  dietaryItemCatalogId:
                    catalogItem.id,

                  term:
                    synonym,

                  normalizedTerm:
                    normalizeTerm(
                      synonym,
                    ),
                }),
              ),

            skipDuplicates:
              true,
          });
      }
    }

    const preparedItems =
      await prisma
        .dietaryItemCatalog
        .findMany({
          where: {
            normalizedName: {
              in:
                dietaryItems.map(
                  (
                    item,
                  ) =>
                    normalizeTerm(
                      item.name,
                    ),
                ),
            },
          },

          include: {
            synonyms:
              true,
          },

          orderBy: {
            name:
              'asc',
          },
        });

    console.log(
      '\nCatálogo alimentar e nutricional de desenvolvimento preparado com sucesso.\n',
    );

    for (
      const item
      of preparedItems
    ) {
      console.log(
        `${item.name}: ${item.id}`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(
  (
    error,
  ) => {
    console.error(
      'Erro ao preparar o catálogo alimentar e nutricional:',
      error,
    );

    process.exitCode =
      1;
  },
);