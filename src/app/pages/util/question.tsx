import React, {JSX, useState} from "react";
import {pageLock} from "./page";

function arraysEqual(a:number[], b:number[]) {
    a.sort();
    b.sort();

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

export type QuestionProps = {
    question: string;
    choices: string[];
    answers: number[];
    onSelect?: (i: number) => void;
    solved?: pageLock;
};

export function CreateQuestionProps(question: string, choices: string[], answers: number[]):QuestionProps{
    function onSelect() {

    }
    return {question, choices, answers, onSelect: onSelect};
}

export function QuestionSection({ locks, questions }: { locks: ((locked: boolean) => void)[], questions: QuestionProps[] }) {
    const [incorrect, setIncorrect] = useState<boolean[]>(questions.map(() => true));

    const handleAnswerChange = (index: number, isCorrect: boolean) => {
        const newIncorrect = [...incorrect];
        newIncorrect[index] = !isCorrect;
        setIncorrect(newIncorrect);

        locks.forEach(lock => lock(newIncorrect.some(x => x)));
    };

    return (
        <>
            {questions.map((q, i) => (
                <ChoiceQuestion
                    key={i}
                    question={q}
                    onAnswerChange={(isCorrect) => handleAnswerChange(i, isCorrect)}
                />
            ))}
        </>
    );
}

export function ChoiceQuestion({
                                   question,
                                   onAnswerChange,
                               }: {
    question: QuestionProps,
    onAnswerChange?: (isCorrect: boolean) => void
}): JSX.Element {
    const [selected, setSelected] = useState<number[]>([]);

    function toggle(i: number) {
        setSelected(prev => {
            const next = prev.includes(i)
                ? prev.filter(x => x !== i)
                : [...prev, i];

            question.onSelect?.(i);

            const isCorrect = arraysEqual(next, question.answers);
            onAnswerChange?.(isCorrect); // notify parent about correctness
            return next;
        });
    }

    const correct = arraysEqual(selected, question.answers);

    return (
        <div className="choice-question">
            <h3>{question.question}</h3>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {question.choices.map((choice, i) => (
                    <li key={i}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selected.includes(i)}
                                onChange={() => toggle(i)}
                            />
                            {" "}{choice}
                        </label>
                    </li>
                ))}
            </ul>

            <p>{correct ? "✅ Correct" : "❌ Not correct yet"}</p>
        </div>
    );
}
