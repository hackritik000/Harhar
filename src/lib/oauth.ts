import { Google } from "arctic";

// Initialize Google OAuth provider
export const google = new Google(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:4321/login/google/callback" // Replace with your actual callback URL
);
