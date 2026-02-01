/**
 * ============================================
 * MVP MODE - DATABASE STUBBED
 * ============================================
 * This file has been stubbed for MVP deployment.
 * All database operations are no-ops.
 * Guest mode only - no authentication required.
 */

// ============================================
// TYPES (kept for compatibility)
// ============================================

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  phone: string | null;
  dateOfBirth: Date | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  preferences: Record<string, unknown> | null;
  failedLoginCount: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
}

export interface LoginInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================
// STUBBED FUNCTIONS
// ============================================

export async function hashPassword(_password: string): Promise<string> {
  console.log("[MVP] hashPassword called - stubbed");
  return "stubbed-hash";
}

export async function verifyPassword(
  _password: string,
  _hash: string
): Promise<boolean> {
  console.log("[MVP] verifyPassword called - stubbed");
  return false;
}

export function generateAccessToken(_user: UserPayload): string {
  console.log("[MVP] generateAccessToken called - stubbed");
  return "stubbed-access-token";
}

export function verifyAccessToken(_token: string): UserPayload | null {
  console.log("[MVP] verifyAccessToken called - stubbed");
  // Return a guest user for MVP mode
  return {
    id: "guest",
    email: "guest@curasense.local",
    role: "PATIENT",
    firstName: "Guest",
    lastName: "User",
  };
}

export function generateRefreshToken(): string {
  console.log("[MVP] generateRefreshToken called - stubbed");
  return "stubbed-refresh-token";
}

export async function createUser(_input: RegisterInput): Promise<User> {
  console.log("[MVP] createUser called - stubbed");
  throw new Error("MVP mode: Registration disabled");
}

export async function authenticateUser(
  _input: LoginInput
): Promise<{ user: User; tokens: AuthTokens }> {
  console.log("[MVP] authenticateUser called - stubbed");
  throw new Error("MVP mode: Authentication disabled");
}

export async function refreshAccessToken(
  _refreshToken: string
): Promise<AuthTokens | null> {
  console.log("[MVP] refreshAccessToken called - stubbed");
  return null;
}

export async function logoutUser(_refreshToken: string): Promise<void> {
  console.log("[MVP] logoutUser called - stubbed");
}

export async function logoutAllSessions(_userId: string): Promise<void> {
  console.log("[MVP] logoutAllSessions called - stubbed");
}

export async function getUserById(_id: string): Promise<User | null> {
  console.log("[MVP] getUserById called - stubbed");
  return null;
}

export async function updateUserProfile(
  _userId: string,
  _data: Partial<{
    firstName: string;
    lastName: string;
    displayName: string;
    phone: string;
    avatarUrl: string;
    preferences: Record<string, unknown>;
  }>
): Promise<User> {
  console.log("[MVP] updateUserProfile called - stubbed");
  throw new Error("MVP mode: Profile updates disabled");
}

export async function createPasswordResetToken(_email: string): Promise<{ token: string; user: User } | null> {
  console.log("[MVP] createPasswordResetToken called - stubbed");
  return null;
}

export async function verifyPasswordResetToken(_token: string): Promise<string | null> {
  console.log("[MVP] verifyPasswordResetToken called - stubbed");
  return null;
}

export async function resetPassword(_token: string, _newPassword: string): Promise<boolean> {
  console.log("[MVP] resetPassword called - stubbed");
  return false;
}

export async function changePassword(
  _userId: string,
  _currentPassword: string,
  _newPassword: string
): Promise<boolean> {
  console.log("[MVP] changePassword called - stubbed");
  return false;
}
