'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  flushSync,
} from 'react-dom';

import {
  Maximize2,
  Printer,
  X,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  useAnthropometricAssessmentsResults,
} from './hooks/use-anthropometric-assessments-results';

import {
  getCalculationValue,
  getCircumferenceValue,
} from './anthropometry/anthropometric-engine';

import {
  AnthropometricLongitudinalPanel,
} from './anthropometry/anthropometric-longitudinal-panel';

import {
  AnthropometricAssessmentDetail,
} from './anthropometry/anthropometric-assessment-detail';

import {
  AnthropometricHistoryTable,
} from './anthropometry/anthropometric-history-table';

import {
  AnthropometricPrintReport,
  HIGEIA_PRINT_STYLES,
} from './anthropometry/anthropometric-print-report';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
  AnthropometricCalculationCode,
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
} from './medical-record.types';

interface AnthropometricAssessmentComparisonPanelProps {
  patientId: string;
  patientName: string;
  patientBirthDate: string | null;
  patientCpf: string | null;
  biologicalSex: 'MALE' | 'FEMALE' | null;
  assessments: AnthropometricAssessment[];

  onEditAssessment: (
    assessment: AnthropometricAssessment,
  ) => void;

  onDeleteAssessment: (
    assessment: AnthropometricAssessment,
  ) => void;

  isDeletingAssessment: boolean;
}

type MetricSection =
  | 'BASIC'
  | 'BODY_COMPOSITION'
  | 'TRUNK'
  | 'UPPER_LIMBS'
  | 'LOWER_LIMBS';

interface LongitudinalMetric {
  key: string;
  label: string;
  section: MetricSection;
  unit: string;
  deltaUnit?: string;

  getValue: (
    assessment: AnthropometricAssessment,
    results:
      | AnthropometricAssessmentResults
      | undefined,
  ) => number | null;
}

function buildMetrics():
  LongitudinalMetric[] {
  return [
    {
      key: 'weight',
      label: 'Peso',
      section: 'BASIC',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.weightKg,
    },

    {
      key: 'height',
      label: 'Altura',
      section: 'BASIC',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          assessment.heightCm,
    },

    {
      key: 'bmi',
      label: 'IMC · Higeia',
      section: 'BASIC',
      unit: 'kg/m²',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'BMI',
          ),
    },

    {
      key: 'body-fat-observed',
      label: 'Gordura corporal · medida',
      section: 'BODY_COMPOSITION',
      unit: '%',
      deltaUnit: 'p.p.',

      getValue:
        (
          assessment,
        ) =>
          assessment.bodyFatPercentage,
    },

    {
      key: 'body-fat-higeia',
      label: 'Gordura corporal · Higeia',
      section: 'BODY_COMPOSITION',
      unit: '%',
      deltaUnit: 'p.p.',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'BODY_FAT_PERCENTAGE',
          ),
    },

    {
      key: 'fat-mass-observed',
      label: 'Massa de gordura · medida',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.fatMassKg,
    },

    {
      key: 'fat-mass-higeia',
      label: 'Massa de gordura · Higeia',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'FAT_MASS_KG',
          ),
    },

    {
      key: 'lean-mass-observed',
      label: 'Massa magra · medida',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.leanMassKg,
    },

    {
      key: 'lean-mass-higeia',
      label: 'Massa magra · Higeia',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'LEAN_MASS_KG',
          ),
    },

    {
      key: 'muscle-mass',
      label: 'Massa muscular · medida',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.muscleMassKg,
    },

    {
      key: 'neck',
      label: 'Pescoço',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'NECK',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'shoulders',
      label: 'Ombros',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'SHOULDERS',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'chest',
      label: 'Tórax',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'CHEST',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'waist',
      label: 'Cintura',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'WAIST',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'abdomen',
      label: 'Abdômen',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ABDOMEN',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'hip',
      label: 'Quadril',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'HIP',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'arm-right-relaxed',
      label: 'Braço D · relaxado',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'RIGHT',
            'RELAXED',
          ),
    },

    {
      key: 'arm-left-relaxed',
      label: 'Braço E · relaxado',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'LEFT',
            'RELAXED',
          ),
    },

    {
      key: 'arm-right-contracted',
      label: 'Braço D · contraído',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'RIGHT',
            'CONTRACTED',
          ),
    },

    {
      key: 'arm-left-contracted',
      label: 'Braço E · contraído',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'LEFT',
            'CONTRACTED',
          ),
    },

    {
      key: 'forearm-right',
      label: 'Antebraço D',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'FOREARM',
            'RIGHT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'forearm-left',
      label: 'Antebraço E',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'FOREARM',
            'LEFT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'thigh-right',
      label: 'Coxa D',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'THIGH',
            'RIGHT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'thigh-left',
      label: 'Coxa E',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'THIGH',
            'LEFT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'calf-right',
      label: 'Panturrilha D',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'CALF',
            'RIGHT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'calf-left',
      label: 'Panturrilha E',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'CALF',
            'LEFT',
            'NOT_APPLICABLE',
          ),
    },
  ];
}

