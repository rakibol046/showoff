import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { useGetDashboardStatsQuery } from "@/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import useCurrency from "@/hooks/useCurrency";

const ORDER_STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ORDER_BADGE_COLORS = [0, 1, 2, 3, 4].map((s) => {
  const map = {
    0: "bg-yellow-100 text-yellow-800",
    1: "bg-blue-100 text-blue-800",
    2: "bg-purple-100 text-purple-800",
    3: "bg-green-100 text-green-800",
    4: "bg-red-100 text-red-800",
  };
  return map[s];
});

const ORDER_STATUS_NAMES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function StatCard({ label, value, icon: Icon, color, loading }) {
  return (
    <div className="bg-card border rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const symbol = useCurrency();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon={Package} color="bg-blue-500" loading={isLoading} />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} color="bg-orange-500" loading={isLoading} />
        <StatCard label="Customers" value={stats?.totalCustomers ?? 0} icon={Users} color="bg-purple-500" loading={isLoading} />
        <StatCard
          label="Revenue"
          value={`${symbol}${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          loading={isLoading}
        />
      </div>

      {/* Order Status Overview */}
      {stats?.orderStats && (
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Order Status Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(stats.orderStats).map(([key, count]) => (
              <div key={key} className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">{ORDER_STATUS_LABELS[key] || key}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !stats?.recentOrders?.length ? (
            <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2.5 font-mono text-xs">{order.order_id}</td>
                      <td className="py-2.5">{order.customer_id?.name || order.receiver_name || "—"}</td>
                      <td className="py-2.5 font-medium">{symbol}{order.total_bill}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_BADGE_COLORS[order.order_status]}`}>
                          {ORDER_STATUS_NAMES[order.order_status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-card border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" /> Low Stock Products
            </h2>
            <Link to="/products" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !stats?.lowStockProducts?.length ? (
            <p className="text-muted-foreground text-sm text-center py-8">All products well-stocked</p>
          ) : (
            <div className="space-y-2">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  {product.images?.[0] ? (
                    <img src={`http://localhost:8080${product.images[0]}`} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{symbol}{product.sell_price}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${product.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
