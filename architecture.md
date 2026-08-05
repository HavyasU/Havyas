## Tech Stack

### Frontend

- React.js (Vite)
- React Router
- HTML5
- CSS3 / Tailwind CSS (or Bootstrap)
- Axios / Firebase SDK

### Backend (BaaS)

- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Firebase Cloud Functions (optional)

### Database

- Firebase Firestore (NoSQL)

### Hosting

- Hostinger Shared Hosting (React static build)

### Version Control

- Git
- GitHub

### CI/CD

- GitHub Actions
  - Build React application
  - Upload `dist/` to Hostinger via SFTP

---

## Architecture (Short)

```
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
(Build React App)
    │
    ▼
Hostinger (Static React Website)
    │
    ▼
Users

React ↔ Firebase Authentication
React ↔ Firestore
React ↔ Storage

Admin Panel
      │
      ▼
Updates Firestore & Storage
      │
      ▼
Users instantly see updated content
```

---

## Deployment Flow

1. Develop in React.
2. Push code to GitHub.
3. GitHub Actions automatically builds the project.
4. Build files (`dist/`) are uploaded to Hostinger.
5. Website is updated automatically.

---

## Content Update Flow

1. Admin logs in.
2. Updates data from the admin panel.
3. Data is stored in Firestore/Storage.
4. Users see the changes immediately.
5. **No redeployment required** for content changes.
