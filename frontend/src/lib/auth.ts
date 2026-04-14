'use client';

export function normalizeRole(role: string | null | undefined): string {
  return role?.trim().toLowerCase() ?? '';
}

export function hasRole(role: string | null | undefined, expectedRole: string): boolean {
  return normalizeRole(role) === normalizeRole(expectedRole);
}
