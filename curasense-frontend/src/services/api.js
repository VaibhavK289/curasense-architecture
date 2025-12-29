// api.js
// API service functions here
import { auth } from '../lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to get auth token
async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  return await user.getIdToken();
}

// Generic API call helper
async function apiCall(endpoint, options = {}) {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API call failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Upload report
export async function uploadReport(file, reportType = 'prescription') {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/api/reports/upload?report_type=${reportType}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
}

// Get user's reports
export async function getUserReports(limit = 20) {
  return await apiCall(`/api/reports/my-reports?limit=${limit}`);
}

// Get specific report
export async function getReportDetail(reportId) {
  return await apiCall(`/api/reports/reports/${reportId}`);
}

// Delete report
export async function deleteReport(reportId) {
  return await apiCall(`/api/reports/reports/${reportId}`, {
    method: 'DELETE',
  });
}

// Compare medications
export async function compareMedications(drug1, drug2) {
  return await apiCall('/api/medications/compare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ drug1, drug2 }),
  });
}

// Get user profile
export async function getUserProfile() {
  return await apiCall('/api/user/profile');
}

// Update user profile
export async function updateUserProfile(data) {
  return await apiCall('/api/user/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}