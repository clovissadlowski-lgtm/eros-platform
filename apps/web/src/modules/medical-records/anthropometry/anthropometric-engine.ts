import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
  AnthropometricCalculationCode,
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
} from '../medical-record.types';

export interface HigeiaInterpretationItem {
  label: string;
  value: string;
  description: string;
}

export interface HigeiaDataQualityAlert {
  code: string;
  title: string;
  description: string;
}

export interface AnthropometricContextInsight {
  code: string;
  label: string;
  value: string;
  description: string;
}

interface BodyFatObservation {
  value: number | null;
  source:
    | 'HIGEIA_CALCULATION'
    | 'PROFESSIONAL_INPUT'
    | null;
  method: string | null;
}

function getBodyFatObservation(
  assessment: AnthropometricAssessment,
  results:
    | AnthropometricAssessmentResults
    | undefined,
): BodyFatObservation {
  const calculated =
    results?.calculations.find(
      (
        calculation,
      ) =>
        calculation.code ===
        'BODY_FAT_PERCENTAGE',
    );

  if (calculated) {
    return {
      value:
        calculated.value,
      source:
        'HIGEIA_CALCULATION',
      method:
        calculated.method ??
        null,
    };
  }

  if (
    assessment.bodyFatPercentage !==
    null
  ) {
    return {
      value:
        assessment.bodyFatPercentage,
      source:
        'PROFESSIONAL_INPUT',
      method:
        assessment.bodyCompositionMethod ??
        null,
    };
  }

  return {
    value:
      null,
    source:
      null,
    method:
      null,
  };
}

function areBodyFatObservationsComparable(
  current: BodyFatObservation,
  previous: BodyFatObservation,
): boolean {
  if (
    current.value === null ||
    previous.value === null
  ) {
    return false;
  }

  if (
    current.source !==
    previous.source
  ) {
    return false;
  }

  if (
    current.method !==
    previous.method
  ) {
    return false;
  }

  return true;
}

function formatTrend(
  difference: number,
  unit: string,
): string {
  if (
    Math.abs(
      difference,
    ) <
    0.01
  ) {
    return `Estável (${formatSignedDifference(
      difference,
      unit,
    )})`;
  }

  return difference >
    0
    ? `Aumento de ${formatSignedDifference(
        difference,
        unit,
      ).replace(
        '+',
        '',
      )}`
    : `Redução de ${Math.abs(
        difference,
      ).toLocaleString(
        'pt-BR',
        {
          maximumFractionDigits: 2,
        },
      )} ${unit}`;
}

