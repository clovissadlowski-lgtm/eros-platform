'use client';

import {
  LogOut,
  Menu,
} from 'lucide-react';
import {
  useRouter,
} from 'next/navigation';

import {
  Button,
} from '@/components/ui/button';
import {
  authStorage,
} from '@/lib/auth/auth-storage';

export function AppHeader() {
  const router =
    useRouter();

  function handleLogout() {
    authStorage.clear();

    router.replace(
      '/login',
    );
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </Button>

        <div>
          <p className="text-sm font-medium">
            Clínica Higeia Teste
          </p>

          <p className="text-xs text-muted-foreground">
            Organização ativa
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">
            Usuário Higeia
          </p>

          <p className="text-xs text-muted-foreground">
            Proprietário
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={
            handleLogout
          }
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}