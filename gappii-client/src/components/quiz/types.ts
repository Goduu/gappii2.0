export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [QuizOption, QuizOption];
  correctOptionId: string;
}

export interface QuizGameProps {
  questions: QuizQuestion[];
  initialTime: number;
}
