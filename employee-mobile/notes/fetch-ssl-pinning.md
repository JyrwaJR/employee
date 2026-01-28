# 📄 Public Key Pinning Guide (React Native + Expo + Custom/Vercel Backend)

## Overview

Public key pinning protects your mobile app from:

- Man-in-the-middle (MITM) attacks
- Fake certificates
- Compromised WiFi / proxies
- Malicious root CAs
- SSL stripping

Even if an attacker installs a valid certificate, your app will **reject the connection** unless the server presents the exact pinned public key.

This is **stronger than HTTPS alone**.

---

# Why Public Key Pinning (not cert pinning)

## ❌ Certificate pinning (bad)

Pins:

```
api_cert.cer
```

Breaks when:

- cert renews
- Let's Encrypt rotates (90 days)
- provider changes

Result:

- app instantly loses network
- OTA cannot fix
- requires app store update

---

## ✅ Public key pinning (correct)

Pins:

```
server public key hash (SPKI)
```

Stable because:

- cert can change
- expiry can change
- issuer can change
- BUT public key stays same

Result:

- cert renewals safe
- no app updates needed
- production stable

---

# Architecture

```
Mobile App (React Native)
    ↓ HTTPS + Public Key Pinning
api.yourdomain.com
    ↓
Your backend (Vercel / Nginx / Node / etc)
```

Pinning runs:

- iOS → native NSURLSession
- Android → native OkHttp

Not JavaScript.

---

# Implementation Steps

---

## Step 1 — Generate or reuse stable private key (server)

Do this once.

### Generate

```bash
openssl genrsa -out private.key 2048
```

### Create CSR

```bash
openssl req -new -key private.key -out csr.pem
```

### Important

When renewing with certbot:

```bash
certbot renew --reuse-key
```

This guarantees:

```
public key never changes
```

---

---

## Step 2 — Extract public key hash

Run:

```bash
openssl s_client -connect api.yourdomain.com:443 -showcerts
```

Save cert → `cert.pem`

Then:

```bash
openssl x509 -pubkey -noout -in cert.pem > pubkey.pem
openssl pkey -pubin -outform der -in pubkey.pem | openssl dgst -sha256 -binary | base64
```

Output example:

```
AbCDefGhIjKlMnOpQrStUvWxYz123456789=
```

This is your **pin value**.

---

---

## Step 3 — Add to React Native

### Install

```bash
npx expo install react-native-ssl-pinning
```

(EAS build required)

---

## Create wrapper

### 📁 src/network/sslFetch.ts

```ts
import { Platform } from 'react-native';
import { fetch as pinningFetch } from 'react-native-ssl-pinning';

const isNative = Platform.OS !== 'web';
const isDev = __DEV__;

export async function sslFetch(url: string, options: any) {
  // Web or dev → normal fetch
  if (!isNative || isDev) {
    const res = await fetch(url, options);
    const text = await res.text();

    return {
      status: res.status,
      body: text,
      headers: {},
    };
  }

  // Native production → pin public key
  const res = await pinningFetch(url, {
    ...options,
    sslPinning: {
      pubKeys: ['AbCDefGhIjKlMnOpQrStUvWxYz123456789='],
    },
  });

  return res as unknown as {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
}
```

---

---

# Environment Behavior

| Environment       | Pinning               |
| ----------------- | --------------------- |
| Dev (localhost)   | ❌ disabled           |
| Web (Vercel)      | ❌ browser HTTPS only |
| Mobile production | ✅ enabled            |

---

---

# Key Rotation Strategy (best practice)

Add **backup keys**:

```ts
sslPinning: {
  pubKeys: [
    'current_key_hash',
    'next_key_hash',
  ],
}
```

This allows:

- smooth key rotation
- zero downtime
- safe migration

---

---

# Should the public key be in .env?

## ❌ No

Do NOT store pin in env.

Reasons:

### 1. It’s not secret

Public key ≠ private key
Nothing sensitive.

### 2. Env changes require rebuild anyway

Mobile env variables are compiled into bundle.

Changing:

```
EXPO_PUBLIC_PIN=...
```

still requires new build.

No benefit.

### 3. Security model

Pinning should be:

```
static + immutable
```

not dynamic config.

### 4. Prevent accidental runtime changes

Pin must not change dynamically.

---

---

# ✅ Correct place

Hardcode it.

Example:

```ts
const PINNED_KEYS = ['AbCDefGhIjKlMnOpQrStUvWxYz123456789='];
```

Inside:

```
src/network/sslFetch.ts
```

This is industry standard.

---

---

# When would you update the app?

Only if:

- you regenerate private key
- you rotate keys intentionally
- you change domain

Rare events.

Otherwise:

```
years without updates
```

---

---

# Testing Pinning

## Test success

App connects normally.

## Test failure

Change one character in hash:

```
XXXXXfGhIjKlMnOpQrStUvWxYz123456789=
```

App should fail all requests.

If not → pinning not working.

---

---

# Best Practices Checklist

✅ HTTPS only
✅ SecureStore for tokens
✅ Short-lived JWT
✅ Public key pinning
✅ Disable pinning on dev/web
✅ Reuse private key on renew
✅ Add backup keys

Avoid:

❌ cert file pinning
❌ env-based pins
❌ localhost pinning
❌ secrets inside app

---

---

# Final Recommendation

For your stack (Expo mobile + Vercel/self-hosted backend):

Use:

- HTTPS
- Public key pinning
- Hardcoded hash
- Dev bypass

This gives you:

👉 Banking-grade mobile transport security
👉 Zero maintenance
👉 No OTA issues
👉 No cert renewal problems

---