function formatBodyCompositionMethod(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const labels:
    Record<string, string> = {
      BIOIMPEDANCE:
        'Bioimpedância',
      SKINFOLD:
        'Dobras cutâneas',
      DEXA:
        'DEXA',
      OTHER:
        'Outro',
    };

  return (
    labels[value] ??
    value
  );
}

function formatSkinfoldProtocol(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const labels:
    Record<string, string> = {
      JACKSON_POLLOCK_3:
        'Jackson-Pollock 3 dobras',
      JACKSON_POLLOCK_7:
        'Jackson-Pollock 7 dobras',
      OTHER:
        'Outro',
    };

  return (
    labels[value] ??
    value
  );
}

function formatSkinfoldSite(
  value: string,
): string {
  const labels:
    Record<string, string> = {
      CHEST: 'Peitoral',
      MIDAXILLARY:
        'Axilar média',
      TRICEPS: 'Tríceps',
      SUBSCAPULAR:
        'Subescapular',
      ABDOMEN: 'Abdominal',
      SUPRAILIAC:
        'Supra-ilíaca',
      THIGH: 'Coxa',
      BICEPS: 'Bíceps',
      SUPRASPINALE:
        'Supraespinal',
      CALF: 'Panturrilha',
      OTHER: 'Outro',
    };

  return (
    labels[value] ??
    value
  );
}

function formatMeasurementSide(
  value: string,
): string {
  const labels:
    Record<string, string> = {
      RIGHT: 'Direito',
      LEFT: 'Esquerdo',
      NOT_APPLICABLE:
        'Não aplicável',
    };

  return (
    labels[value] ??
    value
  );
}

function formatCalculationLabel(
  code: AnthropometricCalculationCode,
): string {
  const labels:
    Record<AnthropometricCalculationCode, string> = {
      BMI: 'IMC',
      BODY_DENSITY:
        'Densidade corporal',
      BODY_FAT_PERCENTAGE:
        'Gordura corporal',
      FAT_MASS_KG:
        'Massa de gordura',
      LEAN_MASS_KG:
        'Massa magra',
    };

  return labels[code];
}

function formatCalculationMethod(
  value: string,
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
    labels[value] ??
    value
  );
}











