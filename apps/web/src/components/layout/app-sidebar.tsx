'use client';

import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import {
  usePathname,
} from 'next/navigation';

const navigation = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pacientes',
    href: '/patients',
    icon: Users,
  },
  {
    label: 'Agenda',
    href: '/appointments',
    icon: CalendarDays,
  },
  {
    label: 'Prontuários',
    href: '/medical-records',
    icon: Stethoscope,
  },
  {
    label: 'Nutrição',
    href: '/nutrition',
    icon: Utensils,
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname =
    usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-semibold tracking-tight">
          Higeia
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              pathname ===
                item.href ||
              (
                item.href !==
                  '/dashboard' &&
                pathname.startsWith(
                  `${item.href}/`,
                )
              );

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(
                  ' ',
                )}
              >
                <Icon className="size-4" />

                {
                  item.label
                }
              </Link>
            );
          },
        )}
      </nav>

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Higeia Platform
        </p>
      </div>
    </aside>
  );
}