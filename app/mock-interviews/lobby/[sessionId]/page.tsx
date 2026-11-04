import { InterviewLobby } from '@/components/mock-interviews/InterviewLobby';

export default function MockInterviewLobbyPage({ params }: { params: { sessionId: string } }) {
  return <InterviewLobby sessionId={params.sessionId} />;
}
