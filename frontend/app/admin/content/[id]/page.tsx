"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/lib/validations/course";
import axios from "@/lib/axios";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/courses/${params.id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Fetch course error:", error);
        // Handle error (show toast, etc)
      }
    };

    fetchCourse();
  }, [params.id]);

  const handlePublish = async () => {
    try {
      await axios.put(`/courses/${params.id}`, {
        isPublished: true,
      });
      router.push("/admin/content");
    } catch (error) {
      console.error("Publish course error:", error);
      // Handle error (show toast, etc)
    }
  };

  if (!course) {
    return null; // Loading state
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/content"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">{course.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Course Details</h2>

            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Description</span>
                <p className="text-sm">{course.description}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Language</span>
                <p className="text-sm">{course.language}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="text-sm">{course.category.categoryName}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Instructor</span>
                <p className="text-sm">{course.instructor.name}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Course Content</h2>

            <div className="space-y-4">
              {course.videoUrl && (
                <div>
                  <span className="text-sm text-gray-500">Video URL</span>
                  <a
                    href={course.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline break-all"
                  >
                    {course.videoUrl}
                  </a>
                </div>
              )}

              {course.documentUrl && (
                <div>
                  <span className="text-sm text-gray-500">Document URL</span>
                  <a
                    href={course.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline break-all"
                  >
                    {course.documentUrl}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {!course.isPublished && (
        <Button
          className="bg-[#1045A1] hover:bg-[#0D3A8B]"
          onClick={handlePublish}
        >
          Publish Course
        </Button>
      )}
    </div>
  );
}