export function buildAnthropometricContextInsights(
  currentAssessment: AnthropometricAssessment,
  previousAssessment: AnthropometricAssessment | null,
  currentResults:
    | AnthropometricAssessmentResults
    | undefined,
  previousResults:
    | AnthropometricAssessmentResults
    | undefined,
): AnthropometricContextInsight[] {
  const insights:
    AnthropometricContextInsight[] = [];

  if (previousAssessment) {
    if (
      currentAssessment.weightKg !==
        null &&
      previousAssessment.weightKg !==
        null
    ) {
      const difference =
        currentAssessment.weightKg -
        previousAssessment.weightKg;

      insights.push({
        code:
          'WEIGHT_TREND',
        label:
          'Tendência de peso',
        value:
          formatTrend(
            difference,
            'kg',
          ),
        description:
          'Comparação objetiva com a avaliação imediatamente anterior.',
      });
    }

    const currentWaist =
      getCircumferenceValue(
        currentAssessment,
        'WAIST',
        'NOT_APPLICABLE',
        'NOT_APPLICABLE',
      );

    const previousWaist =
      getCircumferenceValue(
        previousAssessment,
        'WAIST',
        'NOT_APPLICABLE',
        'NOT_APPLICABLE',
      );

    if (
      currentWaist !==
        null &&
      previousWaist !==
        null
    ) {
      const difference =
        currentWaist -
        previousWaist;

      insights.push({
        code:
          'WAIST_TREND',
        label:
          'Tendência de cintura',
        value:
          formatTrend(
            difference,
            'cm',
          ),
        description:
          'Comparação objetiva com a avaliação imediatamente anterior.',
      });
    }

    const currentBodyFat =
      getBodyFatObservation(
        currentAssessment,
        currentResults,
      );

    const previousBodyFat =
      getBodyFatObservation(
        previousAssessment,
        previousResults,
      );

    const bodyFatComparable =
      areBodyFatObservationsComparable(
        currentBodyFat,
        previousBodyFat,
      );

    if (
      bodyFatComparable &&
      currentBodyFat.value !==
        null &&
      previousBodyFat.value !==
        null
    ) {
      const difference =
        currentBodyFat.value -
        previousBodyFat.value;

      insights.push({
        code:
          'BODY_FAT_TREND',
        label:
          'Tendência de gordura corporal',
        value:
          formatTrend(
            difference,
            'p.p.',
          ),
        description:
          'Comparação objetiva do percentual de gordura com a avaliação imediatamente anterior usando registros metodologicamente comparáveis.',
      });
    } else if (
      currentBodyFat.value !==
        null &&
      previousBodyFat.value !==
        null
    ) {
      insights.push({
        code:
          'BODY_FAT_COMPARABILITY_LIMIT',
        label:
          'Comparabilidade da gordura corporal',
        value:
          'Comparação limitada por mudança de método',
        description:
          'A Higeia não calculou tendência entre estes percentuais de gordura porque a origem ou o método registrado mudou entre as avaliações.',
      });
    }
  }

  const bodyFatCalculation =
    currentResults?.calculations.find(
      (
        calculation,
      ) =>
        calculation.code ===
        'BODY_FAT_PERCENTAGE',
    );

  if (bodyFatCalculation) {
    insights.push({
      code:
        'BODY_FAT_SOURCE',
      label:
        'Origem da composição corporal',
      value:
        'Resultado calculado pela Higeia',
      description:
        `Método registrado: ${bodyFatCalculation.method}.`,
    });
  } else if (
    currentAssessment.bodyFatPercentage !==
    null
  ) {
    insights.push({
      code:
        'BODY_FAT_SOURCE',
      label:
        'Origem da composição corporal',
      value:
        'Valor informado pelo profissional',
      description:
        'O percentual de gordura foi registrado diretamente nesta avaliação.',
    });
  }

  if (previousAssessment) {
    const currentWaist =
      getCircumferenceValue(
        currentAssessment,
        'WAIST',
        'NOT_APPLICABLE',
        'NOT_APPLICABLE',
      );

    const previousWaist =
      getCircumferenceValue(
        previousAssessment,
        'WAIST',
        'NOT_APPLICABLE',
        'NOT_APPLICABLE',
      );

    const currentBodyFat =
      getBodyFatObservation(
        currentAssessment,
        currentResults,
      );

    const previousBodyFat =
      getBodyFatObservation(
        previousAssessment,
        previousResults,
      );

    const bodyFatComparable =
      areBodyFatObservationsComparable(
        currentBodyFat,
        previousBodyFat,
      );

    const weightDifference =
      currentAssessment.weightKg !== null &&
      previousAssessment.weightKg !== null
        ? currentAssessment.weightKg -
          previousAssessment.weightKg
        : null;

    const waistDifference =
      currentWaist !== null &&
      previousWaist !== null
        ? currentWaist -
          previousWaist
        : null;

    const bodyFatDifference =
      bodyFatComparable &&
      currentBodyFat.value !==
        null &&
      previousBodyFat.value !==
        null
        ? currentBodyFat.value -
          previousBodyFat.value
        : null;

    const hasSuspiciousWaistVariation =
      waistDifference !== null &&
      Math.abs(waistDifference) >= 10;

    if (
      !hasSuspiciousWaistVariation &&
      weightDifference !== null &&
      waistDifference !== null
    ) {
      let value:
        | string
        | null = null;
      let description =
        'Leitura combinada de peso e cintura em relação à avaliação imediatamente anterior.';

      if (
        weightDifference > 0.1 &&
        waistDifference < -0.5
      ) {
        value =
          'Peso aumentou e cintura reduziu';
      } else if (
        weightDifference < -0.1 &&
        waistDifference < -0.5
      ) {
        value =
          'Peso e cintura reduziram';
      } else if (
        weightDifference > 0.1 &&
        waistDifference > 0.5
      ) {
        value =
          'Peso e cintura aumentaram';
      } else if (
        weightDifference < -0.1 &&
        waistDifference > 0.5
      ) {
        value =
          'Peso reduziu e cintura aumentou';
      }

      if (value) {
        insights.push({
          code:
            'WEIGHT_WAIST_COMBINED_TREND',
          label:
            'Evolução combinada',
          value,
          description,
        });
      }
    }

    if (
      !hasSuspiciousWaistVariation &&
      bodyFatDifference !== null &&
      weightDifference !== null
    ) {
      let value:
        | string
        | null = null;

      if (
        weightDifference > 0.1 &&
        bodyFatDifference < -0.2
      ) {
        value =
          'Peso aumentou com redução do percentual de gordura';
      } else if (
        weightDifference < -0.1 &&
        bodyFatDifference < -0.2
      ) {
        value =
          'Peso e percentual de gordura reduziram';
      } else if (
        weightDifference > 0.1 &&
        bodyFatDifference > 0.2
      ) {
        value =
          'Peso e percentual de gordura aumentaram';
      } else if (
        weightDifference < -0.1 &&
        bodyFatDifference > 0.2
      ) {
        value =
          'Peso reduziu com aumento do percentual de gordura';
      }

      if (value) {
        insights.push({
          code:
            'WEIGHT_BODY_FAT_COMBINED_TREND',
          label:
            'Composição da evolução',
          value,
          description:
            'Leitura combinada do peso e do percentual de gordura, sem atribuição automática de causa clínica.',
        });
      }
    }

    if (
      !hasSuspiciousWaistVariation &&
      bodyFatDifference !== null &&
      waistDifference !== null
    ) {
      let value:
        | string
        | null = null;

      if (
        waistDifference < -0.5 &&
        bodyFatDifference < -0.2
      ) {
        value =
          'Cintura e percentual de gordura reduziram';
      } else if (
        waistDifference > 0.5 &&
        bodyFatDifference > 0.2
      ) {
        value =
          'Cintura e percentual de gordura aumentaram';
      }

      if (value) {
        insights.push({
          code:
            'WAIST_BODY_FAT_COMBINED_TREND',
          label:
            'Convergência dos indicadores',
          value,
          description:
            'Os indicadores disponíveis apresentam direção concordante em relação à avaliação anterior.',
        });
      }
    }
  }

  return insights;
}

