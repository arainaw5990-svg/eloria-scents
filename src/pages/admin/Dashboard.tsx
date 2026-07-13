import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice, formatDate, STATUS_LABELS, STATUS_COLORS } from '../../lib/utils';
import type { Order } from '../../lib/types';

interface Stats {
  products: number;
  orders: number;
  pendingOrders: number;
  completedOrders: number;
  customers: number;
  reviews: number;
  revenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0, orders: 0, pendingOrders: 0, completedOrders: 0,
    customers: 0, reviews: 0, revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
    ]).then(([p, o, c, r]) => {
      const orders = (o.data ?? []) as Order[];
      setStats({
        products: p.count ?? 0,
        orders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        completedOrders: orders.filter((o) => o.status === 'delivered').length,
        customers: c.count ?? 0,
        reviews: r.count ?? 0,
        revenue: orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
      });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, to: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, to: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, to: '/admin/orders' },
    { label: 'Completed', value: stats.completedOrders, icon: CheckCircle, to: '/admin/orders' },
    { label: 'Customers', value: stats.customers, icon: Users, to: '/admin/customers' },
    { label: 'Reviews', value: stats.reviews, icon: Star, to: '/admin/reviews' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: TrendingUp, to: '/admin/orders' },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="group rounded-2xl border border-ink-100 bg-white p-5 transition hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink-50 text-ink-600 transition group-hover:bg-gold-400 group-hover:text-ink-900">
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-ink-900">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-ink-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-ink-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-gold-600 hover:text-gold-700">
            View All
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ink-50">
                    <td className="py-3 font-medium text-ink-900">{order.order_number}</td>
                    <td className="py-3 text-ink-500">{formatDate(order.created_at)}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-ink-900">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-ink-400">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
