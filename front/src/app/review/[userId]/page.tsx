import UserReviewListPage from "@/app/_components/review/UserReviewListPage";

export default function Page({ params }: { params: { userId: string } }) {
  return <UserReviewListPage userId={params.userId} />;
}
