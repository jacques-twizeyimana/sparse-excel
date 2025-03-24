import * as z from "zod";

export const createExamSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // duration: z.number().min(1, "Duration must be at least 1 minute"),
  duration: z.string().refine(
    (value) => {
      const duration = parseInt(value);
      return duration >= 1;
    },
    {
      message: "Duration must be at least 1 minute",
    }
  ),
  // passingScore: z.number().min(0, "Passing score must be at least 0").max(100, "Passing score cannot exceed 100"),
  passingScore: z.string().refine(
    (value) => {
      const score = parseInt(value);
      return score >= 1 && score <= 100;
    },
    {
      message: "Passing score must be between 1 and 100",
    }
  ),
  questions: z.array(z.string()).min(1, "Please select at least one question"),
  category: z.string({
    required_error: "Please select a category",
  }),
  course: z.string().optional(),
  status: z.enum(["Draft", "Published", "Archived"], {
    required_error: "Please select status",
  }),
});

export type CreateExamForm = z.infer<typeof createExamSchema>;

export interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
  category: {
    _id: string;
    categoryName: string;
  };
  course?: {
    _id: string;
    title: string;
  };
  status: "Draft" | "Published" | "Archived";
  createdAt: string;
}

interface Question {
  _id: string;
  text: string;
  imageUrl?: string;
  difficulty: "Easy" | "Medium" | "Hard";
}