export function getCalculationValue(
  results:
    | AnthropometricAssessmentResults
    | undefined,
  code: AnthropometricCalculationCode,
): number | null {
  return (
    results?.calculations.find(
      (
        calculation,
      ) =>
        calculation.code ===
        code,
    )?.value ??
    null
  );
}

export function getCircumferenceValue(
  assessment: AnthropometricAssessment,
  site: AnthropometricCircumferenceSite,
  side: AnthropometricMeasurementSide,
  state: AnthropometricCircumferenceState,
): number | null {
  const structured =
    assessment.circumferenceMeasurements.find(
      (
        measurement,
      ) =>
        measurement.site ===
          site &&
        measurement.side ===
          side &&
        measurement.state ===
          state,
    );

  if (structured) {
    return structured.valueCm;
  }

  if (
    side === 'NOT_APPLICABLE' &&
    state === 'NOT_APPLICABLE'
  ) {
    switch (site) {
      case 'WAIST':
        return assessment.waistCircumferenceCm;

      case 'HIP':
        return assessment.hipCircumferenceCm;

      case 'ABDOMEN':
        return assessment.abdomenCircumferenceCm;

      case 'CHEST':
        return assessment.chestCircumferenceCm;

      default:
        return null;
    }
  }

  return null;
}

export function calculateRatio(
  numerator: number | null,
  denominator: number | null,
): number | null {
  if (
    numerator === null ||
    denominator === null ||
    denominator <= 0
  ) {
    return null;
  }

  return numerator /
    denominator;
}

