import {
  z,
} from 'zod';

export const createPatientSchema =
  z.object({
    name:
      z
        .string()
        .trim()
        .min(
          2,
          'Informe o nome completo do paciente.',
        )
        .max(
          120,
          'O nome deve ter no máximo 120 caracteres.',
        ),

    cpf:
      z
        .string()
        .trim()
        .refine(
          (
            value,
          ) => {
            if (
              value.length ===
              0
            ) {
              return true;
            }

            const digits =
              value.replace(
                /\D/g,
                '',
              );

            return (
              digits.length ===
              11
            );
          },
          {
            message:
              'Informe um CPF com 11 dígitos.',
          },
        ),

    email:
      z
        .string()
        .trim()
        .refine(
          (
            value,
          ) =>
            value.length === 0 ||
            z.string()
              .email()
              .safeParse(
                value,
              )
              .success,
          {
            message:
              'Informe um e-mail válido.',
          },
        ),

    phone:
      z
        .string()
        .trim()
        .refine(
          (
            value,
          ) =>
            value.length === 0 ||
            /^\+?[0-9]{8,20}$/.test(
              value,
            ),
          {
            message:
              'Informe um telefone com 8 a 20 dígitos.',
          },
        ),

    birthDate:
      z
        .string()
        .refine(
          (
            value,
          ) =>
            value.length === 0 ||
            /^\d{4}-\d{2}-\d{2}$/.test(
              value,
            ),
          {
            message:
              'Informe uma data de nascimento válida.',
          },
        ),

    biologicalSex:
      z.union([
        z.literal(
          '',
        ),
        z.literal(
          'MALE',
        ),
        z.literal(
          'FEMALE',
        ),
      ]),
  });

export type CreatePatientFormData =
  z.infer<
    typeof createPatientSchema
  >;