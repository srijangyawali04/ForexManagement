import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp && decodedToken.exp > currentTime; // Check expiration
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
