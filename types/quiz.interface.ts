import type { QuestionType } from "./enum";

export interface QuizQuestion {
    type: QuestionType;
    text: string;
    choices: string[];
}
