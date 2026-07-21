# Employee Leave Management System - React Frontend

This React frontend connects to the ASP.NET Core Web API backend for the Employee Leave Management System.

## Backend API used

Default API base URL:

```text
https://localhost:7128/api
```

If your backend uses another port, create a `.env` file and set:

```text
VITE_API_BASE_URL=https://localhost:7128/api
```

## Install and run

```bash
npm install
npm run dev
```

## Main pages

- Login
- Dashboard
- Users
- Departments
- Employees
- Leave Types
- Leave Requests
- Change Password

## Test login accounts

Use the accounts created in the backend SQL seed script:

```text
admin / admin123
manager / manager123
employee / employee123
```

## Notes

- This project uses React Context API for login state.
- Logged-in user data is saved in localStorage because the backend project does not use JWT or Session.
- API calls are handled with the Fetch API in `src/services/api.js`.
- UI uses Tailwind CSS with brand color `#2563EB`.
