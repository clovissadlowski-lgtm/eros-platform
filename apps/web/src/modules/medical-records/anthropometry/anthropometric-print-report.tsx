'use client';

import {
  Fragment,
  useEffect,
  useState,
} from 'react';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  AuthUser,
  UserOrganization,
} from '@/modules/auth/auth.types';

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

interface AnthropometricPrintMetric {
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

interface AnthropometricPrintReportProps {
  patientName: string;
  patientBirthDate: string | null;
  patientCpf: string | null;
  biologicalSex: 'MALE' | 'FEMALE' | null;
  assessments: AnthropometricAssessment[];

  resultsByAssessmentId: ReadonlyMap<
    string,
    AnthropometricAssessmentResults | undefined
  >;

  metrics: AnthropometricPrintMetric[];
  generatedAt: Date | null;
}

const sectionLabels:
  Record<MetricSection, string> = {
    BASIC: 'Medição básica',
    BODY_COMPOSITION: 'Composição corporal',
    TRUNK: 'Circunferências · Tronco',
    UPPER_LIMBS: 'Circunferências · Membros superiores',
    LOWER_LIMBS: 'Circunferências · Membros inferiores',
  };

function formatDate(value: string): string {
  const datePart = value.split('T')[0];
  const [year, month, day] = datePart.split('-');

  if (!year || !month || !day) {
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

function getEvolution(
  values: Array<number | null>,
): {
  first: number;
  last: number;
} | null {
  const available =
    values.filter(
      (
        value,
      ): value is number =>
        value !== null,
    );

  if (available.length < 2) {
    return null;
  }

  return {
    first: available[0],
    last:
      available[
        available.length - 1
      ],
  };
}

function formatEvolution(
  values: Array<number | null>,
  unit: string,
): string {
  const evolution =
    getEvolution(values);

  if (!evolution) {
    return '—';
  }

  const difference =
    evolution.last -
    evolution.first;

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

function formatPatientCpf(
  value: string | null,
): string {
  if (!value) {
    return 'Não informado';
  }

  const digits =
    value.replace(
      /\D/g,
      '',
    );

  if (digits.length !== 11) {
    return value;
  }

  return digits.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4',
  );
}

function formatPatientBirthDate(
  value: string | null,
): string {
  if (!value) {
    return 'Não informado';
  }

  const [year, month, day] =
    value
      .split('T')[0]
      .split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function formatBiologicalSex(
  value:
    | 'MALE'
    | 'FEMALE'
    | null,
): string {
  if (value === 'MALE') {
    return 'Masculino';
  }

  if (value === 'FEMALE') {
    return 'Feminino';
  }

  return 'Não informado';
}

function formatRole(
  role:
    | UserOrganization['role']
    | undefined,
): string {
  switch (role) {
    case 'OWNER':
      return 'Proprietário';
    case 'ADMIN':
      return 'Administrador';
    case 'NUTRITIONIST':
      return 'Nutricionista';
    case 'ASSISTANT':
      return 'Assistente';
    default:
      return 'Não informado';
  }
}

function formatPrintDateTime(
  value: Date | null,
): string {
  if (!value) {
    return '—';
  }

  return value.toLocaleString(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  );
}

export const HIGEIA_PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 5.5mm;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1d2926;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    width: 100%;
  }

  .higeia-print-report {
    display: block;
    width: 100%;
    min-height: 285mm;
    background: #ffffff;
    color: #1d2926;
    font-size: 7.35pt;
    line-height: 1.24;
  }

  .higeia-print-document-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 14px;
    align-items: start;
    padding-bottom: 6px;
    margin-bottom: 6px;
    border-bottom: 2px solid #0f766e;
  }

  .higeia-print-brand-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 3px;
  }

  .higeia-print-brand-mark {
    display: inline-flex;
    width: 22px;
    height: 22px;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: #0f766e;
    color: #ffffff;
    font-size: 10pt;
    font-weight: 800;
  }

  .higeia-print-brand {
    margin: 0;
    color: #0f766e;
    font-size: 8.2pt;
    font-weight: 800;
    letter-spacing: 0.15em;
  }

  .higeia-print-document-header h1 {
    margin: 0;
    color: #111827;
    font-size: 16.2pt;
    line-height: 1.05;
    font-weight: 720;
    letter-spacing: -0.02em;
  }

  .higeia-print-subtitle {
    margin: 2px 0 0;
    color: #64748b;
    font-size: 7.2pt;
  }

  .higeia-print-emission {
    min-width: 105px;
    padding-top: 1px;
    text-align: right;
  }

