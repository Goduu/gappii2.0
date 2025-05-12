"use client"
import { Activity, UnderstandSubjectActivity } from '@/components/lesson-session/types';
import { createContext, useContext, ReactNode, useState } from 'react';

interface LessonSessionContextType {
    questions: Activity[];
    setQuestions: (questions: Activity[]) => void;
    attempts: Attempt[];
    addAttempt: (attempt: Attempt) => void;
    newSubjectAttempts: NewSubjectAttempt[];
    addNewSubjectAttempt: (attempt: NewSubjectAttempt) => void;
}

const LessonSessionContext = createContext<LessonSessionContextType | undefined>(undefined);

interface LessonSessionProviderProps {
    children: ReactNode;
}

export function LessonSessionProvider({ children }: LessonSessionProviderProps) {
    const [questions, setQuestions] = useState<Activity[]>([]);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [newSubjectAttempts, setNewSubjectAttempts] = useState<NewSubjectAttempt[]>([]);

    const addAttempt = (newAttempt: Attempt) => {
        setAttempts([...attempts, newAttempt]);
    }

    const addNewSubjectAttempt = (newAttempt: NewSubjectAttempt) => {
        setNewSubjectAttempts([...newSubjectAttempts, newAttempt]);
    }

    return (
        <LessonSessionContext.Provider value={{ questions, setQuestions, attempts, addAttempt, newSubjectAttempts, addNewSubjectAttempt }}>
            {children}
        </LessonSessionContext.Provider>
    );
}

export function useLessonSession() {
    const context = useContext(LessonSessionContext);
    if (context === undefined) {
        throw new Error('useLessonSession must be used within a LessonSessionProvider');
    }
    return context;
}

type Attempt = {
    activity: Activity;
    isCorrect: boolean;
}

type NewSubjectAttempt = {
    activity: UnderstandSubjectActivity;
    answerId: string;
}

