import { PostDetailPage } from '@/components/pages/post-detail-page';

interface PostPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export default function PostPage({ params }: PostPageProps) {
  return <PostDetailPage postId={params.id} />;
}