const ADS_CONVERSION_SEND_TO = "AW-18501684540/NxVgCK_vxb0dELyapfZE";

export function trackPurchaseConversion({
  transactionId,
  value,
  currency = "CNY",
}: {
  transactionId: string;
  value: number;
  currency?: string;
}) {
  if (typeof window === "undefined") return;

  const dedupeKey = `conversion_fired_${transactionId}`;
  try {
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, "1");
  } catch {}

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== "function") {
    w.gtag = function () {
      w.dataLayer.push(arguments);
    };
  }

  w.dataLayer.push({
    event: "purchase",
    transaction_id: transactionId,
    value,
    currency,
    ecommerce: { transaction_id: transactionId, value, currency },
  });

  w.gtag("event", "conversion", {
    send_to: ADS_CONVERSION_SEND_TO,
    value,
    currency,
    transaction_id: transactionId,
  });
}
