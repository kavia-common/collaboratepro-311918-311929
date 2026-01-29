import { apiRequest } from './client';

// PUBLIC_INTERFACE
export async function listOrganizations(token) {
  /** List organizations visible to the user. */
  return apiRequest('/api/organizations', { token });
}

// PUBLIC_INTERFACE
export async function createOrganization(token, { name }) {
  /** Create an organization. */
  return apiRequest('/api/organizations', { method: 'POST', token, body: { name } });
}

// PUBLIC_INTERFACE
export async function listProjectsForOrg(token, orgId) {
  /** List projects within an organization. */
  return apiRequest(`/api/organizations/${encodeURIComponent(orgId)}/projects`, { token });
}

// PUBLIC_INTERFACE
export async function createProjectForOrg(token, orgId, { name, description }) {
  /** Create a project within an organization. */
  return apiRequest(`/api/organizations/${encodeURIComponent(orgId)}/projects`, {
    method: 'POST',
    token,
    body: { name, description },
  });
}

// PUBLIC_INTERFACE
export async function listTasksForProject(token, projectId) {
  /** List tasks within a project. */
  return apiRequest(`/api/projects/${encodeURIComponent(projectId)}/tasks`, { token });
}

// PUBLIC_INTERFACE
export async function createTaskForProject(token, projectId, { title, description, status, assigneeId }) {
  /** Create task within a project. */
  return apiRequest(`/api/projects/${encodeURIComponent(projectId)}/tasks`, {
    method: 'POST',
    token,
    body: { title, description, status, assigneeId },
  });
}

// PUBLIC_INTERFACE
export async function listActivityLogs(token) {
  /** List recent activity logs. */
  return apiRequest('/api/activity-logs', { token });
}
