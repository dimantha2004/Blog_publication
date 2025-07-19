import { EditPostPage } from '@/components/pages/edit-post-page';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export default function EditPost({ params }: EditPostPageProps) {
  return <EditPostPage postId={params.id} />;
}