import { InterviewRoom } from '@/components/mock-interviews/InterviewRoom';

export default function MockInterviewSessionPage({ params }: { params: { sessionId: string } }) {
  return <InterviewRoom sessionId={params.sessionId} />;
}
