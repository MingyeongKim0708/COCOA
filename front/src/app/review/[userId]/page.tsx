import ReviewListPage from "@/app/_components/review/ReviewListPage";

export default function Page({ params }: { params: { userId: string } }) {
  return <ReviewListPage userId={params.userId} />;
}
