import api from './api';

// ============================================================
// Auth Service - register and login
// ============================================================
export const authService = {
  /**
   * Register a new user.
   * @param {Object} data - { name, email, password, role }
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Login with email and password.
   * @param {Object} data - { email, password }
   */
  login: (data) => api.post('/auth/login', data),
};

// ============================================================
// Internship Service - CRUD for internships
// ============================================================
export const internshipService = {
  /** Get all internships (public) */
  getAll: () => api.get('/internships'),

  /** Get one internship by ID */
  getById: (id) => api.get(`/internships/${id}`),

  /** Create new internship (COMPANY only) */
  create: (data) => api.post('/internships', data),

  /** Update internship (COMPANY only) */
  update: (id, data) => api.put(`/internships/${id}`, data),

  /** Delete internship (ADMIN only) */
  delete: (id) => api.delete(`/internships/${id}`),

  /** Get company's own internship postings */
  getMyPostings: () => api.get('/internships/my-postings'),
};

// ============================================================
// Application Service - apply and manage applications
// ============================================================
export const applicationService = {
  /** Apply to an internship (STUDENT only) */
  apply: (data) => api.post('/applications', data),

  /** Get applications based on role */
  getAll: () => api.get('/applications'),

  /** Get student's own applications */
  getMyApplications: () => api.get('/applications/my-applications'),

  /** Update application status (COMPANY/ADMIN) */
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};
