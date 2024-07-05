import type { QuestionType } from "./enum";

export interface Quiz {
    _id: string;
    name: string;
    owner: string;
    categories: Category[];
    authors: string[];
    createdAt: Date;
    questions?: Question[]
}

export interface Choice {
    _id?: string;
    text: string;
    imgUrl?: string;
    isCorrect?: Boolean;
}

export interface Category {
    _id: number;
    id: number;
    name: string;
    defaultTimer: number;
    defaultScore: number;
}

export interface Question {
    _id: string;
    questionType: QuestionType;
    category: Category;
    timer: number;
    text: string;
    choices?: Choice[];
}
