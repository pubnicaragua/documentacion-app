"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"
import Toast from "../src/components/common/Toast"

type ToastType = "success" | "error" | "info"

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<ToastType>("info")

  const showToast = (message: string, type: ToastType = "info") => {
    setMessage(message)
    setType(type)
    setVisible(true)
  }

  const hideToast = () => {
    setVisible(false)
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast visible={visible} message={message} type={type} onDismiss={hideToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast debe ser usado dentro de un ToastProvider")
  }
  return context
}
