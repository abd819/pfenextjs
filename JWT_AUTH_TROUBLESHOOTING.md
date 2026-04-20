# JWT Authentication Troubleshooting Guide

## Quick Diagnostic Commands

Run these in the browser console (F12) after logging in:

### 1. Check Authentication Status

```javascript
authDebug.checkAuth();
```

Expected output:

```
=== Authentication Status ===
Access Token: ✓ Present
  - Length: 250+ chars
  - Prefix: eyJhbGciOi...
  - First 3 chars: "eye"
Refresh Token: ✓ Present
  - Length: 250+ chars

=== localStorage Contents ===
localStorage["access"]: ✓
localStorage["refresh"]: ✓
localStorage["najda_access"]: ✗
localStorage["najda_refresh"]: ✗
```

**If tokens are missing:**

1. Login again
2. Check console for: `[AUTH] Tokens stored: access=eyJ...`
3. If not present, backend login endpoint is not returning tokens

### 2. Inspect Token Claims

```javascript
authDebug.parseToken(tokenStore.getAccess());
```

Expected output:

```
=== JWT Token Claims ===
{
  "user_id": 1,
  "phone": "+1234567890",
  "exp": 1720000000,  // Expiration timestamp
  "iat": 1715000000   // Issued at timestamp
}
Expires at: 2024-07-03T15:00:00.000Z
Status: ✓ Valid
```

**If token is invalid:**

- **"Invalid JWT format (expected 3 parts..."**: Backend returned garbage
- **"Status: ✗ Expired"**: Token already expired, need to refresh

### 3. Test API Call Manually

```javascript
await authDebug.testApiCall("/api/v1/requests/");
```

Expected output:

```
=== Testing API Call ===
Endpoint: /api/v1/requests/
Full URL: http://127.0.0.1:8000/api/v1/requests/
Authorization: Bearer eyJ...

Status: 200 OK
Headers: { content-type: 'application/json', ... }
Response: [ { id: 1, status: 'pending', ... }, ... ]
✓ Request successful
```

**Common failures:**

| Status | Cause                                 | Fix                                                     |
| ------ | ------------------------------------- | ------------------------------------------------------- |
| 401    | Token not sent or invalid             | Check `[AUTH]` logs, verify token exists                |
| 403    | Token valid but user lacks permission | Check user role/permissions in Django                   |
| 404    | Endpoint doesn't exist                | Verify endpoint path in API docs                        |
| 0      | Network error                         | Check backend is running: `curl http://127.0.0.1:8000/` |

---

## Login Flow Verification

### Step 1: Check Login Endpoint

```bash
# Terminal
curl -X POST http://127.0.0.1:8000/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "password": "yourpassword"}'
```

Expected response:

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**If response is error:**

- Check credentials are correct
- Verify user exists in Django: `python manage.py shell` → `from accounts.models import User; User.objects.all()`

### Step 2: Check Token Storage on Frontend

After login in browser:

```javascript
// In console
localStorage.getItem("access");
localStorage.getItem("refresh");
```

Both should return JWT strings (base64-encoded, 3 parts separated by dots).

**If tokens are missing:**

- Check console for `[AUTH] Tokens stored:`
- If not present, login function didn't receive tokens from backend
- Verify backend returned correct response in Network tab

---

## Common Issues & Solutions

### Issue 1: After Login, Protected Routes Return 401

**Symptoms:**

- Login succeeds
- Redirected to dashboard
- Dashboard shows "Error Loading Data: 401 Session expired"
- Console shows: `[API] Authorization header: Bearer eyJ...`

**Debug steps:**

1. Run `authDebug.checkAuth()` - confirm tokens present
2. Run `authDebug.parseToken(tokenStore.getAccess())` - confirm not expired
3. Run `await authDebug.testApiCall('/api/v1/requests/')` - test endpoint directly

**Possible causes:**

- **Django CORS not configured**: Backend rejects requests from frontend origin
  - **Fix**: Add to Django settings: `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`
- **Token blacklist enabled**: Django marks token as invalid
  - **Check**: `SIMPLE_JWT['BLACKLIST_AFTER_ROTATION']` in Django settings
  - **Fix**: Disable or whitelist frontend IP
- **Wrong user permissions**: User lacks permission for endpoint
  - **Check**: Django admin → Users → Check user permissions
  - **Fix**: Add required permissions to user

