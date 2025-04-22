import { QuizQuestion } from './types';

export const SampleQuizData: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: [
      { id: 'a', text: 'Paris' },
      { id: 'b', text: 'London' }
    ],
    correctOptionId: 'a'
  },
  {
    id: '2',
    question: 'What is the main color of the sky?',
    options: [
      { id: 'a', text: 'Red' },
      { id: 'b', text: 'Blue' }
    ],
    correctOptionId: 'b'
  },
  {
    id: '3',
    question: 'What is the largest planet in our solar system?',
    options: [
      { id: 'a', text: 'Jupiter' },
      { id: 'b', text: 'Saturn' }
    ],
    correctOptionId: 'a'
  },
  {
    id: '4',
    question: "Which language is used for building web applications?",
    options: [
      { id: 'a', text: 'Python' },
      { id: 'b', text: 'JavaScript' }
    ],
    correctOptionId: 'b'
  },
  {
    id: '5',
    question: "What is the capital of Brazil?",
    options: [
      { id: 'a', text: 'Rio de Janeiro' },
      { id: 'b', text: 'Brasilia' }
    ],
    correctOptionId: 'b'
  }
]; 