export function formatRatio(
  value: number | null,
): string {
  if (value === null) {
    return '—';
  }

  return value.toLocaleString(
    'pt-BR',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
}

export function formatSignedDifference(
  difference: number,
  unit: string,
): string {
  const prefix =
    difference > 0
      ? '+'
      : '';

  return `${prefix}${difference.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2,
    },
  )} ${unit}`;
}

export function getAdultBmiClassification(
  bmi: number | null,
  population:
    | string
    | undefined,
): HigeiaInterpretationItem | null {
  if (
    bmi === null ||
    population !== 'ADULT'
  ) {
    return null;
  }

  if (bmi < 18.5) {
    return {
      label:
        'Classificação do IMC',
      value:
        'Baixo peso',
      description:
        'Classificação automática aplicada somente ao contexto adulto.',
    };
  }

  if (bmi < 25) {
    return {
      label:
        'Classificação do IMC',
      value:
        'Eutrofia',
      description:
        'Classificação automática aplicada somente ao contexto adulto.',
    };
  }

  if (bmi < 30) {
    return {
      label:
        'Classificação do IMC',
      value:
        'Sobrepeso',
      description:
        'Classificação automática aplicada somente ao contexto adulto.',
    };
  }

  if (bmi < 35) {
    return {
      label:
        'Classificação do IMC',
      value:
        'Obesidade grau I',
      description:
        'Classificação automática aplicada somente ao contexto adulto.',
    };
  }

  if (bmi < 40) {
    return {
      label:
        'Classificação do IMC',
      value:
        'Obesidade grau II',
      description:
        'Classificação automática aplicada somente ao contexto adulto.',
    };
  }

  return {
    label:
      'Classificação do IMC',
    value:
      'Obesidade grau III',
    description:
      'Classificação automática aplicada somente ao contexto adulto.',
  };
}

export function buildAnthropometricDataQualityAlerts(
  currentAssessment: AnthropometricAssessment,
  previousAssessment: AnthropometricAssessment | null,
): HigeiaDataQualityAlert[] {
  if (!previousAssessment) {
    return [];
  }

  const alerts:
    HigeiaDataQualityAlert[] = [];

  if (
    currentAssessment.weightKg !==
      null &&
    previousAssessment.weightKg !==
      null &&
    previousAssessment.weightKg >
      0
  ) {
    const weightDifference =
      currentAssessment.weightKg -
      previousAssessment.weightKg;

    const weightVariationPercentage =
      Math.abs(
        weightDifference,
      ) /
      previousAssessment.weightKg *
      100;

    if (
      weightVariationPercentage >=
      7
    ) {
      alerts.push({
        code:
          'WEIGHT_VARIATION',
        title:
          'Variação importante de peso',
        description:
          `O peso variou ${formatSignedDifference(
            weightDifference,
            'kg',
          )} em relação à avaliação anterior. Confirme se a medição e a data registradas estão corretas.`,
      });
    }
  }

  if (
    currentAssessment.heightCm !==
      null &&
    previousAssessment.heightCm !==
      null
  ) {
    const heightDifference =
      currentAssessment.heightCm -
      previousAssessment.heightCm;

    if (
      Math.abs(
        heightDifference,
      ) >=
      2
    ) {
      alerts.push({
        code:
          'HEIGHT_VARIATION',
        title:
          'Variação atípica de altura',
        description:
          `A altura variou ${formatSignedDifference(
            heightDifference,
            'cm',
          )} em relação à avaliação anterior. Em adultos, esse tipo de diferença pode indicar variação de técnica ou registro.`,
      });
    }
  }

  const currentWaist =
    getCircumferenceValue(
      currentAssessment,
      'WAIST',
      'NOT_APPLICABLE',
      'NOT_APPLICABLE',
    );

  const previousWaist =
    getCircumferenceValue(
      previousAssessment,
      'WAIST',
      'NOT_APPLICABLE',
      'NOT_APPLICABLE',
    );

  if (
    currentWaist !==
      null &&
    previousWaist !==
      null
  ) {
    const waistDifference =
      currentWaist -
      previousWaist;

    if (
      Math.abs(
        waistDifference,
      ) >=
      10
    ) {
      alerts.push({
        code:
          'WAIST_VARIATION',
        title:
          'Variação atípica de cintura',
        description:
          `A cintura variou ${formatSignedDifference(
            waistDifference,
            'cm',
          )} em relação à avaliação anterior. Recomenda-se conferir ponto anatômico, técnica de medição e valor registrado.`,
      });
    }
  }

  return alerts;
}

export interface AnthropometricLongitudinalEntry {
  assessment: AnthropometricAssessment;
  results?: AnthropometricAssessmentResults;
}

type LongitudinalDirection =
  | 'INCREASE'
  | 'DECREASE'
  | 'STABLE';

interface LongitudinalSeriesPoint {
  measuredAt: string;
  value: number;
}

interface LongitudinalSeriesAnalysis {
  value: string;
  description: string;
}

function getLongitudinalDirection(
  difference: number,
  stableTolerance: number,
): LongitudinalDirection {
  if (
    Math.abs(difference) <=
    stableTolerance
  ) {
    return 'STABLE';
  }

  return difference > 0
    ? 'INCREASE'
    : 'DECREASE';
}

function analyzeLongitudinalSeries(
  points: LongitudinalSeriesPoint[],
  stableTolerance: number,
  metricLabel: string,
): LongitudinalSeriesAnalysis | null {
  if (points.length < 3) {
    return null;
  }

  const differences =
    points
      .slice(1)
      .map(
        (point, index) =>
          point.value -
          points[index].value,
      );

  const directions =
    differences.map(
      (difference) =>
        getLongitudinalDirection(
          difference,
          stableTolerance,
        ),
    );

  const nonStableDirections =
    directions.filter(
      (
        direction,
      ): direction is
        | 'INCREASE'
        | 'DECREASE' =>
        direction !==
        'STABLE',
    );

  if (
    nonStableDirections.length ===
    0
  ) {
    return {
      value:
        'Trajetória estável',
      description:
        `As últimas ${points.length} avaliações disponíveis de ${metricLabel} permaneceram dentro da faixa de estabilidade definida pela Higeia.`,
    };
  }

  const allIncrease =
    nonStableDirections.every(
      (direction) =>
        direction ===
        'INCREASE',
    );

  const allDecrease =
    nonStableDirections.every(
      (direction) =>
        direction ===
        'DECREASE',
    );

  if (
    allIncrease ||
    allDecrease
  ) {
    const hasStableInterval =
      directions.some(
        (direction) =>
          direction ===
          'STABLE',
      );

    return {
      value:
        allIncrease
          ? hasStableInterval
            ? 'Trajetória predominantemente crescente'
            : 'Trajetória consistentemente crescente'
          : hasStableInterval
            ? 'Trajetória predominantemente decrescente'
            : 'Trajetória consistentemente decrescente',
      description:
        `Leitura longitudinal baseada em ${points.length} avaliações disponíveis de ${metricLabel}, sem atribuição de causa clínica.`,
    };
  }

  const latestDirection =
    [...directions]
      .reverse()
      .find(
        (
          direction,
        ) =>
          direction !==
          'STABLE',
      );

  const earlierNonStableDirections =
    directions
      .slice(
        0,
        -1,
      )
      .filter(
        (
          direction,
        ): direction is
          | 'INCREASE'
          | 'DECREASE' =>
          direction !==
          'STABLE',
      );

  if (
    latestDirection &&
    earlierNonStableDirections.length >
      0 &&
    earlierNonStableDirections.every(
      (direction) =>
        direction ===
        earlierNonStableDirections[0],
    ) &&
    latestDirection !==
      earlierNonStableDirections[0]
  ) {
    return {
      value:
        'Mudança recente de direção',
      description:
        `A sequência de ${metricLabel} mudou de direção na avaliação mais recente. A Higeia descreve a trajetória, sem inferir a causa da mudança.`,
    };
  }

  return {
    value:
      'Trajetória oscilante',
    description:
      `As últimas ${points.length} avaliações disponíveis de ${metricLabel} alternaram direção, sem uma tendência única consistente.`,
  };
}

function hasSuspiciousLongitudinalWeightVariation(
  points: LongitudinalSeriesPoint[],
): boolean {
  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    const previous =
      points[index - 1].value;
    const current =
      points[index].value;

    if (previous <= 0) {
      continue;
    }

    const variationPercentage =
      Math.abs(
        current -
        previous,
      ) /
      previous *
      100;

    if (
      variationPercentage >=
      7
    ) {
      return true;
    }
  }

  return false;
}

