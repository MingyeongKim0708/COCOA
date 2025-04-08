import UserReviewListPage from "@/app/_components/review/UserReviewListPage";

interface ReviewPageProps {
  params: {
    userId: string;
  };
}

export default function Page({ params }: ReviewPageProps) {
  return <UserReviewListPage userId={params.userId} />;
}
