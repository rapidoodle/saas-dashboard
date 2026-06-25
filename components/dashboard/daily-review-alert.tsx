"use client";

/**
 * DailyReviewAlert — shows a contextual banner with items that need attention today.
 * In production these would come from SP-API data. Currently uses static placeholders.
 */
export function DailyReviewAlert() {
  const alerts = [
    { type: "warning", message: "3 listings suppressed — review required" },
    { type: "info", message: "FBA restock recommended for 5 SKUs" },
    { type: "success", message: "Buy Box won on 87% of active listings" },
  ];

  const colors: Record<string, string> = {
    warning: "bg-yellow-900/30 border-yellow-700 text-yellow-300",
    info: "bg-blue-900/30 border-blue-700 text-blue-300",
    success: "bg-green-900/30 border-green-700 text-green-300",
  };

  const icons: Record<string, JSX.Element> = {
    warning: (
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {alerts.map((alert) => (
        <div
          key={alert.message}
          className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium ${colors[alert.type]}`}
        >
          {icons[alert.type]}
          {alert.message}
        </div>
      ))}
    </div>
  );
}
