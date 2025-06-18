"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "./lib/supabase"
import type { Session } from "@supabase/supabase-js"

// Import screens
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import HomeScreen from "./screens/HomeScreen"
import AddProductScreen from "./screens/AddProductScreen"
import CartScreen from "./screens/CartScreen"
import ProfileScreen from "./screens/ProfileScreen"
import OrderHistoryScreen from "./screens/OrderHistoryScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Badge component for notifications
function TabBarBadge({ count }: { count: number }) {
  if (count === 0) return null
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)

  // Fetch cart items count
  const fetchCartCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id)

      if (error) throw error
      
      const totalItems = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
      setCartItemCount(totalItems)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  // Fetch pending orders count
  const fetchPendingOrdersCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .in("status", ["pending", "confirmed"]) // Count pending and confirmed orders

      if (error) throw error
      
      setPendingOrdersCount(data?.length || 0)
    } catch (error) {
      console.error("Error fetching pending orders count:", error)
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    fetchCartCount()
    fetchPendingOrdersCount()

    // Subscribe to cart changes
    const cartSubscription = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items'
        },
        () => {
          fetchCartCount()
        }
      )
      .subscribe()

    // Subscribe to order changes
    const orderSubscription = supabase
      .channel('order_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchPendingOrdersCount()
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(cartSubscription)
      supabase.removeChannel(orderSubscription)
    }
  }, [])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "AddProduct") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline"
          } else if (route.name === "Orders") {
            iconName = focused ? "receipt" : "receipt-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else {
            iconName = "home-outline"
          }

          // Render icon with badge
          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === "Cart" && <TabBarBadge count={cartItemCount} />}
              {route.name === "Orders" && <TabBarBadge count={pendingOrdersCount} />}
            </View>
          )
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: "Products",
          headerTitle: "Marketplace"
        }} 
      />
      <Tab.Screen 
        name="AddProduct" 
        component={AddProductScreen} 
        options={{ 
          title: "Add Product",
          headerTitle: "Add New Product"
        }} 
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ 
          title: "Cart",
          headerTitle: "Shopping Cart"
        }} 
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderHistoryScreen} 
        options={{ 
          title: "Orders",
          headerTitle: "Order History"
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: "Profile",
          headerTitle: "My Profile"
        }} 
      />
    </Tab.Navigator>
  )
}

function RootNavigator({ session }: { session: Session | null }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <RootNavigator session={session} />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
})