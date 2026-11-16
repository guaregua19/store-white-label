"use client";

import { useEffect, useState } from "react";
import type { FinancingType, PaymentMethod, Simulation } from "@/lib/api/types";
import { formatDate, formatMoney } from "@/lib/format";

interface Props {
  slug: string;
  productId: number;
  financingTypes: FinancingType[];
  paymentMethods: PaymentMethod[];
}

type Result = { query: string; simulation?: Simulation; error?: string };

export function FinancingSimulator({ slug, productId, financingTypes, paymentMethods }: Props) {
  const [financingTypeId, setFinancingTypeId] = useState(financingTypes[0]?.id);
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id);
  const [result, setResult] = useState<Result>();

  const params = new URLSearchParams({ productId: String(productId) });
  if (financingTypeId !== undefined) params.set("financingTypeId", String(financingTypeId));
  if (paymentMethodId !== undefined) params.set("paymentMethodId", String(paymentMethodId));
  const query = params.toString();

  useEffect(() => {
    if (financingTypeId === undefined) return;
    const controller = new AbortController();

    fetch(`/api/storefront/${encodeURIComponent(slug)}/simulate?${query}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? "No se pudo calcular el financiamiento");
        setResult({ query, simulation: body as Simulation });
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setResult({ query, error: e.message });
      });

    return () => controller.abort();
  }, [slug, query, financingTypeId]);

  if (financingTypes.length === 0) {
    return <p className="text-sm text-muted">Este producto no tiene planes de financiamiento disponibles.</p>;
  }

  const loading = result?.query !== query;
  const simulation = result?.simulation;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-foreground/15 bg-surface p-4 text-foreground">
      <h2 className="text-lg font-semibold">Simula tu financiamiento</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label="Plan" value={financingTypeId} options={financingTypes} onChange={setFinancingTypeId} />
        {paymentMethods.length > 0 && (
          <SelectField
            label="Medio de pago"
            value={paymentMethodId}
            options={paymentMethods}
            onChange={setPaymentMethodId}
          />
        )}
      </div>

      {!loading && result?.error && <p className="text-sm text-red-600">{result.error}</p>}

      {simulation && (
        <div className={`flex flex-col gap-4 transition-opacity ${loading ? "opacity-50" : ""}`}>
          {/* Los montos en Bs. son largos: cada tarjeta mide al menos su contenido y baja de línea si no cabe. */}
          <dl className="flex flex-wrap gap-3 text-center">
            <Amount label="Inicial" simulation={simulation} field="initialPayment" />
            <Amount label="Cuota" simulation={simulation} field="installmentAmount" />
            <Amount label="Total" simulation={simulation} field="totalAmount" />
          </dl>

          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="py-1 font-normal">#</th>
                <th className="py-1 font-normal">Fecha</th>
                <th className="py-1 text-right font-normal">Monto</th>
              </tr>
            </thead>
            <tbody>
              {simulation.payments.map((payment) => (
                <tr key={payment.number} className="border-t border-foreground/10">
                  <td className="py-1">{payment.isInitial ? "Inicial" : payment.number}</td>
                  <td className="py-1">{formatDate(payment.date)}</td>
                  <td className="py-1 text-right">
                    {formatMoney(payment.amount, simulation.currency)}
                    {payment.usdAmount !== undefined && (
                      <span className="ml-2 text-muted">({formatMoney(payment.usdAmount, "USD")})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && !simulation && <div className="h-24 animate-pulse rounded-lg bg-surface-muted" />}
    </section>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number | undefined;
  options: { id: number; name: string }[];
  onChange: (id: number) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium">
      {label}
      <span className="relative">
        {/* Fondo y texto explícitos: la lista nativa los hereda. text-base en móvil evita el zoom de iOS al enfocar. */}
        <select
          className="w-full cursor-pointer appearance-none truncate rounded-lg border border-foreground/20 bg-surface py-2.5 pl-3 pr-10 text-base font-normal text-foreground outline-none transition-colors hover:border-foreground/40 focus:border-accent focus:ring-2 focus:ring-accent/25 sm:text-sm"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-60"
        >
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}

function Amount({
  label,
  simulation,
  field,
}: {
  label: string;
  simulation: Simulation;
  field: "initialPayment" | "installmentAmount" | "totalAmount";
}) {
  return (
    <div className="min-w-max flex-1 rounded-lg bg-surface-muted p-3 text-foreground">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-semibold">{formatMoney(simulation[field], simulation.currency)}</dd>
      {simulation.currency === "VES" && simulation.usd && (
        <dd className="text-xs text-muted">{formatMoney(simulation.usd[field], "USD")}</dd>
      )}
    </div>
  );
}
