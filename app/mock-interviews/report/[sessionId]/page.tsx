import { InterviewReportView } from '@/components/mock-interviews/InterviewReportView';

export default function MockInterviewReportPage({ params }: { params: { sessionId: string } }) {
  return <InterviewReportView sessionId={params.sessionId} />;
}
