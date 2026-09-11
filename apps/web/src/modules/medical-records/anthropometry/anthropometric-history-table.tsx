'use client';

import {
  Fragment,
  useEffect,
  useState,
} from 'react';

import {
  MoreVertical,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
} from '../medical-record.types';

type MetricSection =
  | 'BASIC'
  | 'BODY_COMPOSITION'
  | 'TRUNK'
  | 'UPPER_LIMBS'
  | 'LOWER_LIMBS';

interface AnthropometricHistoryMetric {
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

interface AnthropometricHistoryTableProps {
  assessments: AnthropometricAssessment[];

  resultsByAssessmentId: ReadonlyMap<
    string,
    AnthropometricAssessmentResults | undefined
  >;

  metrics: AnthropometricHistoryMetric[];
  expanded: boolean;
  isDeletingAssessment: boolean;

  onOpenAssessment?: (
    assessment: AnthropometricAssessment,
  ) => void;

  onEditAssessment: (
    assessment: AnthropometricAssessment,
  ) => void;

  onDeleteAssessment: (
    assessment: AnthropometricAssessment,
  ) => void;
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

  return `${value.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2,
    },
  )} ${unit}`;
}

function formatEvolution(
  values: Array<number | null>,
  unit: string,
): string {
  const availableValues =
    values.filter(
      (
        value,
      ): value is number =>
        value !== null,
    );

  if (
    availableValues.length <
    2
  ) {
    return '—';
  }

  const first =
    availableValues[0];

  const last =
    availableValues[
      availableValues.length -
        1
    ];

  const delta =
    last - first;

  const prefix =
    delta > 0
      ? '+'
      : '';

  return `${prefix}${delta.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2,
    },
  )} ${unit}`;
}

export function AnthropometricHistoryTable({
  assessments,
  resultsByAssessmentId,
  metrics,
  expanded,
  isDeletingAssessment,
  onOpenAssessment,
  onEditAssessment,
  onDeleteAssessment,
}: AnthropometricHistoryTableProps) {
  const [
    openAssessmentMenuId,
    setOpenAssessmentMenuId,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(
    () => {
      if (!openAssessmentMenuId) {
        return;
      }

      function handlePointerDown(
        event: MouseEvent,
      ) {
        const target =
          event.target;

        if (
          target instanceof Element &&
          target.closest(
            '[data-assessment-actions-menu]',
          )
        ) {
          return;
        }

        setOpenAssessmentMenuId(
          null,
        );
      }

      function handleKeyDown(
        event: KeyboardEvent,
      ) {
        if (
          event.key ===
          'Escape'
        ) {
          setOpenAssessmentMenuId(
            null,
          );
        }
      }

      document.addEventListener(
        'mousedown',
        handlePointerDown,
      );

      document.addEventListener(
        'keydown',
        handleKeyDown,
      );

      return () => {
        document.removeEventListener(
          'mousedown',
          handlePointerDown,
        );

        document.removeEventListener(
          'keydown',
          handleKeyDown,
        );
      };
    },
    [
      openAssessmentMenuId,
    ],
  );

  const groupedSections:
    MetricSection[] = [
      'BASIC',
      'BODY_COMPOSITION',
      'TRUNK',
      'UPPER_LIMBS',
      'LOWER_LIMBS',
    ];

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table
        className={
          expanded
            ? 'w-max min-w-full text-sm'
            : 'w-full min-w-[820px] text-sm'
        }
      >
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="sticky left-0 z-10 min-w-[220px] bg-muted/30 px-4 py-1.5 text-left font-medium">
              Indicador
            </th>

            {assessments.map(
              (
                assessment,
              ) => (
                <th
                  key={
                    assessment.id
                  }
                  className="min-w-[145px] px-4 py-1 text-right font-medium"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    {expanded ? (
                      <button
                        type="button"
                        className="rounded-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
                        onClick={() => {
                          setOpenAssessmentMenuId(
                            null,
                          );

                          onOpenAssessment?.(
                            assessment,
                          );
                        }}
                        title="Visualizar avaliação"
                        aria-label={`Visualizar avaliação de ${formatDate(
                          assessment.measuredAt,
                        )}`}
                      >
                        {formatDate(
                          assessment.measuredAt,
                        )}
                      </button>
                    ) : (
                      <span>
                        {formatDate(
                          assessment.measuredAt,
                        )}
                      </span>
                    )}

                    {expanded && (
                      <div
                        className="relative"
                        data-assessment-actions-menu
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={[
                            'size-7 rounded-md border border-teal-200 text-teal-700 transition-colors',
                            'hover:bg-teal-50 hover:text-teal-800',
                            openAssessmentMenuId ===
                            assessment.id
                              ? 'bg-teal-100 text-teal-900'
                              : 'bg-teal-50/70',
                          ].join(
                            ' ',
                          )}
                          onClick={() =>
                            setOpenAssessmentMenuId(
                              (
                                current,
                              ) =>
                                current ===
                                assessment.id
                                  ? null
                                  : assessment.id,
                            )
                          }
                          aria-label={`Abrir ações da avaliação de ${formatDate(
                            assessment.measuredAt,
                          )}`}
                          aria-haspopup="menu"
                          aria-expanded={
                            openAssessmentMenuId ===
                            assessment.id
                          }
                          title="Ações da avaliação"
                        >
                          <MoreVertical className="size-4" />
                        </Button>

                        {openAssessmentMenuId ===
                          assessment.id && (
                          <div
                            role="menu"
                            aria-label={`Ações da avaliação de ${formatDate(
                              assessment.measuredAt,
                            )}`}
                            className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                              onClick={() => {
                                setOpenAssessmentMenuId(
                                  null,
                                );

                                onEditAssessment(
                                  assessment,
                                );
                              }}
                            >
                              Editar avaliação
                            </button>

                            <button
                              type="button"
                              role="menuitem"
                              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={
                                isDeletingAssessment
                              }
                              onClick={() => {
                                setOpenAssessmentMenuId(
                                  null,
                                );

                                onDeleteAssessment(
                                  assessment,
                                );
                              }}
                            >
                              Excluir avaliação
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ),
            )}

            <th className="min-w-[130px] px-4 py-1 text-right font-medium">
              Evolução
            </th>
          </tr>
        </thead>

        <tbody>
          {groupedSections.map(
            (
              section,
            ) => {
              const sectionMetrics =
                metrics.filter(
                  (
                    metric,
                  ) =>
                    metric.section ===
                    section,
                );

              return (
                <Fragment
                  key={section}
                >
                  <tr
                    className="border-b bg-muted/20"
                  >
                    <td
                      colSpan={
                        assessments.length +
                        2
                      }
                      className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {
                        sectionLabels[
                          section
                        ]
                      }
                    </td>
                  </tr>

                  {sectionMetrics.map(
                    (
                      metric,
                    ) => {
                      const values =
                        assessments.map(
                          (
                            assessment,
                          ) =>
                            metric.getValue(
                              assessment,
                              resultsByAssessmentId.get(
                                assessment.id,
                              ),
                            ),
                        );

                      return (
                        <tr
                          key={
                            metric.key
                          }
                          className="border-b last:border-b-0"
                        >
                          <td className="sticky left-0 z-[5] bg-background px-4 py-1 text-muted-foreground">
                            {
                              metric.label
                            }
                          </td>

                          {values.map(
                            (
                              value,
                              index,
                            ) => (
                              <td
                                key={
                                  assessments[
                                    index
                                  ].id
                                }
                                className="px-4 py-1 text-right font-medium"
                              >
                                {formatValue(
                                  value,
                                  metric.unit,
                                )}
                              </td>
                            ),
                          )}

                          <td className="px-4 py-1 text-right font-medium">
                            {formatEvolution(
                              values,
                              metric.deltaUnit ??
                                metric.unit,
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </Fragment>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
}
