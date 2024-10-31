// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "@/components/ThemeContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RootLayout() {
  console.log("API_URL:", API_URL);
  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
