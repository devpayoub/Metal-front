import { Suspense } from "react";
import { AuthPage } from "@/pages-content/AuthPage";

export const metadata = {
  title: "Sign in · MIS Metal",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  );
}
