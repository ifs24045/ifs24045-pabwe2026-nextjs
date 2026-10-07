"use client";

import PostLayout from "@/features/posts/layouts/PostLayout";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <PostLayout>{children}</PostLayout>;
}