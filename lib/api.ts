const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- AUTHENTICATION ---
export async function registerUser(data: any) {
  const res = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}

export async function loginUser(credentials: any) {
  const res = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Invalid login credentials');
  if (data.access) localStorage.setItem('access_token', data.access);
  if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
  return data;
}

export async function fetchUserProfile() {
  const res = await fetch(`${API_URL}/profile/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

// --- USER TRANSACTIONS & DEPOSITS ---
export async function createDeposit(amount: number) {
  const res = await fetch(`${API_URL}/deposit/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to process deposit');
  return data;
}

export async function createWithdrawal(amount: number, method: string) {
  const res = await fetch(`${API_URL}/withdraw/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, method }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit withdrawal request');
  return data;
}

export async function fetchUserTransactions() {
  const res = await fetch(`${API_URL}/transactions/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load transactions');
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.results || []);
}

// --- ADMIN MANAGEMENT & UPDATES ---
export async function fetchAdminUsers() {
  const res = await fetch(`${API_URL}/admin/users/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load users directory');
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.results || []);
}

export async function updateAdminUserProfile(userId: number, payload: any) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.detail || 'Failed to update user profile');
  return data;
}

export async function toggleUserBlacklist(userId: number, currentStatus: boolean) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/blacklist/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ is_blacklisted: !currentStatus }),
  });
  if (!res.ok) throw new Error('Failed to update blacklist status');
  return res.json();
}

export async function creditUserAccount(email: string, amount: number) {
  const res = await fetch(`${API_URL}/admin/credit-user/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to credit account');
  return data;
}

export async function fetchPendingWithdrawals() {
  const res = await fetch(`${API_URL}/admin/withdrawals/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch withdrawal requests');
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.results || []);
}

export async function processWithdrawalRequest(id: number, action: 'approve' | 'reject') {
  const res = await fetch(`${API_URL}/admin/withdrawals/${id}/process/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error(`Failed to ${action} withdrawal request`);
  return res.json();
}

export async function fetchAdminProcessings() {
  const res = await fetch(`${API_URL}/admin/processings/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch processings');
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.results || []);
}

export async function updateAdminProcessing(id: number, payload: any) {
  const res = await fetch(`${API_URL}/admin/processings/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update processing gateway');
  return data;
}

export async function fetchAdminSettings() {
  const res = await fetch(`${API_URL}/admin/settings/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateAdminSettings(settings: any) {
  const res = await fetch(`${API_URL}/admin/settings/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

// --- INVESTMENT PROGRAMS & DEPOSITS ---
export async function fetchInvestmentPlans() {
  const res = await fetch(`${API_URL}/investment-plans/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load investment plans');
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.results || []);
}

export async function saveInvestmentPlan(planData: any) {
  const method = planData.id && typeof planData.id === 'number' ? 'PUT' : 'POST';
  const url = planData.id && typeof planData.id === 'number'
    ? `${API_URL}/admin/investment-plans/${planData.id}/` 
    : `${API_URL}/admin/investment-plans/`;

  const payload = {
    name: planData.name,
    min_amount: parseFloat(planData.min_amount),
    max_amount: parseFloat(planData.max_amount),
    profit_percent: parseFloat(planData.profit_percent),
    duration_days: parseInt(planData.duration_days, 10),
    status: planData.status || 'Active'
  };

  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.detail || 'Failed to save investment plan');
  return data;
}

export async function deleteInvestmentPlan(planId: number) {
  const res = await fetch(`${API_URL}/admin/investment-plans/${planId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete investment plan');
  return res.json().catch(() => ({ success: true }));
}

export async function fetchExpiringDeposits() {
  const res = await fetch(`${API_URL}/admin/expiring-deposits/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load expiring deposits');
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.results || []);
}