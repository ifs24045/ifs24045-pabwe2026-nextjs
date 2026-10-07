"use client";

import AuthLayout from "@/features/auth/layouts/AuthLayout";

export default function AuthRouteLayout({
  children,
}: {
   readonly children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
