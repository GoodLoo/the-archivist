import { OrderStatus } from "@/types";

const steps = [
  { key: "ordered", label: "Ordered" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function TrackingStepper({ order }: { order: OrderStatus }) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, i) => {
          const completed = i < order.currentStep;
          const current = i === order.currentStep;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center border text-xs font-bold font-heading
                  ${completed ? "border-crimson bg-crimson text-white" : ""}
                  ${current ? "border-crimson text-crimson" : ""}
                  ${!completed && !current ? "border-dark-border dark:border-dark-border border-light-border text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary" : ""}
                `}
              >
                {completed ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <p
                className={`mt-2 text-center text-xs font-medium
                  ${completed || current ? "text-crimson" : "text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary"}
                `}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between">
        {steps.slice(0, -1).map((_, i) => (
          <div
            key={i}
            className={`h-px flex-1 ${i < order.currentStep ? "bg-crimson" : "bg-dark-border dark:bg-dark-border bg-light-border"}`}
          />
        ))}
      </div>

      <div className="mt-8 space-y-4 border border-dark-border dark:border-dark-border border-light-border p-6">
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-bold uppercase tracking-wider">
            Order <span className="text-crimson">#{order.orderNumber}</span>
          </p>
          <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
            Est. delivery: {order.estimatedDelivery}
          </p>
        </div>
        <div className="border-t border-dark-border/50 dark:border-dark-border/50 border-light-border/50 pt-4">
          {order.timeline
            .filter((t) => t.completed || t === order.timeline.find((x) => !x.completed))
            .slice(0, 3)
            .map((event) => (
              <div key={event.label} className="flex items-center gap-3 py-2">
                <div className={`h-2 w-2 rounded-full ${event.completed ? "bg-crimson" : "bg-dark-border dark:bg-dark-border bg-light-border"}`} />
                <div>
                  <p className="text-sm font-medium text-dark-text dark:text-dark-text text-light-text">{event.label}</p>
                  <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">{event.date}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary">
          Items in this order
        </p>
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li key={item.name} className="text-sm text-dark-text dark:text-dark-text text-light-text">
              {item.name} &times; {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
