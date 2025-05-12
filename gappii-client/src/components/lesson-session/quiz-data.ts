import { Activity } from './types';

export const SampleQuizData: Activity[] = [
  {
    id: '0',
    question: 'What is a very interesting and large question to test the quiz?',
    options: [
      { id: 'a', text: 'One quite big answer test 123' },
      { id: 'b', text: 'Another answer very long test 123' }
    ],
    keyConcepts: ['key concept 1', 'key concept 2'],
    correctOptionId: 'a'
  },
  {
    id: '1',
    question: 'What is the capital of France?',
    options: [
      { id: 'a', text: 'Paris' },
      { id: 'b', text: 'London' }
    ],
    keyConcepts: ['key concept 1', 'key concept 2'],
    correctOptionId: 'a'
  },
  {
    id: '2',
    question: 'What is the main color of the sky?',
    options: [
      { id: 'a', text: 'Red' },
      { id: 'b', text: 'Blue' }
    ],
    keyConcepts: ['key concept 1', 'key concept 2'],
    correctOptionId: 'b'
  },
  {
    id: '3',
    question: 'What is the largest planet in our solar system?',
    options: [
      { id: 'a', text: 'Jupiter' },
      { id: 'b', text: 'Saturn' }
    ],
    keyConcepts: ['key concept 4', 'key concept 2'],
    correctOptionId: 'a'
  },
  {
    id: '4',
    question: "Which language is used for building web applications?",
    options: [
      { id: 'a', text: 'Python' },
      { id: 'b', text: 'JavaScript' }
    ],
    keyConcepts: ['key concept 3'],
    correctOptionId: 'b'
  },
  {
    id: '5',
    question: "What is the capital of Brazil?",
    options: [
      { id: 'a', text: 'Rio de Janeiro' },
      { id: 'b', text: 'Brasilia' }
    ],
    keyConcepts: ['key concept 6', 'key concept 5'],
    correctOptionId: 'b'
  }
]; 