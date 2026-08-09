'use client';

import {
  Check,
  Pencil,
  Pill,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Input,
} from '@/components/ui/input';
import {
  Label,
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useCreateMedication,
} from './hooks/use-create-medication';
import {
  useDeleteMedication,
} from './hooks/use-delete-medication';
import {
  useMedicationSearch,
} from './hooks/use-medication-search';
import {
  useMedications,
} from './hooks/use-medications';
import {
  useUpdateMedication,
} from './hooks/use-update-medication';

import type {
  Medication,
  MedicationCatalogItem,
  MedicationRoute,
  MedicationStatus,
} from './medical-record.types';

interface MedicationsCardProps {
  patientId: string;
}

interface MedicationFormState {
  medicationCatalogId: string;
  medicationSearch: string;

  dosage: string;
  frequency: string;
  route: MedicationRoute | '';

  indication: string;

  startedAt: string;
  endedAt: string;

  status: MedicationStatus;

  notes: string;
}

const emptyForm:
  MedicationFormState = {
    medicationCatalogId: '',
    medicationSearch: '',

    dosage: '',
    frequency: '',
    route: '',

    indication: '',

    startedAt: '',
    endedAt: '',

    status: 'ACTIVE',

    notes: '',
  };

function getStatusLabel(
  status: MedicationStatus,
): string {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo';

    case 'SUSPENDED':
      return 'Suspenso';

    case 'COMPLETED':
      return 'Concluído';

    case 'DISCONTINUED':
      return 'Descontinuado';
  }
}

function getRouteLabel(
  route: MedicationRoute | null,
): string | null {
  switch (route) {
    case 'ORAL':
      return 'Oral';

    case 'SUBCUTANEOUS':
      return 'Subcutânea';

    case 'INTRAMUSCULAR':
      return 'Intramuscular';

    case 'INTRAVENOUS':
      return 'Intravenosa';

    case 'TOPICAL':
      return 'Tópica';

    case 'INHALATION':
      return 'Inalatória';

    case 'SUBLINGUAL':
      return 'Sublingual';

    case 'RECTAL':
      return 'Retal';

    case 'VAGINAL':
      return 'Vaginal';

    case 'OPHTHALMIC':
      return 'Oftálmica';

    case 'OTIC':
      return 'Otológica';

    case 'NASAL':
      return 'Nasal';

    case 'OTHER':
      return 'Outra';

    default:
      return null;
  }
}

function toDateInputValue(
  value: string | null,
): string {
  if (!value) {
    return '';
  }

  return value.slice(
    0,
    10,
  );
}

function formatDate(
  value: string,
): string {
  return new Date(
    value,
  ).toLocaleDateString(
    'pt-BR',
    {
      timeZone: 'UTC',
    },
  );
}

function getPrimaryCode(
  medication:
    MedicationCatalogItem,
): string | null {
  const primary =
    medication.externalCodes.find(
      (code) =>
        code.isPrimary,
    );

  const code =
    primary ??
    medication.externalCodes[0];

  if (!code) {
    return null;
  }

  return `${code.system.replace(
    '_',
    '-',
  )}: ${code.code}`;
}

function getBrandNames(
  medication:
    MedicationCatalogItem,
): string[] {
  return medication.synonyms
    .filter(
      (synonym) =>
        synonym.type ===
        'BRAND_NAME',
    )
    .map(
      (synonym) =>
        synonym.term,
    );
}