  .higeia-print-kicker {
    display: block;
    margin-bottom: 1px;
    color: #64748b;
    font-size: 5.7pt;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .higeia-print-emission strong {
    color: #1d2926;
    font-size: 6.8pt;
  }

  .higeia-print-patient {
    display: grid;
    grid-template-columns: 1.25fr 1.6fr 0.55fr;
    gap: 8px;
    align-items: end;
    padding: 6px 8px;
    margin-bottom: 5px;
    border: 1px solid #dce7e4;
    border-radius: 6px;
    background: #f8fbfa;
  }

  .higeia-print-patient-name strong {
    display: block;
    margin-top: 1px;
    color: #111827;
    font-size: 10.2pt;
    line-height: 1.05;
  }

  .higeia-print-inline-detail {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
  }

  .higeia-print-detail-value {
    display: block;
    margin-top: 1px;
    color: #26332f;
    font-size: 7.0pt;
    font-weight: 650;
  }

  .higeia-print-professional {
    display: grid;
    grid-template-columns: 1.25fr 1fr 0.7fr;
    gap: 8px;
    padding: 5px 8px;
    margin-bottom: 5px;
    border-left: 2px solid #0f766e;
    background: #f3f8f7;
  }

  .higeia-print-period {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 4px 7px;
    margin-bottom: 5px;
    border-radius: 5px;
    background: #ecf5f3;
    color: #23413b;
    font-size: 6.7pt;
  }

  .higeia-print-period strong {
    color: #0f5f58;
  }

  .higeia-print-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
    margin-bottom: 6px;
  }

  .higeia-print-summary-card {
    min-height: 38px;
    padding: 5px 7px;
    border: 1px solid #dce7e4;
    border-radius: 6px;
    background: #ffffff;
  }

  .higeia-print-summary-card .label {
    display: block;
    margin-bottom: 2px;
    color: #64748b;
    font-size: 5.5pt;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .higeia-print-summary-card .values {
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: #1d2926;
  }

  .higeia-print-summary-card .values strong {
    font-size: 8.2pt;
  }

  .higeia-print-summary-card .arrow {
    color: #94a3b8;
    font-size: 6pt;
  }

  .higeia-print-summary-card .delta {
    display: block;
    margin-top: 1px;
    color: #0f766e;
    font-size: 5.8pt;
    font-weight: 700;
  }

  .higeia-print-table {
    margin-top: 0;
  }

  .higeia-print-table-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 3px;
  }

  .higeia-print-table-title h2 {
    margin: 0;
    color: #1d2926;
    font-size: 9.2pt;
  }

  .higeia-print-table-title span {
    color: #64748b;
    font-size: 5.5pt;
  }

  .higeia-print-table > div {
    overflow: visible !important;
    border: 1px solid #d8e2df !important;
    border-radius: 5px !important;
  }

  .higeia-print-table table {
    width: 100% !important;
    min-width: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed;
    font-size: 6.25pt;
    line-height: 1.15;
  }

  .higeia-print-table thead {
    display: table-header-group;
  }

