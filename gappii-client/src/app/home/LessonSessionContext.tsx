"use client"
import { Activity, NewSubjectActivity } from '@/components/lesson-session/types';
import { createContext, useContext, ReactNode, useState } from 'react';

interface LessonSessionContextType {
    activities: Activity[];
    setActivities: (activities: Activity[]) => void;
    attempts: Attempt[];
    addAttempt: (attempt: Attempt) => void;
    newSubjectAttempts: NewSubjectAnswer[];
    addNewSubjectAttempt: (attempt: NewSubjectAnswer) => void;
    currentSubject: string | null;
    setCurrentSubject: (subject: string) => void;
    startSession: () => void;
}

const LessonSessionContext = createContext<LessonSessionContextType | undefined>(undefined);

interface LessonSessionProviderProps {
    children: ReactNode;
}

export function LessonSessionProvider({ children }: LessonSessionProviderProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [newSubjectAnswers, setNewSubjectAnswers] = useState<NewSubjectAnswer[]>([]);
    const [currentSubject, setCurrentSubject] = useState<string | null>(null);

    const addAttempt = (newAttempt: Attempt) => {
        setAttempts([...attempts, newAttempt]);
    }

    const addNewSubjectAttempt = (newAttempt: NewSubjectAnswer) => {
        setNewSubjectAnswers([...newSubjectAnswers, newAttempt]);
    }

    const startSession = () => {
        setAttempts([]);
        setNewSubjectAnswers([]);
    }

    return (
        <LessonSessionContext.Provider value={{
            activities,
            setActivities,
            attempts,
            addAttempt,
            newSubjectAttempts: newSubjectAnswers,
            addNewSubjectAttempt,
            currentSubject,
            setCurrentSubject,
            startSession
        }}>
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

type NewSubjectAnswer = {
    activity: NewSubjectActivity;
    answerId: string;
}

