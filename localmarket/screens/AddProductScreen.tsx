"use client"

import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import TextInputField from "../components/AddCart/TextInputField"
import Button from "../components/AddCart/Button"
import { useProductForm } from "../hooks/useProductForm"
import { uploadProductImage, addProduct } from "../services/productService"

export default function AddProductScreen() {
  const {
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
  } = useProductForm()

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission required", "We need access to your photos to upload an image.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.3,
        aspect: [1, 1],
      })

      if (!result.canceled) {
        let imageUri = null
        if (result.assets && result.assets[0]) {
          imageUri = result.assets[0].uri
        } else if (result.uri) {
          imageUri = result.uri
        }

        if (imageUri) {
          setLoading(true)
          const uploadedUrl = await uploadProductImage(imageUri)
          setImageUrl(uploadedUrl)
          Alert.alert("Success", "Image uploaded successfully!")
        }
      }
    } catch (error: any) {
      Alert.alert("Upload Error", error.message || "Failed to upload image.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!name || !description || !price) {
      Alert.alert("Missing fields", "Please fill in all required fields.")
      return
    }

    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Invalid price", "Enter a valid numeric price greater than 0.")
      return
    }

    try {
      setLoading(true)
      await addProduct(name, description, priceNumber, imageUrl || null)
      Alert.alert("Success 🎉", "Product added successfully!")
      resetForm()
      setImageUrl("")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Product</Text>
        <Text style={styles.subtitle}>Fill in the details to list your product</Text>

        <View style={styles.form}>
          <TextInputField
            label="Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter product name"
          />

          <TextInputField
            label="Description *"
            value={description}
            onChangeText={setDescription}
            placeholder="Product description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TextInputField
            label="Price (Nu) *"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

          <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker} disabled={loading}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>
                {loading ? "Uploading..." : "Pick an Image"}
              </Text>
            )}
          </TouchableOpacity>

          <Button
            onPress={handleAddProduct}
            title="Add Product"
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 24,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePicker: {
    marginTop: 12,
    marginBottom: 12,
    height: 150,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    color: "#475569",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
})
