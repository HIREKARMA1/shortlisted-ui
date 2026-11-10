import { StudentEventDetailView } from '@/components/dashboard/student/StudentEventDetailView';

export default function StudentEventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <StudentEventDetailView slug={params.slug} />;
}
