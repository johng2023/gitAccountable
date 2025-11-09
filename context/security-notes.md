# GitAccountable Security Review & Recommendations

Comprehensive security analysis with actionable remediation steps.

---

## Critical Issues (Fix IMMEDIATELY)

### 1. GitHub OAuth Credentials Exposed 🔴 CRITICAL

**Issue:** GitHub Client ID and Secret visible in repository and .env files

**Severity:** CRITICAL - Attackers can:
- Impersonate your application
- Steal user authentication codes
- Access user GitHub data
- Perform OAuth attacks on users

**Current Status:**
- Client ID: `Ov23liE9xCr5zXlkPhkl`
- Secret: `b4de86cdf536ed9d4c2fbd3ad22c852a44176a3e`
- Location: `.env` file in repository

**Remediation Steps:**

1. **Immediately disable existing OAuth app:**
   ```
   Go to: https://github.com/settings/developers
   Find: GitAccountable OAuth App
   Click: Delete Application
   Confirm deletion
   ```

2. **Create new OAuth app:**
   ```
   https://github.com/settings/developers
   Click: New OAuth App
   Fill form:
   - Application name: GitAccountable
   - Homepage URL: http://localhost:5173
   - Authorization callback URL: http://localhost:5173/callback

   Copy new Client ID and Secret
   ```

3. **Update .env:**
   ```bash
   # Backend/.env
   GITHUB_CLIENT_ID=<new_client_id>
   GITHUB_CLIENT_SECRET=<new_client_secret>
   ```

4. **Update Frontend:**
   ```bash
   # Frontend/React/.env.local
   VITE_GITHUB_CLIENT_ID=<new_client_id>
   ```

5. **Restart servers:**
   ```bash
   # Restart backend
   npm run dev
   ```

6. **Never commit secrets again:**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.*.local

   # Remove from git history
   git rm --cached .env
   git commit -m "remove: .env file with credentials"
   ```

**Verification:**
- Old credentials no longer work
- New app handles OAuth requests
- Users can still login with new credentials

---

### 2. JWT Secret is Placeholder 🔴 CRITICAL

**Issue:** Default JWT secret visible in .env

```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

**Risk:**
- Attacker can forge JWT tokens
- Attacker can impersonate any user
- Session hijacking possible
- User authentication can be bypassed

**Remediation:**

