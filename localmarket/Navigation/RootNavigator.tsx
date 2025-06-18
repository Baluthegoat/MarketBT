import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import type { Session } from '@supabase/supabase-js'

import AuthStack from './AuthStack'
import MainTabs from './MainTabs'

const Stack = createStackNavigator()

interface RootNavigatorProps {
  session: Session | null
}

export default function RootNavigator({ session }: RootNavigatorProps) {
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