  .higeia-print-table thead th {
    position: static !important;
    min-width: 0 !important;
    height: 52px;
    padding: 3px 2.5px !important;
    border: 0 !important;
    border-right: 1px solid #c9d8d4 !important;
    border-bottom: 1px solid #aebfba !important;
    background: #eaf3f1 !important;
    color: #23413b !important;
    font-size: 6.1pt;
    font-weight: 800 !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  .higeia-print-table thead th:first-child {
    width: 42%;
    padding-left: 6px !important;
    text-align: left !important;
  }

  .higeia-print-table thead th:last-child {
    width: 16%;
    border-right: 0 !important;
  }

  .higeia-print-date-header {
    display: inline-flex;
    height: 44px;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.01em;
  }

  .higeia-print-table tbody td {
    position: static !important;
    min-width: 0 !important;
    padding: 2.35px 3.5px !important;
    border: 0 !important;
    border-right: 1px solid #edf2f1 !important;
    border-bottom: 1px solid #e3ebe8 !important;
    background: #ffffff !important;
    color: #24302d !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  .higeia-print-table tbody tr:last-child td {
    border-bottom: 0 !important;
  }

  .higeia-print-table tbody tr[class*='bg-muted'] td {
    padding-top: 2.7px !important;
    padding-bottom: 2.7px !important;
    border-right: 0 !important;
    border-bottom: 1px solid #c5d6d1 !important;
    background: #edf5f3 !important;
    color: #0f5f58 !important;
    font-size: 5.95pt !important;
    font-weight: 800 !important;
    letter-spacing: 0.035em;
    text-align: left !important;
  }

  .higeia-print-table tbody td:first-child {
    padding-left: 6px !important;
    color: #475569 !important;
    font-weight: 540;
    text-align: left !important;
  }

  .higeia-print-table tbody td:last-child {
    border-right: 0 !important;
    color: #0f5f58 !important;
    font-weight: 760 !important;
    text-align: center !important;
  }

  .higeia-print-table tbody tr:not([class*='bg-muted']):nth-child(even) td {
    background: #fbfdfc !important;
  }

  .higeia-print-table tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .higeia-print-notes {
    margin-top: 5px;
    padding: 5px 7px;
    border-radius: 5px;
    background: #f8faf9;
    color: #52605c;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .higeia-print-notes h2 {
    margin: 0 0 2px;
    color: #334155;
    font-size: 6.7pt;
  }

  .higeia-print-notes p {
    margin: 1px 0;
    font-size: 5.4pt;
    line-height: 1.25;
  }

  .higeia-print-footer {
    display: grid;
    grid-template-columns: 1fr 180px;
    gap: 18px;
    align-items: end;
    margin-top: 6px;
    padding-top: 5px;
    border-top: 1px solid #d6e1de;
    color: #64748b;
    font-size: 5.2pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .higeia-print-footer-copy strong {
    display: block;
    margin-bottom: 1px;
    color: #0f766e;
    font-size: 5.8pt;
    letter-spacing: 0.08em;
  }

  .higeia-print-signature {
    text-align: center;
    color: #24302d;
  }

  .higeia-print-signature-line {
    display: block;
    margin-bottom: 3px;
    border-top: 1px solid #64748b;
  }

  .higeia-print-signature strong,
  .higeia-print-signature small {
    display: block;
  }

  .higeia-print-signature small {
    margin-top: 1px;
    color: #64748b;
  }
`;

export function AnthropometricPrintReport({
  patientName,
  patientBirthDate,
  patientCpf,
  biologicalSex,
  assessments,
  resultsByAssessmentId,
  metrics,
  generatedAt,
}: AnthropometricPrintReportProps) {
  const [
    authenticatedUser,
    setAuthenticatedUser,
  ] =
    useState<AuthUser | null>(
      null,
    );

  const [
    activeOrganization,
    setActiveOrganization,
  ] =
    useState<UserOrganization | null>(
      null,
    );

  useEffect(
    () => {
      setAuthenticatedUser(
        authStorage.getUser(),
      );

      setActiveOrganization(
        authStorage.getActiveOrganization(),
      );
    },
    [],
  );

  const printSummaryMetrics =
    metrics.filter(
      (
        metric,
      ) =>
        [
          'weight',
          'bmi',
          'body-fat-higeia',
        ].includes(
          metric.key,
        ),
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
    <>
      <div className="higeia-print-report">
        <header className="higeia-print-document-header">
          <div>
            <div className="higeia-print-brand-row">
              <span className="higeia-print-brand-mark">H</span>
              <p className="higeia-print-brand">HIGEIA</p>
            </div>
            <h1>Ficha de Evolução Antropométrica</h1>
            <p className="higeia-print-subtitle">Histórico longitudinal de avaliação corporal</p>
          </div>
          <div className="higeia-print-emission">
            <span className="higeia-print-kicker">Emitido em</span>
            <strong>{formatPrintDateTime(generatedAt)}</strong>
          </div>
        </header>

        <section className="higeia-print-patient">
          <div className="higeia-print-patient-name">
            <span className="higeia-print-kicker">Paciente</span>
            <strong>{patientName}</strong>
          </div>
          <div className="higeia-print-inline-detail">
            <div><span className="higeia-print-kicker">CPF</span><span className="higeia-print-detail-value">{formatPatientCpf(patientCpf)}</span></div>
            <div><span className="higeia-print-kicker">Nascimento</span><span className="higeia-print-detail-value">{formatPatientBirthDate(patientBirthDate)}</span></div>
            <div><span className="higeia-print-kicker">Sexo</span><span className="higeia-print-detail-value">{formatBiologicalSex(biologicalSex)}</span></div>
          </div>
          <div>
            <span className="higeia-print-kicker">Avaliações no período</span>
            <span className="higeia-print-detail-value">{assessments.length}</span>
          </div>
        </section>

        <section className="higeia-print-professional">
          <div><span className="higeia-print-kicker">Organização</span><span className="higeia-print-detail-value">{activeOrganization?.organizationName ?? 'Não informado'}</span></div>
          <div><span className="higeia-print-kicker">Emitido por</span><span className="higeia-print-detail-value">{authenticatedUser?.name ?? 'Não informado'}</span></div>
          <div><span className="higeia-print-kicker">Função</span><span className="higeia-print-detail-value">{formatRole(activeOrganization?.role)}</span></div>
        </section>

        <section className="higeia-print-period">
          <div>
            <strong>Período analisado</strong>{' '}
            {assessments.length > 0
              ? `${formatDate(assessments[0].measuredAt)} — ${formatDate(assessments[assessments.length - 1].measuredAt)}`
              : '—'}
          </div>
          <div>Histórico completo do prontuário antropométrico</div>
        </section>

        <section className="higeia-print-summary">
          {printSummaryMetrics.map(
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

              const availableValues =
                values.filter(
                  (
                    value,
                  ): value is number =>
                    value !== null,
                );

              const firstValue =
                availableValues.length > 0
                  ? availableValues[0]
                  : null;

              const lastValue =
                availableValues.length > 0
                  ? availableValues[
                      availableValues.length - 1
                    ]
                  : null;

              const hasEvolution =
                availableValues.length > 1;

              return (
                <div
                  key={metric.key}
                  className="higeia-print-summary-card"
                >
                  <span className="label">
                    {metric.label.replace(
                      ' · Higeia',
                      '',
                    )}
                  </span>

                  <div className="values">
                    <strong>
                      {formatValue(
                        firstValue,
                        metric.unit,
                      )}
                    </strong>

                    {hasEvolution && (
                      <>
                        <span className="arrow">→</span>
                        <strong>
                          {formatValue(
                            lastValue,
                            metric.unit,
                          )}
                        </strong>
                      </>
                    )}
                  </div>

                  <span className="delta">
                    {hasEvolution
                      ? formatEvolution(
                          values,
                          metric.deltaUnit ??
                            metric.unit,
                        )
                      : availableValues.length === 1
                        ? '1 registro disponível'
                        : 'Sem dados disponíveis'}
                  </span>
                </div>
              );
            },
          )}
        </section>

        <section className="higeia-print-table">
          <div className="higeia-print-table-title">
            <h2>Evolução antropométrica completa</h2>
            <span>Traço (—) indica dado não registrado</span>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>Indicador</th>

                  {assessments.map(
                    (
                      assessment,
                    ) => (
                      <th key={assessment.id}>
                        <span className="higeia-print-date-header">
                          {formatDate(
                            assessment.measuredAt,
                          )}
                        </span>
                      </th>
                    ),
                  )}

                  <th>
                    <span className="higeia-print-date-header">
                      Evolução
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
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
                        .filter(
                          (
                            metric,
                          ) =>
                            assessments.some(
                              (
                                assessment,
                              ) =>
                                metric.getValue(
                                  assessment,
                                  resultsByAssessmentId.get(
                                    assessment.id,
                                  ),
                                ) !== null,
                            ),
                        );

                    if (sectionMetrics.length === 0) {
                      return null;
                    }

                    return (
                      <Fragment key={section}>
                        <tr className="bg-muted">
                          <td
                            colSpan={
                              assessments.length + 2
                            }
                          >
                            {sectionLabels[section]}
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
                              <tr key={metric.key}>
                                <td>{metric.label}</td>

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
                                    >
                                      {formatValue(
                                        value,
                                        metric.unit,
                                      )}
                                    </td>
                                  ),
                                )}

                                <td>
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
        </section>

        <section className="higeia-print-notes">
          <h2>Informações e metodologia</h2>
          <p>Resultados identificados como Higeia são derivados dos dados registrados no prontuário e devem ser interpretados pelo profissional responsável em conjunto com a avaliação clínica.</p>
          <p>A coluna Evolução considera a primeira e a última medição disponível de cada indicador dentro do período apresentado. Valores ausentes não são interpolados.</p>
        </section>

        <footer className="higeia-print-footer">
          <div className="higeia-print-footer-copy">
            <strong>HIGEIA</strong>
            Documento gerado a partir das informações registradas no prontuário eletrônico.
          </div>
          <div className="higeia-print-signature">
            <span className="higeia-print-signature-line" />
            <strong>{authenticatedUser?.name ?? 'Profissional responsável'}</strong>
            <small>{formatRole(activeOrganization?.role)}{activeOrganization?.organizationName ? ` · ${activeOrganization.organizationName}` : ''}</small>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .higeia-print-report {
          display: none;
        }
      `}</style>
    </>
  );
}
