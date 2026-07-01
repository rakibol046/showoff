'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN_KEY, CUSTOMER_STORAGE_KEY } from "@/lib/constants";

const DashboardPage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const customer = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    setAuthorized(true);
    if (customer) {
      setCustomer(JSON.parse(customer));
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  const user = {
    name: customer?.name || 'John Doe',
    email: customer?.email ||  'john.doe@example.com',
    recentOrders: [
      { id: '1001', item: 'Sneakers', status: 'Shipped' },
      { id: '1002', item: 'T-shirt', status: 'Processing' },
      { id: '1003', item: 'Backpack', status: 'Delivered' },
    ],
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '12px' }}>User Dashboard</h1>
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Profile</h2>
        <p style={{ margin: '4px 0' }}><strong>Name:</strong> {user.name}</p>
        <p style={{ margin: '4px 0' }}><strong>Email:</strong> {user.email}</p>
      </section>
      <section>
        <h2 style={{ margin: '0 0 12px' }}>Recent Orders</h2>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {user.recentOrders.map((order) => (
            <li key={order.id} style={{ marginBottom: '8px' }}>
              <strong>#{order.id}</strong> — {order.item} ({order.status})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default DashboardPage;
