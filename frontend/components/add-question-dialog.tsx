"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createQuestionSchema, type CreateQuestionForm } from "@/lib/validations/question"
import { useCreateQuestion } from "@/hooks/use-questions"
import { useCategories } from "@/hooks/use-categories"
import { FileUpload } from "@/components/ui/file-upload"
import { useUploadQuestionImage } from "@/hooks/use-upload"

interface AddQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddQuestionDialog({
  open,
  onOpenChange,
}: AddQuestionDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion()
  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadQuestionImage()
  const { data: categories } = useCategories()

  const form = useForm<CreateQuestionForm>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      text: "",
      answerOptions: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      difficulty: "Medium",
      status: "Active",
      category: undefined,
    },
  })

  const onSubmit = async (data: CreateQuestionForm) => {
    try {
      let imageUrl: string | undefined

      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      createQuestion(
        {
          ...data,
          imageUrl,
        },
        {
          onSuccess: () => {
            form.reset()
            setImageFile(null)
            onOpenChange(false)
          },
        }
      )
    } catch (error) {
      console.error("Error creating question:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Question
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Question Image (Optional)</FormLabel>
              <FileUpload
                accept="image/jpeg,image/png,image/gif,image/webp"
                maxSize={5} // 5MB
                onFileSelect={setImageFile}
                onFileRemove={() => setImageFile(null)}
                selectedFile={imageFile}
                uploading={isUploadingImage}
              />
            </FormItem>

            <div className="space-y-4">
              <FormLabel>Answer Options</FormLabel>
              {form.watch("answerOptions").map((_, index) => (
                <div key={index} className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`answerOptions.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Option ${index + 1}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`answerOptions.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              // Uncheck all other options
                              form.setValue(
                                "answerOptions",
                                form
                                  .getValues("answerOptions")
                                  .map((option, i) => ({
                                    ...option,
                                    isCorrect: i === index,
                                  }))
                              )
                            }}
                            value={field.value ? "correct" : undefined}
                          >
                            <RadioGroupItem value="correct" />
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1045A1] hover:bg-[#0D3A8B] h-12"
              isLoading={isCreating || isUploadingImage}
            >
              Create Question
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}