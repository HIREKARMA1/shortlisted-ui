export type MockInterview = {
  id: string;
  batch_id: string;
  batch_name?: string;
  title: string;
  topic: string;
  difficulty: string;
  duration_minutes: number;
  number_of_questions: number;
  focus_areas: string[];
  status: 'draft' | 'generating' | 'review' | 'published';
  question_count: number;
  created_at: string;
};

export type MockInterviewQuestion = {
  id: string;
  text: string;
  difficulty: string;
  key_points: string[];
  follow_up_hints: string[];
  common_mistakes: string[];
  order_index: number;
};

export type MockInterviewDetail = MockInterview & { questions: MockInterviewQuestion[] };

export type MockInterviewSession = {
  id: string;
  mock_interview_id: string;
  mock_interview_title: string;
  status: string;
  current_question_index: number;
  started_at?: string | null;
  ended_at?: string | null;
};
