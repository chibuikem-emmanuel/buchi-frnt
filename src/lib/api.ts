// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// 1. Register User
export async function registerUser(userData: { 
  email: string; 
  username: string; 
  password: string; 
  phone_number?: string;
  country?: string;
  eth_address?: string;
  btc_address?: string;
  usdt_erc20?: string;
  usdt_trc20?: string;
}) {
  const res = await fetch(`${API_URL}/accounts/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData) || 'Registration failed');
  }
  return res.json();
}

// 2. Login User (Returns JWT & verifies admin staff status)
export async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Invalid email or password');
  
  const data = await res.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
  }
  
  const profileRes = await fetch(`${API_URL}/accounts/profile/`, {
    headers: { 'Authorization': `Bearer ${data.access}` },
  });
  
  if (profileRes.ok) {
    const profile = await profileRes.json();
    return { ...data, is_staff: profile.is_staff || profile.is_superuser };
  }

  return data;
}

// 3. Fetch Authenticated User Profile
export async function fetchUserProfile() {
  const res = await fetch(`${API_URL}/accounts/profile/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch profile (${res.status})`);
  return res.json();
}

// 4. User Actions (Deposits & Withdrawals)
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

export async function createWithdrawal(amount: number) {
  const res = await fetch(`${API_URL}/withdraw/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit withdrawal request');
  return data;
}

// 5. Admin API Helpers
export async function adminFetchUsers() {
  const res = await fetch(`${API_URL}/admin/users/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function adminFetchTransactions(type = 'all') {
  const res = await fetch(`${API_URL}/admin/transactions/?type=${type}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function adminFetchWithdrawals() {
  const res = await fetch(`${API_URL}/admin/withdrawals/pending/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch withdrawals');
  return res.json();
}

export async function adminCreditUser(email: string, amount: number) {
  const res = await fetch(`${API_URL}/admin/credit-user/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, amount })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to credit user');
  return data;
}

export async function adminUpdateUserStatus(userId: number, is_blacklisted: boolean) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ is_blacklisted })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function adminProcessWithdrawal(id: number, action: 'approve' | 'reject') {
  const res = await fetch(`${API_URL}/admin/withdrawals/${id}/process/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action })
  });
  if (!res.ok) throw new Error('Failed to process withdrawal');
  return res.json();
}