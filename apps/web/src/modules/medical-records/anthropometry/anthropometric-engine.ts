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
      getCalculationValue(
        currentResults,
        'BODY_FAT_PERCENTAGE',
      ) ??
      currentAssessment.bodyFatPercentage;

    const previousBodyFat =
      getCalculationValue(
        previousResults,
        'BODY_FAT_PERCENTAGE',
      ) ??
      previousAssessment.bodyFatPercentage;

    if (
      currentBodyFat !==
        null &&
      previousBodyFat !==
        null
    ) {
      const difference =
        currentBodyFat -
        previousBodyFat;

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
          'Comparação objetiva do percentual de gordura com a avaliação imediatamente anterior.',
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
      getCalculationValue(
        currentResults,
        'BODY_FAT_PERCENTAGE',
      ) ??
      currentAssessment.bodyFatPercentage;

    const previousBodyFat =
      getCalculationValue(
        previousResults,
        'BODY_FAT_PERCENTAGE',
      ) ??
      previousAssessment.bodyFatPercentage;

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
      currentBodyFat !== null &&
      previousBodyFat !== null
        ? currentBodyFat -
          previousBodyFat
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
