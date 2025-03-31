"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          style: {
            background: "#10B981",
          },
        },
        error: {
          style: {
            background: "#EF4444",
          },
        },
      }}
    />
  )
}