import type { OptionResponse } from './optionResponse';

export interface QuestionResponse {
    question: string;
    options: OptionResponse[];

}