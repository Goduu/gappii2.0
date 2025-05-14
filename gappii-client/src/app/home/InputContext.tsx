"use client"
import { createContext, useContext, ReactNode, useState, RefObject, useRef, useEffect, useCallback } from 'react';
import { experimental_useObject } from "@ai-sdk/react";
import { NewSubjectActivity, UnderstandSubjectsSchema } from '@/components/lesson-session/types';
import { DeepPartial } from 'ai';
import { useRouterChange, useSquareRouter } from './RouterContext';

type NewSubjectLesson = { activities: NewSubjectActivity[] | DeepPartial<NewSubjectActivity[]> } | null

interface InputContextType {
    inputValue: string;
    setInputValue: (input: string) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    focusInput: () => void;
    blurAndClearInput: () => void;
    handleSubmit: (input: { userPrompt: string }) => void;
    isLoading: boolean;
    newSubjectLesson?: NewSubjectLesson;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

interface InputContextProviderProps {
    children: ReactNode;
}

export function InputContextProvider({ children }: InputContextProviderProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { changeRouter: setRouter, isNewRoute } = useSquareRouter()
    const [submitted, setSubmitted] = useState<boolean>(false)


    const { submit, isLoading, object: activities } = experimental_useObject({
        api: "/api/understandSubject",
        schema: UnderstandSubjectsSchema,
        onFinish({ object }) {
            if (object != null) {
                console.info(object)
            }
        },
        onError: (e) => {
            console.info("Error on InputContextProvider: ", e);
        },
    });

    useEffect(() => {
        if (activities?.activities?.[0] && isNewRoute && submitted) {
            setRouter('session/new-subject')
            blurAndClearInput()
            setSubmitted(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activities, setRouter])

    const handleSubmit = (input: { userPrompt: string }) => {
        setSubmitted(true)
        submit(input)
    }

    const focusInput = () => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }

    const blurAndClearInput = useCallback(() => {
        inputRef.current?.blur();
        setInputValue('');
    }, [])

    useRouterChange((newRoute) => {
        if (newRoute === "new") {
            setInputValue("")
        }
    });

    return (
        <InputContext.Provider value={{
            inputValue,
            setInputValue,
            inputRef,
            focusInput,
            blurAndClearInput,
            handleSubmit,
            isLoading,
            newSubjectLesson: activities?.activities ? { activities: activities.activities } : null
        }}>
            {children}
        </InputContext.Provider>
    );
}

export function useInput() {
    const context = useContext(InputContext);
    if (context === undefined) {
        throw new Error('useInput must be used within a InputContextProvider');
    }
    return context;
}
