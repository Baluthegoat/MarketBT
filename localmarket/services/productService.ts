// services/productService.ts
import { supabase } from "../lib/supabase"
import * as FileSystem from "expo-file-system"

// Helper: generate random filename
const generateRandomFileName = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `product_${timestamp}_${random}.jpg`
}

export async function uploadProductImage(uri: string): Promise<string> {
  // Ensure user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("User not authenticated")
  }

  const fileName = generateRandomFileName()

  // Check file exists
  const fileInfo = await FileSystem.getInfoAsync(uri)
  if (!fileInfo.exists) {
    throw new Error("File does not exist")
  }

  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  })

  // Convert base64 to byte array
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, byteArray, {
      contentType: "image/jpeg",
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  // Get public URL
  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName)
  if (!data?.publicUrl) {
    throw new Error("Failed to get public URL")
  }

  return data.publicUrl
}

export async function addProduct(
  name: string,
  description: string,
  price: number,
  imageUrl: string | null
) {
  if (!name.trim() || !description.trim() || price <= 0) {
    throw new Error("Invalid input data")
  }

  // Ensure user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // Insert product record
  const { error } = await supabase.from("products").insert({
    name: name.trim(),
    description: description.trim(),
    price,
    image_url: imageUrl,
    vendor_id: user.id,
  })

  if (error) {
    throw error
  }
}
