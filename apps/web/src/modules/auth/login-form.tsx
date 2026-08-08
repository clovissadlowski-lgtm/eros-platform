'use client';

import {
  zodResolver,
} from '@hookform/resolvers/zod';
import {
  useMutation,
} from '@tanstack/react-query';
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from 'lucide-react';
import {
  useRouter,
} from 'next/navigation';
import {
  useState,
} from 'react';
import {
  useForm,
} from 'react-hook-form';
import {
  toast,
} from 'sonner';

import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';
import {
  Label,
} from '@/components/ui/label';
import {
  ApiError,
} from '@/lib/api/api-error';
import {
  authStorage,
} from '@/lib/auth/auth-storage';

import {
  login,
} from './auth.service';
import {
  loginSchema,
  type LoginFormData,
} from './login.schema';

export function LoginForm() {
  const router = useRouter();

  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormData>({
    resolver:
      zodResolver(
        loginSchema,
      ),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation =
    useMutation({
      mutationFn: login,

      onSuccess: (
        response,
      ) => {
        authStorage.saveTokens(
          response.accessToken,
          response.refreshToken,
        );

        toast.success(
          `Bem-vindo, ${response.user.name}.`,
        );

        router.push(
          '/select-organization',
        );
      },

      onError: (
        error,
      ) => {
        if (
          error instanceof ApiError
        ) {
          if (
            error.code ===
            'INVALID_CREDENTIALS'
          ) {
            toast.error(
              'E-mail ou senha inválidos.',
            );

            return;
          }

          toast.error(
            error.message,
          );

          return;
        }

        toast.error(
          'Não foi possível acessar a Higeia. Verifique sua conexão e tente novamente.',
        );
      },
    });

  const onSubmit = (
    data: LoginFormData,
  ) => {
    loginMutation.mutate(
      data,
    );
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">
          E-mail
        </Label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className="pl-9"
            aria-invalid={
              Boolean(
                errors.email,
              )
            }
            {...register(
              'email',
            )}
          />
        </div>

        {errors.email && (
          <p
            className="text-sm text-destructive"
            role="alert"
          >
            {
              errors.email
                .message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Senha
        </Label>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="password"
            type={
              passwordVisible
                ? 'text'
                : 'password'
            }
            autoComplete="current-password"
            placeholder="Sua senha"
            className="px-9"
            aria-invalid={
              Boolean(
                errors.password,
              )
            }
            {...register(
              'password',
            )}
          />

          <button
            type="button"
            onClick={() =>
              setPasswordVisible(
                (current) =>
                  !current,
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={
              passwordVisible
                ? 'Ocultar senha'
                : 'Mostrar senha'
            }
          >
            {passwordVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p
            className="text-sm text-destructive"
            role="alert"
          >
            {
              errors.password
                .message
            }
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={
          loginMutation.isPending
        }
      >
        {loginMutation.isPending ? (
          <>
            <LoaderCircle className="animate-spin" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
}