### Issue 2: Token Shows But Endpoints Still Return 401

**Symptoms:**

- `authDebug.checkAuth()` shows ✓ tokens present
- `authDebug.parseToken()` shows valid, not expired
- `await authDebug.testApiCall('/api/v1/requests/')` returns 401

**Debug:**
Check Django logs:

```bash
# Terminal, in Django project
python manage.py shell
from rest_framework_simplejwt.tokens import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
```

**Possible causes:**

- **Secret key changed**: Backend regenerated secret after token issued
  - **Fix**: Clear localStorage and login again
- **Token algorithm mismatch**: Frontend using different algorithm than backend
  - **Check**: Django setting `ALGORITHM` in `SIMPLE_JWT`
  - **Fix**: Ensure both use HS256
- **Authorization header format wrong**: Should be exactly `Bearer <token>` (no extra spaces)
  - **Check**: Run `authDebug.testApiCall()` and verify header format
  - **Fix**: Already handled by library, but check backend accepts this format

### Issue 3: 401 on Every Request, Even After Fresh Login

**Symptoms:**

- First request after login: 401
- `[API] 401 Unauthorized on ...`
- `[API] - Token was present: true`

**Debug:**

1. Check if backend is validating token correctly:

```bash
# Terminal
# Extract token from browser console, paste here:
DJANGO_SETTINGS_MODULE=config.settings django-admin shell
```

2. Check middleware order in Django:

```python
# Django settings.py
MIDDLEWARE = [
    # ...
    'rest_framework.middleware.ForceAuthenticationMiddleware',  # ← should be here
]
```

**Possible causes:**

- **JWT library not installed**: `pip install djangorestframework-simplejwt`
- **Authentication not configured**: Missing `DEFAULT_AUTHENTICATION_CLASSES` in REST_FRAMEWORK settings
- **Token validation disabled**: Verify `JWT_VERIFY` = True

---

## Token Refresh Flow

When a 401 occurs, the system automatically:

1. Attempts to refresh token using refresh_token
2. If successful, retries original request
3. If failed, clears tokens and redirects to login

**Monitor in console:**

```
[API] 401 Unauthorized on http://...
[API] Attempting token refresh...
[API] Token refreshed successfully, retrying ...
[API] Success 200 from http://...
```

If you see refresh failure:

```
[API] Token refresh failed, session expired
```

**Fix:** Login again to get fresh tokens

---

## Django Backend Checklist

Ensure your Django backend has:

### 1. CORS Enabled

```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### 2. JWT Configured

```python
# settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ALGORITHM': 'HS256',
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### 3. Login Endpoint Returns Tokens

```python
# accounts/views.py
from rest_framework_simplejwt.views import TokenObtainPairView

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    # Should return { "access": "...", "refresh": "..." }
```

### 4. Protected Views Require Auth

```python
from rest_framework.permissions import IsAuthenticated

class RequestListView(APIView):
    permission_classes = [IsAuthenticated]  # ← Forces JWT auth

    def get(self, request):
        return Response(...)
```

---

## Network Debugging

Use Browser DevTools Network tab:

### Expected successful request:

- **URL**: `http://127.0.0.1:8000/api/v1/requests/`
- **Method**: GET
- **Headers**: Authorization: `Bearer eyJ...`
- **Status**: 200 ✓
- **Response**: JSON array of requests

### Expected failed request (401):

- **Status**: 401
- **Response Body**:
  ```json
  {
    "detail": "Invalid token"
    // OR
    "detail": "Given token not valid for any token type"
    // OR
    "detail": "Token is blacklisted"
  }
  ```

**Copy Authorization header from request and test:**

```bash
curl -H "Authorization: Bearer <paste_token_here>" \
  http://127.0.0.1:8000/api/v1/requests/
```

If this returns 200, issue is in frontend. If 401, issue is in backend.

---

## Next Steps

1. **Run `authDebug.checkAuth()`** - baseline check
2. **If tokens missing** - login doesn't work, fix backend login endpoint
3. **If tokens present** - run `authDebug.testApiCall('/api/v1/requests/')` - test specific endpoint
4. **If test still fails** - check Django logs and CORS settings
5. **If test succeeds but dashboard fails** - check component mounting order (don't call API before token loads)

Questions? Check browser console for `[API]` and `[AUTH]` prefixed logs.
