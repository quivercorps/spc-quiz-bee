import type { QuestionType } from "./enum";

export interface Quiz {
    _id: string;
    name: string;
    owner: string;
    authors: string;
    createdAt: Date;
    questions?: Question
}

export interface Question {
    _id: string;
    type: QuestionType;
    category: string;
    timer: number;
    text: string;
    choices?: string[];
    correctChoices?: string;
}