function hasSuspiciousLongitudinalWaistVariation(
  points: LongitudinalSeriesPoint[],
): boolean {
  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    const difference =
      points[index].value -
      points[index - 1].value;

    if (
      Math.abs(
        difference,
      ) >=
      10
    ) {
      return true;
    }
  }

  return false;
}

export function buildAnthropometricLongitudinalInsights(
  entries: AnthropometricLongitudinalEntry[],
): AnthropometricContextInsight[] {
  if (entries.length < 3) {
    return [];
  }

  const orderedEntries =
    [...entries].sort(
      (
        first,
        second,
      ) =>
        new Date(
          first.assessment.measuredAt,
        ).getTime() -
        new Date(
          second.assessment.measuredAt,
        ).getTime(),
    );

  const insights:
    AnthropometricContextInsight[] = [];

  const weightPoints =
    orderedEntries
      .filter(
        (
          entry,
        ) =>
          entry.assessment.weightKg !==
          null,
      )
      .map(
        (
          entry,
        ) => ({
          measuredAt:
            entry.assessment.measuredAt,
          value:
            entry.assessment.weightKg as number,
        }),
      );

  if (weightPoints.length >= 3) {
    if (
      hasSuspiciousLongitudinalWeightVariation(
        weightPoints,
      )
    ) {
      insights.push({
        code:
          'LONGITUDINAL_WEIGHT_DATA_LIMIT',
        label:
          'Leitura longitudinal do peso',
        value:
          'Leitura limitada por variação atípica',
        description:
          'A Higeia não classificou a trajetória longitudinal do peso porque existe ao menos uma variação de 7% ou mais entre avaliações consecutivas. Recomenda-se conferir datas, medição e registro antes de interpretar a série.',
      });
    } else {
      const analysis =
        analyzeLongitudinalSeries(
          weightPoints,
          0.1,
          'peso',
        );

      if (analysis) {
        insights.push({
          code:
            'LONGITUDINAL_WEIGHT_TREND',
          label:
            'Trajetória longitudinal do peso',
          value:
            analysis.value,
          description:
            analysis.description,
        });
      }
    }
  }

  const waistPoints =
    orderedEntries
      .map(
        (
          entry,
        ) => ({
          measuredAt:
            entry.assessment.measuredAt,
          value:
            getCircumferenceValue(
              entry.assessment,
              'WAIST',
              'NOT_APPLICABLE',
              'NOT_APPLICABLE',
            ),
        }),
      )
      .filter(
        (
          point,
        ): point is LongitudinalSeriesPoint =>
          point.value !==
          null,
      );

  if (waistPoints.length >= 3) {
    if (
      hasSuspiciousLongitudinalWaistVariation(
        waistPoints,
      )
    ) {
      insights.push({
        code:
          'LONGITUDINAL_WAIST_DATA_LIMIT',
        label:
          'Leitura longitudinal da cintura',
        value:
          'Leitura limitada por variação atípica',
        description:
          'A Higeia não classificou a trajetória longitudinal da cintura porque existe ao menos uma variação de 10 cm ou mais entre avaliações consecutivas. Recomenda-se conferir ponto anatômico, técnica e registro.',
      });
    } else {
      const analysis =
        analyzeLongitudinalSeries(
          waistPoints,
          0.5,
          'cintura',
        );

      if (analysis) {
        insights.push({
          code:
            'LONGITUDINAL_WAIST_TREND',
          label:
            'Trajetória longitudinal da cintura',
          value:
            analysis.value,
          description:
            analysis.description,
        });
      }
    }
  }

  const bodyFatEntries =
    orderedEntries
      .map(
        (
          entry,
        ) => ({
          measuredAt:
            entry.assessment.measuredAt,
          observation:
            getBodyFatObservation(
              entry.assessment,
              entry.results,
            ),
        }),
      )
      .filter(
        (
          entry,
        ) =>
          entry.observation.value !==
          null,
      );

  if (
    bodyFatEntries.length >=
    3
  ) {
    const referenceObservation =
      bodyFatEntries[0]
        .observation;

    const bodyFatComparable =
      bodyFatEntries.every(
        (
          entry,
        ) =>
          areBodyFatObservationsComparable(
            entry.observation,
            referenceObservation,
          ),
      );

    if (!bodyFatComparable) {
      insights.push({
        code:
          'LONGITUDINAL_BODY_FAT_COMPARABILITY_LIMIT',
        label:
          'Trajetória longitudinal da gordura corporal',
        value:
          'Comparação longitudinal limitada por mudança de método',
        description:
          'A Higeia não classificou a trajetória do percentual de gordura porque a origem ou o método não permaneceu comparável ao longo da série.',
      });
    } else {
      const bodyFatPoints =
        bodyFatEntries.map(
          (
            entry,
          ) => ({
            measuredAt:
              entry.measuredAt,
            value:
              entry.observation.value as number,
          }),
        );

      const analysis =
        analyzeLongitudinalSeries(
          bodyFatPoints,
          0.2,
          'percentual de gordura',
        );

      if (analysis) {
        insights.push({
          code:
            'LONGITUDINAL_BODY_FAT_TREND',
          label:
            'Trajetória longitudinal da gordura corporal',
          value:
            analysis.value,
          description:
            analysis.description,
        });
      }
    }
  }

  return insights;
}

