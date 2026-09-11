'use client';

import {
  X,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
  AnthropometricCalculationCode,
} from '../medical-record.types';

import {
  getCalculationValue,
} from './anthropometric-engine';

import {
  AnthropometricInterpretationPanel,
} from './anthropometric-interpretation-panel';

type MetricSection =
  | 'BASIC'
  | 'BODY_COMPOSITION'
  | 'TRUNK'
  | 'UPPER_LIMBS'
  | 'LOWER_LIMBS';

interface AnthropometricDetailMetric {
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

const sectionLabels:
  Record<MetricSection, string> = {
    BASIC:
      'Medição básica',

    BODY_COMPOSITION:
      'Composição corporal',

    TRUNK:
      'Circunferências · Tronco',

    UPPER_LIMBS:
      'Circunferências · Membros superiores',

    LOWER_LIMBS:
      'Circunferências · Membros inferiores',
  };

interface AnthropometricAssessmentDetailProps {
  assessment: AnthropometricAssessment;
  previousAssessment: AnthropometricAssessment | null;
  results: AnthropometricAssessmentResults | undefined;
  previousResults: AnthropometricAssessmentResults | undefined;
  metrics: AnthropometricDetailMetric[];

  onEdit: (
    assessment: AnthropometricAssessment,
  ) => void;

  onClose: () => void;
}

function formatDate(
  value: string,
): string {
  const datePart =
    value.split('T')[0];

  const [
    year,
    month,
    day,
  ] =
    datePart.split('-');

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
}



function formatValue(
  value: number | null,
  unit: string,
): string {
  if (value === null) {
    return '—';
  }

  const formatted =
    value.toLocaleString(
      'pt-BR',
      {
        maximumFractionDigits:
          unit === 'g/mL'
            ? 6
            : 2,
      },
    );

  return unit
    ? `${formatted} ${unit}`
    : formatted;
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












export function AnthropometricAssessmentDetail({
  assessment: selectedAssessment,
  previousAssessment,
  results: selectedAssessmentResults,
  previousResults: previousAssessmentResults,
  metrics,
  onEdit: onEditAssessment,
  onClose,
}: AnthropometricAssessmentDetailProps) {
  return (
<div className="fixed inset-0 z-[60] flex bg-background/95">
          <div className="flex min-h-0 w-full flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b bg-background px-6 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
                  Avaliação antropométrica
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {formatDate(
                    selectedAssessment.measuredAt,
                  )}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Visualização completa dos dados registrados nesta avaliação.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const assessment =
                      selectedAssessment;

                    onClose();

                    onEditAssessment(
                      assessment,
                    );
                  }}
                >
                  Editar avaliação
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Fechar detalhes da avaliação"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-xl border bg-background p-5">
                  <div className="mb-4">
                    <h3 className="font-medium">
                      Resumo
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Principais informações desta avaliação.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {[
                      {
                        label:
                          'Peso',
                        value:
                          formatValue(
                            selectedAssessment.weightKg,
                            'kg',
                          ),
                      },
                      {
                        label:
                          'Altura',
                        value:
                          formatValue(
                            selectedAssessment.heightCm,
                            'cm',
                          ),
                      },
                      {
                        label:
                          'IMC · Higeia',
                        value:
                          formatValue(
                            getCalculationValue(
                              selectedAssessmentResults,
                              'BMI',
                            ),
                            'kg/m²',
                          ),
                      },
                      {
                        label:
                          'Gordura corporal',
                        value:
                          formatValue(
                            getCalculationValue(
                              selectedAssessmentResults,
                              'BODY_FAT_PERCENTAGE',
                            ) ??
                              selectedAssessment.bodyFatPercentage,
                            '%',
                          ),
                      },
                      {
                        label:
                          'Massa de gordura',
                        value:
                          formatValue(
                            getCalculationValue(
                              selectedAssessmentResults,
                              'FAT_MASS_KG',
                            ) ??
                              selectedAssessment.fatMassKg,
                            'kg',
                          ),
                      },
                      {
                        label:
                          'Massa magra',
                        value:
                          formatValue(
                            getCalculationValue(
                              selectedAssessmentResults,
                              'LEAN_MASS_KG',
                            ) ??
                              selectedAssessment.leanMassKg,
                            'kg',
                          ),
                      },
                    ]
                      .filter(
                        (
                          item,
                        ) =>
                          item.value !==
                          '—',
                      )
                      .map(
                        (
                          item,
                        ) => (
                          <div
                            key={
                              item.label
                            }
                            className="rounded-lg border bg-muted/20 p-3"
                          >
                            <p className="text-xs text-muted-foreground">
                              {
                                item.label
                              }
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                item.value
                              }
                            </p>
                          </div>
                        ),
                      )}
                  </div>
                </section>

                <AnthropometricInterpretationPanel
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
                />

