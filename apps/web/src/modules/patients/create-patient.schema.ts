import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      'Informe pelo menos 2 caracteres.',
    )
    .max(
      120,
      'O nome deve ter no máximo 120 caracteres.',
    ),

  email: z
    .union([
      z.literal(''),
      z
        .string()
        .email(
          'Informe um e-mail válido.',
        ),
    ]),

  phone: z
    .union([
      z.literal(''),
      z
        .string()
        .regex(
          /^\+?[0-9]{8,20}$/,
          'Informe entre 8 e 20 dígitos.',
        ),
    ]),

  birthDate: z
    .union([
      z.literal(''),
      z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          'Informe uma data válida.',
        ),
    ]),
});

export type CreatePatientFormData =
  z.infer<
    typeof createPatientSchema
  >;