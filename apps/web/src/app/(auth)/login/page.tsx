import type {
  Metadata,
} from 'next';

import {
  Activity,
  BrainCircuit,
  HeartPulse,
  ShieldCheck,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LoginForm,
} from '@/modules/auth/login-form';

export const metadata: Metadata = {
  title: 'Entrar',
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-muted/30 lg:grid-cols-2">
      <section className="hidden min-h-screen flex-col justify-between bg-foreground p-12 text-background lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-background text-foreground">
            <HeartPulse className="size-5" />
          </div>

          <div>
            <p className="text-xl font-semibold tracking-tight">
              Higeia
            </p>

            <p className="text-sm text-background/60">
              Saúde inteligente
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-background/50">
            Plataforma clínica inteligente
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Informação clínica organizada para decisões melhores.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-background/65">
            Gestão de pacientes, prontuário,
            agenda e inteligência em uma
            experiência integrada.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-background/10 bg-background/5 p-4">
              <ShieldCheck className="mb-3 size-5" />

              <p className="text-sm font-medium">
                Multi-tenant
              </p>
            </div>

            <div className="rounded-xl border border-background/10 bg-background/5 p-4">
              <Activity className="mb-3 size-5" />

              <p className="text-sm font-medium">
                Gestão clínica
              </p>
            </div>

            <div className="rounded-xl border border-background/10 bg-background/5 p-4">
              <BrainCircuit className="mb-3 size-5" />

              <p className="text-sm font-medium">
                Inteligência
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-background/40">
          Higeia · Plataforma de saúde
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
              <HeartPulse className="size-5" />
            </div>

            <span className="text-xl font-semibold">
              Higeia
            </span>
          </div>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl">
                Bem-vindo à Higeia
              </CardTitle>

              <CardDescription className="text-base">
                Entre com suas credenciais para acessar sua organização.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ambiente protegido. O acesso é
            restrito a usuários autorizados.
          </p>
        </div>
      </section>
    </main>
  );
}