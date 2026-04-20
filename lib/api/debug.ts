/**
 * JWT Authentication Debug Helper
 * Run this in browser console to diagnose authentication issues
 */

import { tokenStore } from "./client";

export const authDebug = {
  /**
   * Check current authentication state
   */
  checkAuth(): void {
    const access = tokenStore.getAccess();
    const refresh = tokenStore.getRefresh();

    console.log("=== Authentication Status ===");
    console.log(`Access Token: ${access ? "✓ Present" : "✗ Missing"}`);
    if (access) {
      console.log(`  - Length: ${access.length} chars`);
      console.log(`  - Prefix: ${access.substring(0, 50)}...`);
      console.log(`  - First 3 chars: "${access.substring(0, 3)}"`);
    }
    console.log(`Refresh Token: ${refresh ? "✓ Present" : "✗ Missing"}`);
    if (refresh) {
      console.log(`  - Length: ${refresh.length} chars`);
    }

    // Check localStorage directly
    console.log("=== localStorage Contents ===");
    console.log(
      `localStorage["access"]: ${localStorage.getItem("access") ? "✓" : "✗"}`,
    );
    console.log(
      `localStorage["refresh"]: ${localStorage.getItem("refresh") ? "✓" : "✗"}`,
    );
    console.log(
      `localStorage["najda_access"]: ${localStorage.getItem("najda_access") ? "✓" : "✗"}`,
    );
    console.log(
      `localStorage["najda_refresh"]: ${localStorage.getItem("najda_refresh") ? "✓" : "✗"}`,
    );
  },

  /**
   * Parse JWT token claims (without verification)
   */
  parseToken(token: string | null): void {
    if (!token) {
      console.warn("No token provided");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error(
          "Invalid JWT format (expected 3 parts separated by dots)",
        );
        return;
      }

      // Decode payload (second part)
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf-8"),
      );

      console.log("=== JWT Token Claims ===");
      console.log(JSON.stringify(payload, null, 2));

      // Check expiration
      if (payload.exp) {
        const expiresAt = new Date(payload.exp * 1000);
        const now = new Date();
        console.log(`Expires at: ${expiresAt.toISOString()}`);
        console.log(`Status: ${expiresAt > now ? "✓ Valid" : "✗ Expired"}`);
      }
    } catch (e) {
      console.error("Failed to parse token:", e);
    }
  },

  /**
   * Test a single API call
   */
  async testApiCall(endpoint: string): Promise<void> {
    const access = tokenStore.getAccess();
    if (!access) {
      console.error("No access token available");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${baseUrl}${endpoint}`;

    console.log(`\n=== Testing API Call ===`);
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Full URL: ${url}`);
    console.log(`Authorization: Bearer ${access.substring(0, 20)}...`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Headers:`, Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log(`Response:`, data);

      if (!response.ok) {
        console.error("❌ Request failed");
      } else {
        console.log("✓ Request successful");
      }
    } catch (e) {
      console.error("Request error:", e);
    }
  },

  /**
   * Print usage instructions
   */
  printHelp(): void {
    console.log(`
=== JWT Authentication Debug Tools ===

Run these commands in browser console:

1. Check authentication status:
   authDebug.checkAuth()

2. Parse JWT token:
   authDebug.parseToken(tokenStore.getAccess())

3. Test API call:
   await authDebug.testApiCall('/api/v1/requests/')

4. Clear all tokens:
   tokenStore.clear()
    `);
  },
};

// Make it available globally in browser console
if (typeof window !== "undefined") {
  (window as any).authDebug = authDebug;
  console.log(
    "[AUTH] Debug tools loaded. Run authDebug.printHelp() for usage.",
  );
}
