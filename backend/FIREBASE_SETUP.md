# Firebase Admin Setup Instructions

## You need to set up Firebase Admin SDK credentials:

### Option 1: Service Account Key (Recommended for Production)

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Save it in `backend/config/serviceAccountKey.json`
7. Add to `.gitignore`: `config/serviceAccountKey.json`
8. Update `middleware/authMiddleware.js` line 10-12 to use:
   ```javascript
   admin.initializeApp({
     credential: admin.credential.cert(require('../config/serviceAccountKey.json'))
   });
   ```

### Option 2: Environment Variables (Current Setup)

Currently using `applicationDefault()` which works if you have Google Cloud SDK installed.

---

## How to Use from Frontend:

```javascript
// 1. Get Firebase ID token after user logs in
const user = auth.currentUser;
const idToken = await user.getIdToken();

// 2. Send token in Authorization header
fetch('http://localhost:5000/api/wallet', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
})

// 3. No need to pass userId manually anymore!
// It's automatically extracted from the token
```

---

## Changes Made:

✓ Installed firebase-admin
✓ Created auth middleware that verifies Firebase tokens
✓ Updated all wallet & transaction routes to use middleware
✓ Controllers now get userId from `req.user.uid` (from token)
✓ No need to manually pass userId in requests anymore

## Routes Now Protected:

- `GET /api/wallet` (requires Firebase token)
- `POST /api/wallet/add` (requires Firebase token)
- `POST /api/wallet/spend` (requires Firebase token)
- `GET /api/transactions` (requires Firebase token)
- `POST /api/transactions` (requires Firebase token)
