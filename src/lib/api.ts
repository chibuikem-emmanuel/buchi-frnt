// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Helper for authenticated requests
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// 1. Fetch Investment Plans
export async function fetchInvestmentPlans() {
  const res = await fetch(`${API_URL}/plans/`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch investment plans');
  return res.json();
}

// 2. Submit Chat Message to CallMeBot WhatsApp Bridge
export async function sendWhatsAppMessage(data: { name: string; email?: string; message: string }) {
  const res = await fetch(`${API_URL}/chat/send-whatsapp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// 3. Register User
export async function registerUser(userData: { email: string; username: string; password: string; phone_number?: string }) {
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

// 4. Login User (Returns JWT & verifies admin staff status)
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

// 5. Fetch Authenticated User Profile
export async function fetchUserProfile() {
  const res = await fetch(`${API_URL}/accounts/profile/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch profile (${res.status})`);
  return res.json();
}

// 6. User Deposit & Withdrawal Requests
export async function createDeposit(amount: number) {
  const res = await fetch(`${API_URL}/deposits/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error('Deposit submission failed');
  return res.json();
}

export async function createWithdrawal(amount: number) {
  const res = await fetch(`${API_URL}/withdrawals/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error('Withdrawal submission failed');
  return res.json();
}

// 7. Admin Actions & Management Endpoints
export async function adminCreditUser(email: string, amount: number) {
  const res = await fetch(`${API_URL}/admin/credit-user/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, amount }),
  });
  if (!res.ok) throw new Error('Failed to credit user account');
  return res.json();
}

export async function adminFetchUsers() {
  const res = await fetch(`${API_URL}/admin/users/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Admin fetch users failed (${res.status})`);
  return res.json();
}

export async function adminUpdateUserStatus(userId: number, isBlacklisted: boolean) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ is_blacklisted: isBlacklisted }),
  });
  if (!res.ok) throw new Error('Failed to update user status');
  return res.json();
}

export async function adminFetchTransactions() {
  const res = await fetch(`${API_URL}/admin/transactions/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function adminFetchWithdrawals() {
  const res = await fetch(`${API_URL}/admin/withdrawals/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch withdrawals');
  return res.json();
}

export async function adminProcessWithdrawal(withdrawalId: number, action: 'approve' | 'reject') {
  const res = await fetch(`${API_URL}/admin/withdrawals/${withdrawalId}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error('Failed to process withdrawal');
  return res.json();
}