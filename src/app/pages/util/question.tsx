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

export function QuestionSection(locks: pageLock[], questions: QuestionProps[]){
    let incorrect: boolean[] = []
    let elements: JSX.Element[] = [];
    for (let i = 0; i < questions.length; i++){
        const lock: pageLock ={
            lock: false
        };
        questions[i].solved = new Proxy(lock, {
            set: (target, prop, value) => {
                target[prop as keyof typeof target] = value;
                incorrect[i] = target.lock;
                for (let j of incorrect) {
                    if (j) {
                        for (let lock of locks) {
                            lock.lock = true;
                        }
                        return true
                    }
                }
                for (let lock of locks) {
                    lock.lock = false;
                }
                return true;
            },

        });
        incorrect.push(true);
        elements.push(ChoiceQuestion(questions[i]));
    }
    return elements;
}

export function ChoiceQuestion(question: QuestionProps): JSX.Element {
    const [selected, setSelected] = useState<number[]>([]);

    function toggle(i: number) {
        setSelected(prev => {
            const next = prev.includes(i)
                ? prev.filter(x => x !== i)
                : [...prev, i];

            question.onSelect?.(i);
            return next;
        });
    }

    const correct = arraysEqual(selected, question.answers);
    if (question.solved) {
        question.solved.lock = !correct;
    }

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
