import {
  describe,
  expect,
  it,
} from 'vitest';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
} from '../medical-record.types';

import {
  buildAnthropometricContextInsights,
  buildAnthropometricDataQualityAlerts,
  calculateRatio,
  getAdultBmiClassification,
  getCircumferenceValue,
} from './anthropometric-engine';

function createAssessment(
  overrides: Partial<AnthropometricAssessment> = {},
): AnthropometricAssessment {
  return {
    id:
      '00000000-0000-0000-0000-000000000001',
    organizationId:
      '00000000-0000-0000-0000-000000000010',
    medicalRecordId:
      '00000000-0000-0000-0000-000000000020',
    patientId:
      '00000000-0000-0000-0000-000000000030',
    measuredAt:
      '2026-05-08',
    weightKg:
      null,
    heightCm:
      null,
    bodyFatPercentage:
      null,
    fatMassKg:
      null,
    leanMassKg:
      null,
    muscleMassKg:
      null,
    waistCircumferenceCm:
      null,
    hipCircumferenceCm:
      null,
    abdomenCircumferenceCm:
      null,
    chestCircumferenceCm:
      null,
    armCircumferenceCm:
      null,
    thighCircumferenceCm:
      null,
    calfCircumferenceCm:
      null,
    bodyCompositionMethod:
      null,
    skinfoldProtocol:
      null,
    notes:
      null,
    skinfoldMeasurements:
      [],
    circumferenceMeasurements:
      [],
    createdAt:
      '2026-05-08T12:00:00.000Z',
    updatedAt:
      '2026-05-08T12:00:00.000Z',
    ...overrides,
  } as AnthropometricAssessment;
}

function createResults(
  calculations: AnthropometricAssessmentResults['calculations'] = [],
  population = 'ADULT',
): AnthropometricAssessmentResults {
  return {
    assessment:
      createAssessment(),
    clinicalContext: {
      measuredAt:
        '2026-05-08',
      biologicalSex:
        'MALE',
      age: {
        years:
          36,
        months:
          1,
        totalMonths:
          433,
      },
      population,
    },
    calculations,
    jacksonPollockEligibility: {
      eligible:
        true,
      reason:
        null,
    },
  } as AnthropometricAssessmentResults;
}

