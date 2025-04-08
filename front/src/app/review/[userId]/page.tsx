import UserReviewListPage from "@/app/_components/review/UserReviewListPage";

interface PageProps {
  params: {
    userId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <UserReviewListPage userId={params.userId} />;
}