1. **Generate cryptographically secure secret:**
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Example output:
   # 3f4a8b2c9d7e1f5a6c2b8d9e1a3f5c7b9d2e4a6f8c1b3d5e7a9f2c4d6e8a0

   # Using OpenSSL
   openssl rand -hex 32
   ```

2. **Update .env:**
   ```bash
   JWT_SECRET=3f4a8b2c9d7e1f5a6c2b8d9e1a3f5c7b9d2e4a6f8c1b3d5e7a9f2c4d6e8a0
   ```

3. **Restart backend:**
   ```bash
   npm run dev
   ```

4. **Invalidate old tokens:**
   ```bash
   # All existing JWT tokens become invalid
   # Users must login again
   # Clear localStorage: localStorage.clear()
   ```

**Verification:**
- Old JWT tokens no longer work
- New logins generate new tokens
- Token signing uses new secret

---

### 3. Database Password in Version Control 🔴 CRITICAL

**Issue:** PostgreSQL password visible in .env

```
DB_PASSWORD=Theguck20
```

**Risk:**
- Attacker can access database directly
- Data breach: user info, commitments, OAuth tokens
- Data manipulation
- Service disruption

**Remediation:**

1. **Change PostgreSQL password:**
   ```bash
   psql -U postgres

   ALTER USER postgres WITH PASSWORD 'new_secure_password_here';
   \q
   ```

2. **Generate secure password:**
   ```bash
   # Using pwgen
   pwgen -s 32 1

   # Using openssl
   openssl rand -base64 32
   ```

3. **Update .env:**
   ```bash
   DB_PASSWORD=your_new_secure_password_here
   ```

4. **For production, use environment-specific config:**
   ```bash
   # Development: .env (gitignored)
   # Production: Environment variables from:
   # - AWS Secrets Manager
   # - HashiCorp Vault
   # - Google Cloud Secret Manager
   # - Azure Key Vault
   ```

5. **Restart backend:**
   ```bash
   npm run dev
   ```

**Verification:**
- Can connect with new password
- Old password no longer works
- Database credentials never committed

---

## High Priority Issues (Fix This Week)

### 4. No GitHub Personal Access Token 🟠 HIGH

**Issue:** Using unauthenticated GitHub API calls (60 req/hour limit)

**Impact:**
- Low rate limits affect oracle verification
- Chainlink oracle could be rate-limited
- Verification failures during peak usage

**Remediation:**

1. **Create GitHub personal access token:**
   ```
   https://github.com/settings/tokens
   Click: Generate new token
   Scope: public_repo (read-only access)
   Name: GitAccountable-Oracle
   ```

2. **Copy token and add to .env:**
   ```bash
   # Backend/.env
   GITHUB_PERSONAL_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Use token in API calls:**
   ```javascript
   // Backend/routes/auth.js or chainlink/checkGithubCommit.js
   const headers = {
     'Authorization': `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
     'Accept': 'application/vnd.github.v3+json',
     'User-Agent': 'GitAccountable'
   };

   const response = await fetch('https://api.github.com/...', { headers });
   ```

4. **Restart backend:**
   ```bash
   npm run dev
   ```

**Verification:**
- API calls now authenticated
- Rate limit: 5,000 requests/hour (instead of 60)
- No more rate limit errors

---

### 5. No Rate Limiting on Backend 🟠 HIGH

**Issue:** Backend endpoints unprotected against brute force and DoS

**Risk:**
- Brute force login attempts
- OAuth code reuse attacks
- Resource exhaustion
- Service disruption

**Remediation:**

1. **Install rate limiting package:**
   ```bash
   npm install express-rate-limit
   ```

2. **Add to Backend/server.js:**
   ```javascript
   const rateLimit = require('express-rate-limit');

   // Limit OAuth attempts: 5 requests per 15 minutes
   const oauthLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5,
     message: 'Too many OAuth attempts, please try again later',
     standardHeaders: true,
     legacyHeaders: false,
   });

   // Limit wallet updates: 10 requests per hour
   const walletLimiter = rateLimit({
     windowMs: 60 * 60 * 1000,
     max: 10,
     message: 'Too many wallet updates, please try again later',
   });

   // Apply limiters
   app.post('/api/auth/github', oauthLimiter, authRoutes);
   app.post('/api/auth/wallet', walletLimiter, authRoutes);
   ```

3. **Test rate limiting:**
   ```bash
   # Trigger more than 5 requests
   for i in {1..10}; do
     curl -X POST http://localhost:3001/api/auth/github \
       -H "Content-Type: application/json" \
       -d '{"code":"test"}'
   done

   # Should see: 429 Too Many Requests after 5th request
   ```

---

### 6. No Input Validation 🟠 HIGH

**Issue:** Missing comprehensive input validation

**Risk:**
- SQL injection (partially mitigated by parameterized queries)
- Invalid data stored
- Logic errors from malformed input

**Remediation:**

1. **Install validation package:**
   ```bash
   npm install joi
   ```

2. **Add validation schemas:**
   ```javascript
   // Backend/middleware/validation.js
   const Joi = require('joi');

   export const walletAddressSchema = Joi.object({
     walletAddress: Joi.string()
       .pattern(/^0x[a-fA-F0-9]{40}$/)
       .required(),
   });

   export const commitmentSchema = Joi.object({
     githubUsername: Joi.string()
       .alphanum()
       .min(1)
       .max(39)
       .required(),
     walletAddress: Joi.string()
       .pattern(/^0x[a-fA-F0-9]{40}$/)
       .required(),
     stakeAmount: Joi.number()
       .positive()
       .required(),
     stakingPeriod: Joi.number()
       .integer()
       .min(1)
       .max(365)
       .required(),
   });
   ```

3. **Use in routes:**
   ```javascript
   router.post('/wallet', async (req, res) => {
     const { error, value } = walletAddressSchema.validate(req.body);
     if (error) {
       return res.status(400).json({ success: false, error: error.details[0].message });
     }
     // ... rest of handler
   });
   ```

---

## Medium Priority Issues (Fix This Month)

### 7. No HTTPS in Development 🟡 MEDIUM

**Issue:** OAuth tokens sent over HTTP

**Impact:**
- Network sniffing possible on insecure networks
- Man-in-the-middle attacks
- Token theft on WiFi

**Development Workaround:**
- Use localhost (loopback, secure by default)
- Only test on secure networks
- Never use on public WiFi

**Production Must-Have:**
```bash
# Update GITHUB_REDIRECT_URI to HTTPS
GITHUB_REDIRECT_URI=https://yourdomain.com/callback