describe(
  'anthropometric-engine',
  () => {
    describe(
      'getAdultBmiClassification',
      () => {
        it.each([
          [
            18.49,
            'Baixo peso',
          ],
          [
            18.5,
            'Eutrofia',
          ],
          [
            24.99,
            'Eutrofia',
          ],
          [
            25,
            'Sobrepeso',
          ],
          [
            29.99,
            'Sobrepeso',
          ],
          [
            30,
            'Obesidade grau I',
          ],
          [
            35,
            'Obesidade grau II',
          ],
          [
            40,
            'Obesidade grau III',
          ],
        ])(
          'classifica IMC %s como %s em adultos',
          (
            bmi,
            expected,
          ) => {
            expect(
              getAdultBmiClassification(
                bmi,
                'ADULT',
              )?.value,
            ).toBe(
              expected,
            );
          },
        );

        it(
          'não classifica IMC fora do contexto adulto',
          () => {
            expect(
              getAdultBmiClassification(
                25.5,
                'OLDER_ADULT',
              ),
            ).toBeNull();

            expect(
              getAdultBmiClassification(
                25.5,
                undefined,
              ),
            ).toBeNull();
          },
        );
      },
    );

    describe(
      'calculateRatio',
      () => {
        it(
          'calcula relação cintura/estatura',
          () => {
            expect(
              calculateRatio(
                90,
                173,
              ),
            ).toBeCloseTo(
              0.5202,
              4,
            );
          },
        );

        it(
          'retorna null quando faltam dados ou denominador é inválido',
          () => {
            expect(
              calculateRatio(
                null,
                173,
              ),
            ).toBeNull();

            expect(
              calculateRatio(
                90,
                null,
              ),
            ).toBeNull();

            expect(
              calculateRatio(
                90,
                0,
              ),
            ).toBeNull();
          },
        );
      },
    );

    describe(
      'getCircumferenceValue',
      () => {
        it(
          'prioriza a coleção estruturada de circunferências',
          () => {
            const assessment =
              createAssessment({
                waistCircumferenceCm:
                  80,
                circumferenceMeasurements: [
                  {
                    id:
                      '00000000-0000-0000-0000-000000000100',
                    anthropometricAssessmentId:
                      '00000000-0000-0000-0000-000000000001',
                    site:
                      'WAIST',
                    side:
                      'NOT_APPLICABLE',
                    state:
                      'NOT_APPLICABLE',
                    valueCm:
                      90,
                    createdAt:
                      '2026-05-08T12:00:00.000Z',
                    updatedAt:
                      '2026-05-08T12:00:00.000Z',
                  },
                ],
              });

            expect(
              getCircumferenceValue(
                assessment,
                'WAIST',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              ),
            ).toBe(
              90,
            );
          },
        );

        it(
          'usa o campo legado como fallback quando não existe medida estruturada',
          () => {
            const assessment =
              createAssessment({
                waistCircumferenceCm:
                  86,
              });

            expect(
              getCircumferenceValue(
                assessment,
                'WAIST',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              ),
            ).toBe(
              86,
            );
          },
        );
      },
    );

    describe(
      'buildAnthropometricDataQualityAlerts',
      () => {
        it(
          'gera alerta para variação de cintura de 10 cm ou mais',
          () => {
            const previous =
              createAssessment({
                measuredAt:
                  '2026-05-08',
                waistCircumferenceCm:
                  90,
              });

            const current =
              createAssessment({
                measuredAt:
                  '2026-06-16',
                waistCircumferenceCm:
                  80,
              });

            const alerts =
              buildAnthropometricDataQualityAlerts(
                current,
                previous,
              );

            expect(
              alerts.some(
                (
                  alert,
                ) =>
                  alert.code ===
                  'WAIST_VARIATION',
              ),
            ).toBe(
              true,
            );
          },
        );

        it(
          'não gera alerta de cintura abaixo de 10 cm',
          () => {
            const previous =
              createAssessment({
                waistCircumferenceCm:
                  90,
              });

            const current =
              createAssessment({
                waistCircumferenceCm:
                  81,
              });

            const alerts =
              buildAnthropometricDataQualityAlerts(
                current,
                previous,
              );

            expect(
              alerts.some(
                (
                  alert,
                ) =>
                  alert.code ===
                  'WAIST_VARIATION',
              ),
            ).toBe(
              false,
            );
          },
        );

        it(
          'gera alerta quando o peso varia 7% ou mais',
          () => {
            const previous =
              createAssessment({
                weightKg:
                  100,
              });

            const current =
              createAssessment({
                weightKg:
                  107,
              });

            const alerts =
              buildAnthropometricDataQualityAlerts(
                current,
                previous,
              );

            expect(
              alerts.some(
                (
                  alert,
                ) =>
                  alert.code ===
                  'WEIGHT_VARIATION',
              ),
            ).toBe(
              true,
            );
          },
        );

        it(
          'gera alerta para variação de altura de 2 cm ou mais',
          () => {
            const previous =
              createAssessment({
                heightCm:
                  173,
              });

            const current =
              createAssessment({
                heightCm:
                  175,
              });

            const alerts =
              buildAnthropometricDataQualityAlerts(
                current,
                previous,
              );

            expect(
              alerts.some(
                (
                  alert,
                ) =>
                  alert.code ===
                  'HEIGHT_VARIATION',
              ),
            ).toBe(
              true,
            );
          },
        );
      },
    );

    describe(
      'buildAnthropometricContextInsights',
      () => {
        it(
          'formata aumento de peso sem sinal positivo redundante',
          () => {
            const previous =
              createAssessment({
                measuredAt:
                  '2026-04-17',
                weightKg:
                  75.4,
              });

            const current =
              createAssessment({
                measuredAt:
                  '2026-05-08',
                weightKg:
                  76.2,
              });

            const insights =
              buildAnthropometricContextInsights(
                current,
                previous,
                undefined,
                undefined,
              );

            const weightTrend =
              insights.find(
                (
                  insight,
                ) =>
                  insight.code ===
                  'WEIGHT_TREND',
              );

            expect(
              weightTrend?.value,
            ).toBe(
              'Aumento de 0,8 kg',
            );
          },
        );

        it(
          'formata redução de cintura sem sinal positivo',
          () => {
            const previous =
              createAssessment({
                waistCircumferenceCm:
                  90,
              });

            const current =
              createAssessment({
                waistCircumferenceCm:
                  65,
              });

            const insights =
              buildAnthropometricContextInsights(
                current,
                previous,
                undefined,
                undefined,
              );

            const waistTrend =
              insights.find(
                (
                  insight,
                ) =>
                  insight.code ===
                  'WAIST_TREND',
              );

            expect(
              waistTrend?.value,
            ).toBe(
              'Redução de 25 cm',
            );
          },
        );

        it(
          'não usa cintura suspeita para gerar interpretação combinada',
          () => {
            const previous =
              createAssessment({
                weightKg:
                  76.2,
                waistCircumferenceCm:
                  90,
              });

            const current =
              createAssessment({
                weightKg:
                  77.4,
                waistCircumferenceCm:
                  65,
              });

            const insights =
              buildAnthropometricContextInsights(
                current,
                previous,
                undefined,
                undefined,
              );

            expect(
              insights.some(
                (
                  insight,
                ) =>
                  insight.code ===
                  'WEIGHT_WAIST_COMBINED_TREND',
              ),
            ).toBe(
              false,
            );
          },
        );

        it(
          'gera leitura combinada quando peso sobe e cintura reduz de forma plausível',
          () => {
            const previous =
              createAssessment({
                weightKg:
                  75,
                waistCircumferenceCm:
                  90,
              });

            const current =
              createAssessment({
                weightKg:
                  76,
                waistCircumferenceCm:
                  88,
              });

            const insights =
              buildAnthropometricContextInsights(
                current,
                previous,
                undefined,
                undefined,
              );

            expect(
              insights.find(
                (
                  insight,
                ) =>
                  insight.code ===
                  'WEIGHT_WAIST_COMBINED_TREND',
              )?.value,
            ).toBe(
              'Peso aumentou e cintura reduziu',
            );
          },
        );

        it(
          'gera leitura combinada de peso e percentual de gordura',
          () => {
            const previous =
              createAssessment({
                weightKg:
                  75,
                bodyFatPercentage:
                  20,
              });

            const current =
              createAssessment({
                weightKg:
                  76,
                bodyFatPercentage:
                  18,
              });

            const insights =
              buildAnthropometricContextInsights(
                current,
                previous,
                undefined,
                undefined,
              );

            expect(
              insights.find(
                (
                  insight,
                ) =>
                  insight.code ===
                  'WEIGHT_BODY_FAT_COMBINED_TREND',
              )?.value,
            ).toBe(
              'Peso aumentou com redução do percentual de gordura',
            );
          },
        );

        it(
          'prefere gordura corporal calculada pela Higeia quando disponível',
          () => {
            const previous =
              createAssessment({
                weightKg:
                  75,
                bodyFatPercentage:
                  30,
              });

            const current =
              createAssessment({
                weightKg:
                  76,
                bodyFatPercentage:
                  30,
              });

            const previousResults =
              createResults([
                {
                  code:
                    'BODY_FAT_PERCENTAGE',
                  label:
                    'Gordura corporal',
                  value:
                    20,
                  unit:
                    '%',
                  source:
                    'HIGEIA_CALCULATION',
                  method:
                    'SIRI',
                },
              ]);

            const currentResults =
              createResults([
                {
                  code:
                    'BODY_FAT_PERCENTAGE',
                  label:
                    'Gordura corporal',
                  value:
                    18,
                  unit:
                    '%',
                  source:
                    'HIGEIA_CALCULATION',
                  method:
                    'SIRI',
                },
              ]);

            const insights =
              buildAnthropometricContextInsights(
                current,
                previous,
                currentResults,
                previousResults,
              );

            expect(
              insights.find(
                (
                  insight,
                ) =>
                  insight.code ===
                  'WEIGHT_BODY_FAT_COMBINED_TREND',
              )?.value,
            ).toBe(
              'Peso aumentou com redução do percentual de gordura',
            );
          },
        );
      },
    );
  },
);
