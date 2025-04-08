"use client";

import UserReviewListPage from "@/app/_components/review/UserReviewListPage";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ userId: string }>();
  return <UserReviewListPage userId={params.userId} />;
}