export function AnthropometricAssessmentComparisonPanel({
  patientId,
  patientName,
  patientBirthDate,
  patientCpf,
  biologicalSex,
  assessments,
  onEditAssessment,
  onDeleteAssessment,
  isDeletingAssessment,
}: AnthropometricAssessmentComparisonPanelProps) {
  const [
    isExpanded,
    setIsExpanded,
  ] =
    useState(
      false,
    );

  const [
    printGeneratedAt,
    setPrintGeneratedAt,
  ] =
    useState<Date | null>(
      null,
    );

  const [
    selectedAssessmentId,
    setSelectedAssessmentId,
  ] =
    useState<string | null>(
      null,
    );

  
  const sortedAssessments =
    useMemo(
      () =>
        [...assessments].sort(
          (
            first,
            second,
          ) =>
            new Date(
              first.measuredAt,
            ).getTime() -
            new Date(
              second.measuredAt,
            ).getTime(),
        ),
      [
        assessments,
      ],
    );

  const assessmentIds =
    useMemo(
      () =>
        sortedAssessments.map(
          (
            assessment,
          ) =>
            assessment.id,
        ),
      [
        sortedAssessments,
      ],
    );

  const resultsEntries =
    useAnthropometricAssessmentsResults(
      patientId,
      assessmentIds,
    );

  const resultsByAssessmentId =
    useMemo(
      () =>
        new Map(
          resultsEntries.map(
            (
              entry,
            ) => [
              entry.assessmentId,
              entry.data,
            ],
          ),
        ),
      [
        resultsEntries,
      ],
    );

  const selectedAssessment =
    useMemo(
      () =>
        selectedAssessmentId
          ? sortedAssessments.find(
              (
                assessment,
              ) =>
                assessment.id ===
                selectedAssessmentId,
            ) ??
            null
          : null,
      [
        selectedAssessmentId,
        sortedAssessments,
      ],
    );

  const selectedAssessmentResults =
    selectedAssessment
      ? resultsByAssessmentId.get(
          selectedAssessment.id,
        )
      : undefined;

  const selectedAssessmentIndex =
    selectedAssessment
      ? sortedAssessments.findIndex(
          (
            assessment,
          ) =>
            assessment.id ===
            selectedAssessment.id,
        )
      : -1;

  const previousAssessment =
    selectedAssessmentIndex >
    0
      ? sortedAssessments[
          selectedAssessmentIndex -
            1
        ]
      : null;

  const previousAssessmentResults =
    previousAssessment
      ? resultsByAssessmentId.get(
          previousAssessment.id,
        )
      : undefined;

  const metrics =
    useMemo(
      () =>
        buildMetrics(),
      [],
    );

  const compactAssessments =
    sortedAssessments.slice(
      -3,
    );

  const hasLoadingResults =
    resultsEntries.some(
      (
        entry,
      ) =>
        entry.isLoading,
    );

  if (
    assessments.length ===
    0
  ) {
    return null;
  }

  function handlePrint(): void {
    const generatedAt =
      new Date();

    flushSync(
      () => {
        setPrintGeneratedAt(
          generatedAt,
        );
      },
    );

    const report =
      document.querySelector(
        '.higeia-print-report',
      );

    if (!report) {
      window.print();
      return;
    }

    const printWindow =
      window.open(
        '',
        '_blank',
        'width=1400,height=900',
      );

    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.open();
    printWindow.document.write(
      `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ficha de Evolução Antropométrica - ${patientName}</title>
  <style>${HIGEIA_PRINT_STYLES}</style>
</head>
<body>
  ${report.outerHTML}
</body>
</html>`,
    );
    printWindow.document.close();
    printWindow.focus();

    printWindow.setTimeout(
      () => {
        printWindow.print();
      },
      0,
    );
  }

  return (
    <>
      <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-medium">
              Evolução antropométrica
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Últimas{' '}
              {
                compactAssessments.length
              }{' '}
              avaliações registradas. Expanda para consultar o histórico completo.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setIsExpanded(
                true,
              )
            }
          >
            <Maximize2 className="size-4" />

            Expandir histórico
          </Button>
        </div>

        {hasLoadingResults && (
          <p className="text-xs text-muted-foreground">
            Atualizando resultados calculados pela Higeia...
          </p>
        )}

        <AnthropometricHistoryTable
          assessments={
            compactAssessments
          }
          resultsByAssessmentId={
            resultsByAssessmentId
          }
          metrics={
            metrics
          }
          expanded={
            false
          }
          isDeletingAssessment={
            isDeletingAssessment
          }
          onEditAssessment={
            onEditAssessment
          }
          onDeleteAssessment={
            onDeleteAssessment
          }
        />

        <p className="text-[11px] text-muted-foreground">
          A coluna Evolução considera a primeira e a última medição disponível do indicador dentro do período exibido. Traço indica dado não registrado.
        </p>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex bg-background/95">
          <div className="flex min-h-0 w-full flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b bg-background px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Histórico antropométrico
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    sortedAssessments.length
                  }{' '}
                  avaliação(ões) registrada(s)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    handlePrint
                  }
                >
                  <Printer className="size-4" />

                  Imprimir
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedAssessmentId(
                      null,
                    );

                    setIsExpanded(
                      false,
                    );
                  }}
                  aria-label="Fechar histórico antropométrico"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-none space-y-4">
                <AnthropometricLongitudinalPanel
                  assessments={
                    sortedAssessments
                  }
                  resultsByAssessmentId={
                    resultsByAssessmentId
                  }
                  isLoading={
                    hasLoadingResults
                  }
                />

                <div className="rounded-xl border bg-background p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">
                      Evolução completa
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Todas as avaliações antropométricas registradas no prontuário.
                    </p>
                  </div>

                  <AnthropometricHistoryTable
                    assessments={
                      sortedAssessments
                    }
                    resultsByAssessmentId={
                      resultsByAssessmentId
                    }
                    metrics={
                      metrics
                    }
                    expanded={
                      true
                    }
                    isDeletingAssessment={
                      isDeletingAssessment
                    }
                    onOpenAssessment={(
                      assessment,
                    ) =>
                      setSelectedAssessmentId(
                        assessment.id,
                      )
                    }
                    onEditAssessment={
                      onEditAssessment
                    }
                    onDeleteAssessment={
                      onDeleteAssessment
                    }
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Resultados identificados como Higeia são valores derivados dos dados registrados e não substituem medições realizadas por equipamento ou método profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedAssessment && (
        <AnthropometricAssessmentDetail
          assessment={
            selectedAssessment
          }
          previousAssessment={
            previousAssessment
          }
          results={
            selectedAssessmentResults
          }
          previousResults={
            previousAssessmentResults
          }
          metrics={
            metrics
          }
          onEdit={
            onEditAssessment
          }
          onClose={() =>
            setSelectedAssessmentId(
              null,
            )
          }
        />
      )}
      <AnthropometricPrintReport
        patientName={
          patientName
        }
        patientBirthDate={
          patientBirthDate
        }
        patientCpf={
          patientCpf
        }
        biologicalSex={
          biologicalSex
        }
        assessments={
          sortedAssessments
        }
        resultsByAssessmentId={
          resultsByAssessmentId
        }
        metrics={
          metrics
        }
        generatedAt={
          printGeneratedAt
        }
      />
    </>
  );
}