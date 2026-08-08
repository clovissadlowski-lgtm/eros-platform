export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Visão geral da sua operação na Higeia.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Pacientes ativos',
            value: '—',
          },
          {
            label: 'Consultas hoje',
            value: '—',
          },
          {
            label: 'Próximas consultas',
            value: '—',
          },
          {
            label: 'Pendências',
            value: '—',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm xl:col-span-2">
          <h2 className="font-semibold">
            Agenda de hoje
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Os próximos atendimentos aparecerão aqui.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">
            Atalhos
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre pacientes e acesse os principais recursos.
          </p>
        </div>
      </div>
    </div>
  );
}
