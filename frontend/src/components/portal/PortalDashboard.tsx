import {
  PortalShell,
  SectionCard,
  StatCard,
  type NavItem,
} from "./PortalShell";

export type Metric = {
  label: string;
  value: string;
  hint: string;
  color?: "blue" | "green" | "orange" | "teal";
};

export function PortalDashboard({
  title,
  subtitle,
  badge,
  nav,
  metrics,
  actions,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  nav: NavItem[];
  metrics: Metric[];
  actions: string[];
}) {
  return (
    <PortalShell
      title={title}
      subtitle={subtitle}
      badge={badge}
      nav={nav}
    >

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            {...metric}
          />
        ))}

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">

        <SectionCard
          title="Recent Activity"
          subtitle="Live operational workspace"
        >

          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left text-sm">

              <thead>

                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">

                  <th className="px-3 py-3">
                    Reference
                  </th>

                  <th className="px-3 py-3">
                    Type
                  </th>

                  <th className="px-3 py-3">
                    Status
                  </th>

                  <th className="px-3 py-3">
                    Updated
                  </th>

                </tr>

              </thead>

              <tbody>

                {[
                  ["GOG-48296610", "Shipment", "In transit", "2 min ago"],
                  ["MNF-10428", "Manifest", "Processing", "7 min ago"],
                  ["EXC-2941", "Exception", "Action required", "11 min ago"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-slate-100 hover:bg-sky-50/40"
                  >

                    {row.map((value) => (
                      <td
                        key={value}
                        className="px-3 py-4 font-semibold text-slate-600 first:font-black first:text-slate-900"
                      >
                        {value}
                      </td>
                    ))}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </SectionCard>

        <SectionCard title="Quick Actions">

          <div className="grid gap-3">

            {actions.map((action) => (
              <button
                key={action}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-black transition hover:border-sky-200 hover:bg-sky-50 hover:text-[#0369a1]"
              >
                {action}
              </button>
            ))}

          </div>

        </SectionCard>

      </div>

    </PortalShell>
  );
}