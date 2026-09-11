'use client';

import {
  useMemo,
} from 'react';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
} from '../medical-record.types';

import {
  buildAnthropometricLongitudinalInsights,
} from './anthropometric-engine';

interface AnthropometricLongitudinalPanelProps {
  assessments: AnthropometricAssessment[];
  resultsByAssessmentId: ReadonlyMap<
    string,
    AnthropometricAssessmentResults | undefined
  >;
  isLoading: boolean;
}

export function AnthropometricLongitudinalPanel({
  assessments,
  resultsByAssessmentId,
  isLoading,
}: AnthropometricLongitudinalPanelProps) {
  const insights =
    useMemo(
      () =>
        buildAnthropometricLongitudinalInsights(
          assessments.map(
            (
              assessment,
            ) => ({
              assessment,
              results:
                resultsByAssessmentId.get(
                  assessment.id,
                ),
            }),
          ),
        ),
      [
        assessments,
        resultsByAssessmentId,
      ],
    );

  if (
    assessments.length <
    3
  ) {
    return null;
  }

  return (
    <section className="rounded-xl border border-teal-100 bg-teal-50/30 p-5">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
          Leitura longitudinal Higeia
        </p>

        <h3 className="mt-1 font-medium">
          Trajetória antropométrica
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Síntese das avaliações ao longo do tempo, respeitando qualidade dos dados e comparabilidade metodológica.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Atualizando a leitura longitudinal...
        </p>
      ) : insights.length >
        0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {insights.map(
            (
              insight,
            ) => {
              const isDataLimit =
                insight.code.includes(
                  'LIMIT',
                );

              return (
                <div
                  key={
                    insight.code
                  }
                  className={
                    isDataLimit
                      ? 'rounded-lg border border-amber-200 bg-amber-50/70 p-4'
                      : 'rounded-lg border bg-background p-4'
                  }
                >
                  <p
                    className={
                      isDataLimit
                        ? 'text-xs font-medium text-amber-800'
                        : 'text-xs text-muted-foreground'
                    }
                  >
                    {
                      insight.label
                    }
                  </p>

                  <p
                    className={
                      isDataLimit
                        ? 'mt-1 font-medium text-amber-950'
                        : 'mt-1 font-medium'
                    }
                  >
                    {
                      insight.value
                    }
                  </p>

                  <p
                    className={
                      isDataLimit
                        ? 'mt-2 text-xs leading-relaxed text-amber-900/75'
                        : 'mt-2 text-xs leading-relaxed text-muted-foreground'
                    }
                  >
                    {
                      insight.description
                    }
                  </p>
                </div>
              );
            },
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Ainda não há uma série com dados suficientes para gerar uma leitura longitudinal.
        </p>
      )}

      <p className="mt-4 text-[11px] text-muted-foreground">
        A leitura longitudinal descreve padrões registrados no prontuário e não atribui causa clínica às mudanças observadas.
      </p>
    </section>
  );
}
