// components/Navigation/MainTabs.tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import TabBarBadge from '../components/ui/TabBarBadge'
import useCartCount from '../hooks/useCartCount'
import usePendingOrdersCount from '../hooks/usePendingOrdersCount'

// Import screens
import HomeScreen from '../screens/HomeScreen'
import AddProductScreen from '../screens/AddProductScreen'
import CartScreen from '../screens/CartScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

export default function MainTabs() {
  const cartItemCount = useCartCount()
  const pendingOrdersCount = usePendingOrdersCount()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'AddProduct') {
            iconName = focused ? 'add-circle' : 'add-circle-outline'
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline'
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Cart' && <TabBarBadge count={cartItemCount} />}
              {route.name === 'Orders' && <TabBarBadge count={pendingOrdersCount} />}
            </View>
          )
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Products', headerTitle: 'Marketplace' }}
      />
      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Add Product', headerTitle: 'Add New Product' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart', headerTitle: 'Shopping Cart' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ title: 'Orders', headerTitle: 'Order History' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', headerTitle: 'My Profile' }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
