import Link from "next/link";
import { notFound } from "next/navigation";

const paymentStatuses = {
  success: {
    title: "Payment successful",
    description: "Your SSLCommerz payment has been completed successfully.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
  fail: {
    title: "Payment failed",
    description: "SSLCommerz could not complete this payment.",
    tone: "border-red-200 bg-red-50 text-red-950",
  },
  cancel: {
    title: "Payment cancelled",
    description: "The SSLCommerz payment was cancelled before completion.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
};

type PaymentResultPageProps = {
  params: Promise<{ status: string }> | { status: string };
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

export default async function PaymentResultPage({
  params,
  searchParams,
}: PaymentResultPageProps) {
  const { status } = await Promise.resolve(params);
  const query = await Promise.resolve(searchParams);
  const result = paymentStatuses[status as keyof typeof paymentStatuses];

  if (!result) {
    notFound();
  }

  const bookingId = getParam(query, "booking_id") || getParam(query, "bookingId");
  const transactionId = getParam(query, "tran_id") || getParam(query, "tranId");
  const amount = getParam(query, "amount");
  const currency = getParam(query, "currency");
  const message = getParam(query, "message") || getParam(query, "error");

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-950">
      <section className="mx-auto max-w-xl">
        <div className={`rounded-2xl border p-6 ${result.tone}`}>
          <p className="text-sm font-semibold uppercase tracking-normal">
            SSLCommerz
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{result.title}</h1>
          <p className="mt-3 text-sm leading-6">{message || result.description}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Payment details</h2>
          <dl className="mt-4 divide-y divide-gray-100 text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-gray-500">Booking ID</dt>
              <dd className="font-semibold">{bookingId ? `#${bookingId}` : "N/A"}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-gray-500">Transaction ID</dt>
              <dd className="font-semibold">{transactionId || "N/A"}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-gray-500">Amount</dt>
              <dd className="font-semibold">
                {amount ? `${currency || "BDT"} ${amount}` : "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Browse stays
          </Link>
          <Link
            href="/booking"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-50"
          >
            Back to booking
          </Link>
        </div>
      </section>
    </main>
  );
}
