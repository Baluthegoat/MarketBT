// hooks/useProductForm.ts
import { useState } from "react"

export function useProductForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setImageUrl("")
  }

  return {
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    imageUrl,
    setImageUrl,
    loading,
    setLoading,
    resetForm,
  }
}
