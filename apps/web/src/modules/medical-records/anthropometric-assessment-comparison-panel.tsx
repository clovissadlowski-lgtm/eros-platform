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
  buildAnthropometricMetrics,
} from './anthropometry/anthropometric-metrics';

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
        buildAnthropometricMetrics(),
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