                {(() => {
                  const method =
                    formatBodyCompositionMethod(
                      selectedAssessment.bodyCompositionMethod,
                    );

                  const protocol =
                    formatSkinfoldProtocol(
                      selectedAssessment.skinfoldProtocol,
                    );

                  if (
                    !method &&
                    !protocol
                  ) {
                    return null;
                  }

                  return (
                    <section className="rounded-xl border bg-background p-5">
                      <div className="mb-4">
                        <h3 className="font-medium">
                          Método e protocolo
                        </h3>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {method && (
                          <div className="rounded-lg bg-muted/20 p-3">
                            <p className="text-xs text-muted-foreground">
                              Método de composição corporal
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                method
                              }
                            </p>
                          </div>
                        )}

                        {protocol && (
                          <div className="rounded-lg bg-muted/20 p-3">
                            <p className="text-xs text-muted-foreground">
                              Protocolo de dobras cutâneas
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                protocol
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })()}

                {(() => {
                  const groupedSections:
                    MetricSection[] = [
                      'TRUNK',
                      'UPPER_LIMBS',
                      'LOWER_LIMBS',
                    ];

                  const hasAnyCircumference =
                    groupedSections.some(
                      (
                        section,
                      ) =>
                        metrics
                          .filter(
                            (
                              metric,
                            ) =>
                              metric.section ===
                              section,
                          )
                          .some(
                            (
                              metric,
                            ) =>
                              metric.getValue(
                                selectedAssessment,
                                selectedAssessmentResults,
                              ) !==
                              null,
                          ),
                    );

                  if (
                    !hasAnyCircumference
                  ) {
                    return null;
                  }

                  return (
                    <section className="rounded-xl border bg-background p-5">
                      <div className="mb-4">
                        <h3 className="font-medium">
                          Circunferências
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Medidas corporais registradas nesta avaliação.
                        </p>
                      </div>

                      <div className="space-y-5">
                        {groupedSections.map(
                          (
                            section,
                          ) => {
                            const sectionMetrics =
                              metrics
                                .filter(
                                  (
                                    metric,
                                  ) =>
                                    metric.section ===
                                    section,
                                )
                                .map(
                                  (
                                    metric,
                                  ) => ({
                                    metric,
                                    value:
                                      metric.getValue(
                                        selectedAssessment,
                                        selectedAssessmentResults,
                                      ),
                                  }),
                                )
                                .filter(
                                  (
                                    item,
                                  ) =>
                                    item.value !==
                                    null,
                                );

                            if (
                              sectionMetrics.length ===
                              0
                            ) {
                              return null;
                            }

                            return (
                              <div
                                key={
                                  section
                                }
                              >
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  {
                                    sectionLabels[
                                      section
                                    ]
                                  }
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {sectionMetrics.map(
                                    ({
                                      metric,
                                      value,
                                    }) => (
                                      <div
                                        key={
                                          metric.key
                                        }
                                        className="rounded-lg border bg-muted/10 p-3"
                                      >
                                        <p className="text-xs text-muted-foreground">
                                          {
                                            metric.label
                                          }
                                        </p>

                                        <p className="mt-1 font-medium">
                                          {formatValue(
                                            value,
                                            metric.unit,
                                          )}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </section>
                  );
                })()}

                {selectedAssessment.skinfoldMeasurements.length >
                  0 && (
                  <section className="rounded-xl border bg-background p-5">
                    <div className="mb-4">
                      <h3 className="font-medium">
                        Dobras cutâneas
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Leituras registradas para o protocolo selecionado.
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th className="px-4 py-2 text-left font-medium">
                              Local
                            </th>

                            <th className="px-4 py-2 text-left font-medium">
                              Lado
                            </th>

                            <th className="px-4 py-2 text-center font-medium">
                              Leitura
                            </th>

                            <th className="px-4 py-2 text-right font-medium">
                              Valor
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {selectedAssessment.skinfoldMeasurements
                            .slice()
                            .sort(
                              (
                                first,
                                second,
                              ) =>
                                first.site.localeCompare(
                                  second.site,
                                ) ||
                                first.readingNumber -
                                  second.readingNumber,
                            )
                            .map(
                              (
                                measurement,
                              ) => (
                                <tr
                                  key={
                                    measurement.id
                                  }
                                  className="border-b last:border-b-0"
                                >
                                  <td className="px-4 py-2">
                                    {formatSkinfoldSite(
                                      measurement.site,
                                    )}
                                  </td>

                                  <td className="px-4 py-2 text-muted-foreground">
                                    {formatMeasurementSide(
                                      measurement.side,
                                    )}
                                  </td>

                                  <td className="px-4 py-2 text-center">
                                    {
                                      measurement.readingNumber
                                    }
                                  </td>

                                  <td className="px-4 py-2 text-right font-medium">
                                    {formatValue(
                                      measurement.valueMm,
                                      'mm',
                                    )}
                                  </td>
                                </tr>
                              ),
                            )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {selectedAssessmentResults &&
                  selectedAssessmentResults.calculations.length >
                    0 && (
                  <section className="rounded-xl border bg-background p-5">
                    <div className="mb-4">
                      <h3 className="font-medium">
                        Resultados Higeia
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Valores derivados dos dados registrados nesta avaliação.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedAssessmentResults.calculations.map(
                        (
                          calculation,
                        ) => (
                          <div
                            key={
                              calculation.code
                            }
                            className="rounded-lg border bg-muted/10 p-3"
                          >
                            <p className="text-xs text-muted-foreground">
                              {formatCalculationLabel(
                                calculation.code,
                              )}
                            </p>

                            <p className="mt-1 font-medium">
                              {formatValue(
                                calculation.value,
                                calculation.unit,
                              )}
                            </p>

                            <p className="mt-2 text-[11px] text-muted-foreground">
                              {formatCalculationMethod(
                                calculation.method,
                              )}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                )}

                {selectedAssessment.notes && (
                  <section className="rounded-xl border bg-background p-5">
                    <div className="mb-3">
                      <h3 className="font-medium">
                        Observações
                      </h3>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {
                        selectedAssessment.notes
                      }
                    </p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
  );
}
