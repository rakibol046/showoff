import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGetSalesReportQuery } from "@/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import useCurrency from "@/hooks/useCurrency";

function trendPct(current, prev) {
  if (prev === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prev) / prev) * 100);
}

function TrendBadge({ current, prev, label }) {
  const pct = trendPct(current, prev);
  const up = pct > 0;
  const flat = pct === 0;

  return (
    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      flat ? "bg-muted text-muted-foreground"
      : up ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
    }`}>
      {flat ? <Minus className="w-3 h-3" /> : up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {flat ? "No change" : `${up ? "+" : ""}${pct}%`}
      <span className="text-muted-foreground font-normal">{label}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label, symbol }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border rounded-lg shadow-lg p-3 text-sm space-y-1 min-w-[140px]">
      <p className="font-medium text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold">
            {p.dataKey === "revenue" ? `${symbol}${p.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SalesChart() {
  const [view, setView] = useState("weekly");
  const { data: report, isLoading } = useGetSalesReportQuery();
  const symbol = useCurrency();

  if (isLoading) {
    return (
      <div className="bg-card border rounded-xl p-5 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const isWeekly = view === "weekly";
  const section = isWeekly ? report?.weekly : report?.monthly;
  const data = section?.data ?? [];
  const trend = section?.trend ?? {};
  const xKey = isWeekly ? "label" : "label";
  const prevLabel = isWeekly ? "vs last week" : "vs last month";

  return (
    <div className="bg-card border rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-lg">Sales Report</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Revenue and order trends</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-muted rounded-lg p-1 gap-1 self-start sm:self-auto">
          {["weekly", "monthly"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                view === v ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Trend summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-xl font-bold">
            {symbol}{(trend.revenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <TrendBadge current={trend.revenue ?? 0} prev={trend.revenuePrev ?? 0} label={prevLabel} />
        </div>
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Orders</p>
          <p className="text-xl font-bold">{trend.orders ?? 0}</p>
          <TrendBadge current={trend.orders ?? 0} prev={trend.ordersPrev ?? 0} label={prevLabel} />
        </div>
      </div>

      {/* Revenue area chart */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Revenue</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={isWeekly ? 0 : "preserveStartEnd"}
              tickFormatter={(v) => isWeekly ? v.split(",")[0] : v.split(" ")[0]}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${symbol}${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip symbol={symbol} />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders bar chart */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Orders</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={isWeekly ? 0 : "preserveStartEnd"}
              tickFormatter={(v) => isWeekly ? v.split(",")[0] : v.split(" ")[0]}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip symbol={symbol} />} />
            <Bar dataKey="orders" name="Orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