export function MedicationsCard({
  patientId,
}: MedicationsCardProps) {
  const medicationsQuery =
    useMedications(
      patientId,
    );

  const createMutation =
    useCreateMedication(
      patientId,
    );

  const updateMutation =
    useUpdateMedication(
      patientId,
    );

  const deleteMutation =
    useDeleteMedication(
      patientId,
    );

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    form,
    setForm,
  ] =
    useState<MedicationFormState>(
      emptyForm,
    );

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] = useState(false);

  useEffect(
    () => {
      const timeout =
        window.setTimeout(
          () => {
            setDebouncedSearch(
              form.medicationSearch,
            );
          },
          300,
        );

      return () => {
        window.clearTimeout(
          timeout,
        );
      };
    },
    [
      form.medicationSearch,
    ],
  );

  const catalogQuery =
    useMedicationSearch(
      debouncedSearch,
    );

  function resetForm() {
    setForm(
      emptyForm,
    );

    setDebouncedSearch(
      '',
    );

    setIsSearchOpen(
      false,
    );

    setIsCreating(
      false,
    );

    setEditingId(
      null,
    );
  }

  function beginEdit(
    medication:
      Medication,
  ) {
    setIsCreating(
      false,
    );

    setEditingId(
      medication.id,
    );

    setForm({
      medicationCatalogId:
        medication
          .medicationCatalogId ??
        '',

      medicationSearch:
        medication.name,

      dosage:
        medication.dosage ??
        '',

      frequency:
        medication.frequency ??
        '',

      route:
        medication.route ??
        '',

      indication:
        medication.indication ??
        '',

      startedAt:
        toDateInputValue(
          medication.startedAt,
        ),

      endedAt:
        toDateInputValue(
          medication.endedAt,
        ),

      status:
        medication.status,

      notes:
        medication.notes ??
        '',
    });

    setIsSearchOpen(
      false,
    );
  }

  function selectMedication(
    medication:
      MedicationCatalogItem,
  ) {
    setForm(
      (current) => ({
        ...current,

        medicationCatalogId:
          medication.id,

        medicationSearch:
          medication.name,
      }),
    );

    setIsSearchOpen(
      false,
    );
  }

  async function handleCreate() {
    if (
      !form.medicationCatalogId
    ) {
      return;
    }

    await createMutation.mutateAsync({
      medicationCatalogId:
        form.medicationCatalogId,

      dosage:
        form.dosage.trim() ||
        undefined,

      frequency:
        form.frequency.trim() ||
        undefined,

      route:
        form.route ||
        undefined,

      indication:
        form.indication.trim() ||
        undefined,

      startedAt:
        form.startedAt ||
        undefined,

      endedAt:
        form.endedAt ||
        undefined,

      status:
        form.status,

      notes:
        form.notes.trim() ||
        undefined,
    });

    resetForm();
  }

  async function handleUpdate() {
    if (!editingId) {
      return;
    }

    await updateMutation.mutateAsync({
      medicationId:
        editingId,

      input: {
        ...(form.medicationCatalogId
          ? {
              medicationCatalogId:
                form.medicationCatalogId,
            }
          : {}),

        dosage:
          form.dosage.trim() ||
          null,

        frequency:
          form.frequency.trim() ||
          null,

        route:
          form.route ||
          null,

        indication:
          form.indication.trim() ||
          null,

        startedAt:
          form.startedAt ||
          null,

        endedAt:
          form.endedAt ||
          null,

        status:
          form.status,

        notes:
          form.notes.trim() ||
          null,
      },
    });

    resetForm();
  }

  async function handleDelete(
    medication:
      Medication,
  ) {
    const confirmed =
      window.confirm(
        `Excluir o medicamento "${medication.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(
      medication.id,
    );

    if (
      editingId ===
      medication.id
    ) {
      resetForm();
    }
  }

  function renderMedicationSearch(
    mode:
      | 'create'
      | 'edit',
  ) {
    const results =
      catalogQuery.data ??
      [];

    const hasSearch =
      debouncedSearch
        .trim()
        .length >= 2;

    return (
      <div className="relative space-y-2">
        <Label
          htmlFor={`medication-name-${mode}`}
        >
          Medicamento *
        </Label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id={`medication-name-${mode}`}
            className="pl-10"
            value={
              form.medicationSearch
            }
            onFocus={() =>
              setIsSearchOpen(
                true,
              )
            }
            onChange={(
              event,
            ) => {
              const value =
                event.target.value;

              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  medicationSearch:
                    value,

                  medicationCatalogId:
                    '',
                }),
              );

              setIsSearchOpen(
                true,
              );
            }}
            placeholder="Busque por medicamento, marca ou código. Ex.: Losartana, Cozaar, C09CA01"
            autoComplete="off"
          />
        </div>

        {form.medicationCatalogId && (
          <p className="flex items-center gap-1 text-xs text-primary">
            <Check className="size-3.5" />
            Medicamento canônico selecionado
          </p>
        )}

        {isSearchOpen &&
          hasSearch && (
            <div className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border bg-background shadow-lg">
              {catalogQuery.isLoading && (
                <p className="p-4 text-sm text-muted-foreground">
                  Pesquisando catálogo de medicamentos...
                </p>
              )}

              {catalogQuery.isError && (
                <p className="p-4 text-sm text-destructive">
                  Não foi possível pesquisar o catálogo de medicamentos.
                </p>
              )}

              {!catalogQuery.isLoading &&
                !catalogQuery.isError &&
                results.length ===
                  0 && (
                  <p className="p-4 text-sm text-muted-foreground">
                    Nenhum medicamento encontrado.
                  </p>
                )}

              {results.map(
                (
                  medication,
                ) => {
                  const primaryCode =
                    getPrimaryCode(
                      medication,
                    );

                  const brandNames =
                    getBrandNames(
                      medication,
                    );

                  return (
                    <button
                      key={
                        medication.id
                      }
                      type="button"
                      className="flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted"
                      onClick={() =>
                        selectMedication(
                          medication,
                        )
                      }
                    >
                      <span className="font-medium">
                        {
                          medication.name
                        }
                      </span>

                      <span className="text-xs text-muted-foreground">
                        Princípio ativo:{' '}
                        {
                          medication.activeIngredient
                        }
                      </span>

                      {brandNames.length >
                        0 && (
                        <span className="text-xs text-muted-foreground">
                          Nome comercial:{' '}
                          {brandNames
                            .slice(
                              0,
                              4,
                            )
                            .join(
                              ', ',
                            )}
                        </span>
                      )}

                      {primaryCode && (
                        <span className="text-xs text-muted-foreground">
                          {
                            primaryCode
                          }
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
      </div>
    );
  }

  function renderForm(
    mode:
      | 'create'
      | 'edit',
  ) {
    const isPending =
      createMutation.isPending ||
      updateMutation.isPending;

    const canSave =
      mode === 'create'
        ? Boolean(
            form.medicationCatalogId,
          )
        : true;

    return (
      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {renderMedicationSearch(
            mode,
          )}

          <div className="space-y-2">
            <Label>
              Dosagem
            </Label>

            <Input
              value={
                form.dosage
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    dosage:
                      event.target
                        .value,
                  }),
                )
              }
              placeholder="Ex.: 50 mg"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Frequência
            </Label>

            <Input
              value={
                form.frequency
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    frequency:
                      event.target
                        .value,
                  }),
                )
              }
              placeholder="Ex.: 1x ao dia"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Via
            </Label>

            <Select
              value={
                form.route ||
                undefined
              }
              onValueChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    route:
                      value as MedicationRoute,
                  }),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ORAL">
                  Oral
                </SelectItem>

                <SelectItem value="SUBCUTANEOUS">
                  Subcutânea
                </SelectItem>

                <SelectItem value="INTRAMUSCULAR">
                  Intramuscular
                </SelectItem>

                <SelectItem value="INTRAVENOUS">
                  Intravenosa
                </SelectItem>

                <SelectItem value="TOPICAL">
                  Tópica
                </SelectItem>

                <SelectItem value="INHALATION">
                  Inalatória
                </SelectItem>

                <SelectItem value="SUBLINGUAL">
                  Sublingual
                </SelectItem>

                <SelectItem value="RECTAL">
                  Retal
                </SelectItem>

                <SelectItem value="VAGINAL">
                  Vaginal
                </SelectItem>

                <SelectItem value="OPHTHALMIC">
                  Oftálmica
                </SelectItem>

                <SelectItem value="OTIC">
                  Otológica
                </SelectItem>

                <SelectItem value="NASAL">
                  Nasal
                </SelectItem>

                <SelectItem value="OTHER">
                  Outra
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Indicação
            </Label>

            <Input
              value={
                form.indication
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    indication:
                      event.target
                        .value,
                  }),
                )
              }
              placeholder="Ex.: Hipertensão arterial"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Status
            </Label>

            <Select
              value={
                form.status
              }
              onValueChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    status:
                      value as MedicationStatus,
                  }),
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">
                  Ativo
                </SelectItem>

                <SelectItem value="SUSPENDED">
                  Suspenso
                </SelectItem>

                <SelectItem value="COMPLETED">
                  Concluído
                </SelectItem>

                <SelectItem value="DISCONTINUED">
                  Descontinuado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Data de início
            </Label>

            <Input
              type="date"
              value={
                form.startedAt
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    startedAt:
                      event.target
                        .value,
                  }),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Data de término
            </Label>

            <Input
              type="date"
              value={
                form.endedAt
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    endedAt:
                      event.target
                        .value,
                  }),
                )
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>
              Observações
            </Label>

            <Input
              value={
                form.notes
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    notes:
                      event.target
                        .value,
                  }),
                )
              }
              placeholder="Informações complementares"
            />
          </div>
        </div>

        {mode === 'create' &&
          !form.medicationCatalogId &&
          form.medicationSearch
            .trim()
            .length > 0 && (
            <p className="text-sm text-muted-foreground">
              Selecione um medicamento encontrado no catálogo para continuar.
            </p>
          )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={
              isPending
            }
            onClick={
              resetForm
            }
          >
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={
              isPending ||
              !canSave
            }
            onClick={
              mode ===
              'create'
                ? handleCreate
                : handleUpdate
            }
          >
            {isPending
              ? 'Salvando...'
              : mode ===
                  'create'
                ? 'Salvar medicamento'
                : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Pill className="size-5 text-primary" />
            Medicamentos
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Medicamentos atuais e histórico farmacológico do paciente.
          </p>
        </div>

        {!isCreating &&
          !editingId && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setForm(
                  emptyForm,
                );

                setIsCreating(
                  true,
                );
              }}
            >
              <Plus className="size-4" />
              Adicionar
            </Button>
          )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isCreating &&
          renderForm(
            'create',
          )}

        {medicationsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando medicamentos...
          </p>
        )}

        {medicationsQuery.isError && (
          <p className="text-sm text-destructive">
            Não foi possível carregar os medicamentos.
          </p>
        )}

        {medicationsQuery.data?.length ===
          0 &&
          !isCreating && (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm font-medium">
                Nenhum medicamento registrado
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Os medicamentos estruturados do paciente aparecerão aqui.
              </p>
            </div>
          )}

        {medicationsQuery.data?.map(
          (
            medication,
          ) => (
            <div
              key={
                medication.id
              }
            >
              {editingId ===
              medication.id ? (
                renderForm(
                  'edit',
                )
              ) : (
                <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {
                          medication.name
                        }
                      </p>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {getStatusLabel(
                          medication.status,
                        )}
                      </span>

                      {medication.medicationCatalogId && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-primary">
                          Padronizado
                        </span>
                      )}
                    </div>

                    {(medication.dosage ||
                      medication.frequency) && (
                      <p className="text-sm text-muted-foreground">
                        {[
                          medication.dosage,
                          medication.frequency,
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(
                            ' • ',
                          )}
                      </p>
                    )}

                    {getRouteLabel(
                      medication.route,
                    ) && (
                      <p className="text-sm text-muted-foreground">
                        Via:{' '}
                        {getRouteLabel(
                          medication.route,
                        )}
                      </p>
                    )}

                    {medication.indication && (
                      <p className="text-sm text-muted-foreground">
                        Indicação:{' '}
                        {
                          medication.indication
                        }
                      </p>
                    )}

                    {(medication.startedAt ||
                      medication.endedAt) && (
                      <p className="text-sm text-muted-foreground">
                        {medication.startedAt &&
                          `Início: ${formatDate(
                            medication.startedAt,
                          )}`}

                        {medication.startedAt &&
                          medication.endedAt &&
                          ' • '}

                        {medication.endedAt &&
                          `Término: ${formatDate(
                            medication.endedAt,
                          )}`}
                      </p>
                    )}

                    {medication.notes && (
                      <p className="text-sm text-muted-foreground">
                        {
                          medication.notes
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        beginEdit(
                          medication,
                        )
                      }
                      aria-label="Editar medicamento"
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        void handleDelete(
                          medication,
                        )
                      }
                      aria-label="Excluir medicamento"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ),
        )}

        {(createMutation.isError ||
          updateMutation.isError ||
          deleteMutation.isError) && (
          <p className="text-sm text-destructive">
            Não foi possível concluir a operação. Tente novamente.
          </p>
        )}
      </CardContent>
    </Card>
  );
}