# Enable HTTPS on server
# Use Let's Encrypt or similar
# Update all URLs to https://
```

---

### 8. localStorage Not Secure for Sensitive Data 🟡 MEDIUM

**Issue:** JWT token stored in localStorage

**Risk:**
- XSS attacks can steal token
- CSRF attacks can use token
- Token visible in browser console

**Improvement:**
```javascript
// Use httpOnly cookies instead (more secure)
// Currently: localStorage (development OK, risky for production)

// For production:
// Set JWT in httpOnly cookie (http-only, secure, sameSite)
// Frontend cannot access cookie (protected from XSS)
// Cookie automatically sent with requests (protected from CSRF)
```

**Mitigation:**
```javascript
// Add SameSite protection
// Update CORS policy
// Implement CSRF token validation
```

---

### 9. No Encryption for Sensitive Fields 🟡 MEDIUM

**Issue:** OAuth tokens stored plaintext in database

**Current:**
```sql
SELECT github_oauth_token FROM users WHERE id = 1;
-- Result: gho_16C7e42F292c6912E7710c838347Ae178B4a
```

**Risk:**
- Database breach = token theft
- Attacker can access user's GitHub data
- Impersonate user on GitHub

**Remediation:**

1. **Install encryption package:**
   ```bash
   npm install crypto
   ```

2. **Add encryption utility:**
   ```javascript
   // Backend/utils/encryption.js
   const crypto = require('crypto');

   const algorithm = 'aes-256-gcm';
   const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

   function encrypt(text) {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(algorithm, key, iv);
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     const authTag = cipher.getAuthTag();
     return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
   }

   function decrypt(text) {
     const parts = text.split(':');
     const iv = Buffer.from(parts[0], 'hex');
     const authTag = Buffer.from(parts[1], 'hex');
     const encrypted = parts[2];
     const decipher = crypto.createDecipheriv(algorithm, key, iv);
     decipher.setAuthTag(authTag);
     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
     decrypted += decipher.final('utf8');
     return decrypted;
   }
   ```

3. **Use in database:
   ```javascript
   // When saving
   const encryptedToken = encrypt(tokenFromGitHub);

   // When using
   const decryptedToken = decrypt(rowFromDatabase.github_oauth_token);
   ```

---

## Best Practices (Start Now)

### 10. Environment-Specific Configuration

**Current:** Single .env file

**Better:**
```
.env.example         # Template (safe to commit)
.env.development     # Local development (never commit)
.env.production      # Production (external secret management)
.env.test           # Testing (isolated database)
```

### 11. Secret Management

**Development:**
- .env files (gitignored)
- Local values only

**Production:**
- AWS Secrets Manager
- HashiCorp Vault
- Google Cloud Secret Manager
- Azure Key Vault
- GitHub Actions Secrets

### 12. Logging & Monitoring

**Add:**
```javascript
// Log authentication attempts (not tokens)
console.log(`[Auth] User ${username} login attempt`);

// Log failed attempts
console.warn(`[Security] Failed OAuth for code ${codePrefix}...`);

