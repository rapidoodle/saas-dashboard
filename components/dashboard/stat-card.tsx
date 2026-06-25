interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  accent?: boolean;
}

import React from "react";

export function StatCard({ label, value, change, icon, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-3 ${
        accent
          ? "bg-amazon-orange border-amazon-orange-dark"
          : "bg-amazon-navy-mid border-amazon-navy-light"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${accent ? "text-amazon-navy" : "text-gray-400"}`}>
          {label}
        </p>
        {icon && (
          <span className={`${accent ? "text-amazon-navy opacity-60" : "text-amazon-orange opacity-80"}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold ${accent ? "text-amazon-navy" : "text-white"}`}>
        {value}
      </p>
      {change !== undefined && (
        <p
          className={`text-xs font-medium flex items-center gap-1 ${
            accent
              ? change >= 0
                ? "text-amazon-navy"
                : "text-red-800"
              : change >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {change >= 0 ? (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {Math.abs(change).toFixed(1)}% vs yesterday
        </p>
      )}
    </div>
  );
}
