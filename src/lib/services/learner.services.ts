import axios from "axios";

import {Quiz, QuizSubmmission} from "@/types";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const learnerServices = {
  async getLesson(accessToken?: string, lessonSlug?: string) {
    const response = await axios.get(BASE_API + `/lessons/${lessonSlug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  async getQuizQuestions(accessToken?: string, quizId?: string): Promise<Quiz> {
    const response = await axios.get(BASE_API + `/quizzes/${quizId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  async submitQuiz(
    accessToken?: string,
    quizId?: string,
    answers?: {[key: string]: string},
  ): Promise<QuizSubmmission> {
    const response = await axios.post(
      BASE_API + `/quizzes/${quizId}/submit`,
      {answers: answers},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async getSubmissonResult(
    accessToken?: string,
    submissionId?: string,
  ): Promise<QuizSubmmission> {
    const response = await axios.get(
      BASE_API + `/quiz-submissions/${submissionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },
};
