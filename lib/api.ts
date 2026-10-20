const getRawApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'https://buchi-bck.onrender.com/api';
  url = url.replace(/\[.*?\]\(.*?\)/g, '').replace(/[\[\]]/g, '').trim();
  if (!url || !url.startsWith('http')) {
    url = 'https://buchi-bck.onrender.com/api';
  }
  return url.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, '');
};

const API_URL = getRawApiUrl();

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// --- AUTHENTICATION & USER PROFILE ---

export async function registerUser(userData: { 
  email: string; 
  username: string; 
  password: string; 
  phone_number?: string;
  country?: string;
  payout_address?: string;
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

  const isAdminEmail = credentials.email.trim().toLowerCase() === 'admin@crystalsinvestments.org';

  try {
    const profileRes = await fetch(`${API_URL}/accounts/profile/`, {
      headers: { 'Authorization': `Bearer ${data.access}` },
    });
    if (profileRes.ok) {
      const profile = await profileRes.json();
      return { 
        ...data, 
        is_staff: Boolean(isAdminEmail || profile.is_staff || profile.is_superuser || profile.role === 'admin') 
      };
    }
  } catch (err) {
    console.error('Failed to verify profile role:', err);
  }

  return { ...data, is_staff: isAdminEmail };
}

export async function fetchUserProfile() {
  const res = await fetch(`${API_URL}/accounts/profile/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch profile (${res.status})`);
  return res.json();
}

// --- USER TRANSACTIONS ---

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

// --- ADMIN MANAGEMENT ENDPOINTS ---

export async function fetchAdminUsers() {
  const res = await fetch(`${API_URL}/admin/users/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load user directory');
  const data = await res.json();
  if (data && Array.isArray(data.results)) return data.results;
  return Array.isArray(data) ? data : [];
}

export async function toggleUserBlacklist(userId: number, isBlacklisted: boolean) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ is_blacklisted: isBlacklisted })
  });
  if (!res.ok) throw new Error('Failed to update blacklist state');
  return res.json();
}

export async function creditUserAccount(email: string, amount: number) {
  const res = await fetch(`${API_URL}/admin/credit-user/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, amount })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to credit user');
  return data;
}

export async function fetchPendingWithdrawals() {
  const res = await fetch(`${API_URL}/admin/withdrawals/pending/`, { 
    headers: getAuthHeaders() 
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Pending withdrawals fetch error:', res.status, errorText);
    throw new Error('Failed to load pending withdrawals');
  }

  const data = await res.json();
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  return Array.isArray(data) ? data : [];
}

export async function processWithdrawalRequest(id: number, action: 'approve' | 'reject') {
  const res = await fetch(`${API_URL}/admin/withdrawals/${id}/process/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action })
  });
  if (!res.ok) throw new Error('Failed to process withdrawal request');
  return res.json();
}

export async function fetchAdminSettings() {
  const res = await fetch(`${API_URL}/admin/settings/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load system settings');
  return res.json();
}

export async function updateAdminSettings(settings: { platform_name: string }) {
  const res = await fetch(`${API_URL}/admin/settings/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update system settings');
  return data;
}


export async function fetchUserTransactions() {
  const res = await fetch(`${API_URL}/transactions/`, { 
    headers: getAuthHeaders() 
  });
  
  if (!res.ok) throw new Error('Failed to load transaction history');
  
  const data = await res.json();
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  return Array.isArray(data) ? data : [];
}



// src/lib/api.ts

export async function updateAdminUserProfile(userId: number, payload: any) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update user profile');
  }
  return data;
}


// src/lib/api.ts

export async function fetchAdminProcessings() {
  const res = await fetch(`${API_URL}/admin/processings/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch processing gateways');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function updateAdminProcessing(id: number, payload: any) {
  const res = await fetch(`${API_URL}/admin/processings/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update processing gateway');
  return res.json();
}





// src/lib/api.ts

export async function fetchInvestmentPlans() {
  const res = await fetch(`${API_URL}/investment-plans/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load investment plans');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function saveInvestmentPlan(planData: any) {
  const isEdit = planData.id && typeof planData.id === 'number';
  const method = isEdit ? 'PUT' : 'POST';
  const url = isEdit
    ? `${API_URL}/admin/investment-plans/${planData.id}/` 
    : `${API_URL}/admin/investment-plans/`;

  const payload = {
    name: planData.name,
    min_amount: planData.min_amount,
    max_amount: planData.max_amount,
    profit_percent: planData.profit_percent,
    duration_days: planData.duration_days,
    status: planData.status || 'Active'
  };

  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok) {
    // This logs the exact Django error object to your browser console
    console.error("Django validation error:", data);
    const errorMessage = typeof data === 'object' ? JSON.stringify(data) : (data.error || data.detail || 'Failed to save investment plan');
    throw new Error(errorMessage);
  }
  return data;
}

export async function deleteInvestmentPlan(planId: number) {
  const res = await fetch(`${API_URL}/admin/investment-plans/${planId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete investment plan');
  return res.json();
}

export async function fetchExpiringDeposits() {
  const res = await fetch(`${API_URL}/admin/expiring-deposits/`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load expiring deposits');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}