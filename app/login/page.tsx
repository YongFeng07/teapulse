import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4B483] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
