'use client';

import {
  useAnthropometricAssessmentResults,
} from './hooks/use-anthropometric-assessment-results';

import type {
  AnthropometricCalculation,
  JacksonPollockEligibility,
} from './medical-record.types';

interface AnthropometricAssessmentResultsPanelProps {
  patientId: string;
  assessmentId: string;
}

const calculationLabels:
  Record<AnthropometricCalculation['code'], string> = {
    BMI: 'IMC',
    BODY_DENSITY: 'Densidade corporal',
    BODY_FAT_PERCENTAGE: 'Gordura corporal',
    FAT_MASS_KG: 'Massa gorda',
    LEAN_MASS_KG: 'Massa magra',
  };

function formatCalculationValue(
  calculation: AnthropometricCalculation,
): string {
  return `${calculation.value.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits:
        calculation.code === 'BODY_DENSITY'
          ? 6
          : 2,
    },
  )} ${calculation.unit}`;
}

function formatMethod(
  method: string,
): string {
  const labels:
    Record<string, string> = {
      WEIGHT_HEIGHT_BMI:
        'Peso e altura',
      JACKSON_POLLOCK_3:
        'Jackson-Pollock 3 dobras',
      JACKSON_POLLOCK_7:
        'Jackson-Pollock 7 dobras',
      SIRI:
        'Equação de Siri',
      WEIGHT_BODY_FAT_PERCENTAGE:
        'Peso e percentual de gordura',
    };

  return (
    labels[method] ??
    method
  );
}

function getEligibilityMessage(
  eligibility: JacksonPollockEligibility,
): string | null {
  switch (eligibility.reason) {
    case 'MISSING_AGE':
      return 'O cálculo por Jackson-Pollock não foi realizado porque a data de nascimento do paciente não está disponível.';

    case 'MISSING_BIOLOGICAL_SEX':
      return 'O cálculo por Jackson-Pollock não foi realizado porque o sexo biológico necessário para a equação não está disponível.';

    case 'BELOW_REFERENCE_AGE':
      return eligibility.referenceAgeRange
        ? `O cálculo por Jackson-Pollock não foi realizado porque a idade está abaixo da faixa de referência utilizada pela Higeia (${eligibility.referenceAgeRange.minimumYears}–${eligibility.referenceAgeRange.maximumYears} anos).`
        : 'O cálculo por Jackson-Pollock não foi realizado porque a idade está abaixo da faixa de referência.';

    case 'ABOVE_REFERENCE_AGE':
      return eligibility.referenceAgeRange
        ? `O cálculo por Jackson-Pollock não foi realizado porque a idade está acima da faixa de referência utilizada pela Higeia (${eligibility.referenceAgeRange.minimumYears}–${eligibility.referenceAgeRange.maximumYears} anos).`
        : 'O cálculo por Jackson-Pollock não foi realizado porque a idade está acima da faixa de referência.';

    case 'ELIGIBLE':
      return null;
  }
}

export function AnthropometricAssessmentResultsPanel({
  patientId,
  assessmentId,
}: AnthropometricAssessmentResultsPanelProps) {
  const resultsQuery =
    useAnthropometricAssessmentResults(
      patientId,
      assessmentId,
    );

  if (resultsQuery.isLoading) {
    return (
      <div className="rounded-lg border bg-muted/20 p-3">
        <p className="text-xs text-muted-foreground">
          Calculando resultados Higeia...
        </p>
      </div>
    );
  }

  if (
    resultsQuery.isError ||
    !resultsQuery.data
  ) {
    return (
      <div className="rounded-lg border p-3">
        <p className="text-xs text-muted-foreground">
          Não foi possível carregar os resultados calculados desta avaliação.
        </p>
      </div>
    );
  }

  const {
    calculations,
    jacksonPollockEligibility,
  } = resultsQuery.data;

  const eligibilityMessage =
    jacksonPollockEligibility
      ? getEligibilityMessage(
          jacksonPollockEligibility,
        )
      : null;

  if (
    calculations.length === 0 &&
    !eligibilityMessage
  ) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
      <div>
        <p className="text-sm font-medium">
          Resultados Higeia
        </p>

        <p className="text-xs text-muted-foreground">
          Resultados derivados dos dados registrados nesta avaliação.
        </p>
      </div>

      {calculations.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {calculations.map(
            (
              calculation,
            ) => (
              <div
                key={
                  calculation.code
                }
                className="rounded-md border bg-background p-3"
              >
                <p className="text-xs text-muted-foreground">
                  {
                    calculationLabels[
                      calculation.code
                    ]
                  }
                </p>

                <p className="mt-1 font-medium">
                  {formatCalculationValue(
                    calculation,
                  )}
                </p>

                <div className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                  <p>
                    Calculado pela Higeia
                  </p>

                  <p>
                    {formatMethod(
                      calculation.method,
                    )}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {eligibilityMessage && (
        <div className="rounded-md border bg-background p-3">
          <p className="text-xs font-medium">
            Jackson-Pollock
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {eligibilityMessage}
          </p>
        </div>
      )}
    </div>
  );
}