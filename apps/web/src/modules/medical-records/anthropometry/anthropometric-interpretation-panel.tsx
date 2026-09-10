'use client';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
} from '../medical-record.types';

import {
  buildAnthropometricDataQualityAlerts,
  calculateRatio,
  formatRatio,
  getAdultBmiClassification,
  getCalculationValue,
  getCircumferenceValue,
} from './anthropometric-engine';

interface AnthropometricInterpretationPanelProps {
  assessment: AnthropometricAssessment;
  previousAssessment: AnthropometricAssessment | null;
  results: AnthropometricAssessmentResults | undefined;
  previousResults: AnthropometricAssessmentResults | undefined;
}

export function AnthropometricInterpretationPanel({
  assessment,
  previousAssessment,
  results,
  previousResults,
}: AnthropometricInterpretationPanelProps) {
  const bmi =
    getCalculationValue(
      results,
      'BMI',
    );

  const waist =
    getCircumferenceValue(
      assessment,
      'WAIST',
      'NOT_APPLICABLE',
      'NOT_APPLICABLE',
    );

  const hip =
    getCircumferenceValue(
      assessment,
      'HIP',
      'NOT_APPLICABLE',
      'NOT_APPLICABLE',
    );

  const waistToHeightRatio =
    calculateRatio(
      waist,
      assessment.heightCm,
    );

  const waistToHipRatio =
    calculateRatio(
      waist,
      hip,
    );

  const bmiInterpretation =
    getAdultBmiClassification(
      bmi,
      results?.clinicalContext.population,
    );

  const dataQualityAlerts =
    buildAnthropometricDataQualityAlerts(
      assessment,
      previousAssessment,
    );

  return (
    <>
      <section className="rounded-xl border border-teal-100 bg-teal-50/30 p-5">
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
            Interpretação Higeia
          </p>

          <h3 className="mt-1 font-medium">
            Leitura assistida dos resultados
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Classificações e alertas que exigem atenção profissional.
          </p>
        </div>

        {dataQualityAlerts.length >
          0 && (
          <div className="mb-4 space-y-2">
            {dataQualityAlerts.map(
              (
                alert,
              ) => (
                <div
                  key={
                    alert.code
                  }
                  className="rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-background text-xs font-semibold text-amber-700">
                      !
                    </div>

                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        {
                          alert.title
                        }
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-amber-900/75">
                        {
                          alert.description
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bmiInterpretation && (
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">
                {
                  bmiInterpretation.label
                }
              </p>

              <p className="mt-1 font-medium">
                {
                  bmiInterpretation.value
                }
              </p>

              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {
                  bmiInterpretation.description
                }
              </p>
            </div>
          )}

        </div>

        {!bmiInterpretation &&
          dataQualityAlerts.length ===
            0 && (
          <p className="text-sm text-muted-foreground">
            Ainda não há contexto suficiente para gerar classificações ou alertas automáticos nesta avaliação.
          </p>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          As interpretações automáticas e os alertas de consistência são apoio ao profissional. Alertas indicam apenas variações que merecem conferência do registro e não representam diagnóstico ou confirmação de erro.
        </p>
      </section>

      {(waistToHeightRatio !==
        null ||
        waistToHipRatio !==
          null) && (
        <section className="rounded-xl border bg-background p-5">
          <div className="mb-4">
            <h3 className="font-medium">
              Indicadores derivados
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Relações calculadas a partir das medidas registradas nesta avaliação.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {waistToHeightRatio !==
              null && (
              <div className="rounded-lg border bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">
                  Relação cintura/estatura
                </p>

                <p className="mt-1 font-medium">
                  {formatRatio(
                    waistToHeightRatio,
                  )}
                </p>

                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Calculada pela divisão da cintura pela altura, usando medidas na mesma unidade.
                </p>
              </div>
            )}

            {waistToHipRatio !==
              null && (
              <div className="rounded-lg border bg-muted/10 p-3">
                <p className="text-xs text-muted-foreground">
                  Relação cintura/quadril
                </p>

                <p className="mt-1 font-medium">
                  {formatRatio(
                    waistToHipRatio,
                  )}
                </p>

                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Calculada pela divisão da cintura pelo quadril.
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Nesta etapa, a Higeia apresenta os valores derivados sem atribuir automaticamente classificação de risco. A interpretação deve considerar sexo, idade, população clínica e protocolo adotado.
          </p>
        </section>
      )}
    </>
  );
}