// Monitor rate limits
console.info(`[GitHub] Rate limit: ${remaining}/${limit}`);

// Never log sensitive data
// ❌ Don't: console.log(authToken)
// ✅ Do: console.log(authToken.substring(0, 10) + '...')
```

### 13. Audit Trail

```sql
-- Track user actions
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT,
  action VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Log important events
INSERT INTO audit_log (user_id, action, ip_address, user_agent)
VALUES (1, 'github_login', '192.168.1.1', 'Mozilla/5.0...');
```

### 14. Dependency Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies safely
npm update

# Regularly: at least monthly
npm audit --audit-level=moderate
```

### 15. Code Review Checklist

Before committing:
- [ ] No secrets in code
- [ ] No console.log() with sensitive data
- [ ] Proper input validation
- [ ] SQL injection protected (parameterized queries)
- [ ] CSRF token present
- [ ] No hardcoded URLs (use environment variables)
- [ ] Error messages don't leak information
- [ ] Dependencies are up-to-date

---

## Testing Security

### Test 1: Check Exposed Secrets

```bash
# Search for credentials in code
grep -r "password\|token\|secret" Backend/ --include="*.js" | grep -v node_modules

# Search in git history
git log -p | grep -i "password\|secret"
```

### Test 2: Validate Inputs

```bash
# Test with malicious input
curl -X POST http://localhost:3001/api/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc54e4f95f49d1; DROP TABLE users;"
  }'

# Should reject invalid format
```

### Test 3: Test Rate Limiting

```bash
# Make rapid requests
for i in {1..20}; do
  curl -X POST http://localhost:3001/api/auth/github \
    -H "Content-Type: application/json" \
    -d '{"code":"test"}' &
done

# Should see 429 errors
```

### Test 4: Check XSS Prevention

```javascript
// Test with script payload
const input = '<img src=x onerror="alert(1)">';
// Should be escaped/sanitized in output
```

---

## Compliance & Privacy

### GDPR (if EU users)
- [ ] Privacy policy published
- [ ] Explicit consent for data collection
- [ ] Right to data deletion implemented
- [ ] Data breach notification process

### CCPA (if California users)
- [ ] Privacy policy includes CCPA rights
- [ ] Data sale opt-out option
- [ ] Consumer rights requests process

### Data Retention
```javascript
// Delete old data
DELETE FROM commitments WHERE created_at < NOW() - INTERVAL '1 year';

// Archive sensitive data
SELECT * FROM users WHERE last_login < NOW() - INTERVAL '6 months';
```

---

## Security Incident Response

**If Breach Detected:**

1. **Immediate (< 1 hour):**
   - Rotate all credentials
   - Check access logs for unauthorized activity
   - Take affected systems offline if needed

2. **Short-term (< 24 hours):**
   - Notify users of data exposure
   - Explain what data was compromised
   - Provide remediation steps

3. **Medium-term (< 1 week):**
   - Conduct security audit
   - Implement fixes
   - Deploy security patches

4. **Long-term (ongoing):**
   - Enhanced monitoring
   - Regular security audits
   - Penetration testing
   - Security training

---

## Security Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Node.js Security:** https://nodejs.org/en/docs/guides/security/
- **Express Security:** https://expressjs.com/en/advanced/best-practice-security.html
- **PostgreSQL Security:** https://www.postgresql.org/docs/current/sql-syntax.html
- **GitHub Security:** https://docs.github.com/en/code-security

---

## Checklist: Complete by End of Week

- [ ] Rotate GitHub OAuth credentials
- [ ] Change JWT secret
- [ ] Change PostgreSQL password
- [ ] Add .env to .gitignore
- [ ] Remove secrets from git history
- [ ] Add GitHub personal access token
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Test security fixes
- [ ] Document changes

---

**Last Updated:** January 2024
**Risk Level:** 🔴 CRITICAL (3 issues), 🟠 HIGH (2 issues), 🟡 MEDIUM (4 issues)
**Action Required:** Implement critical fixes immediately before production use
