import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithMagicLink() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      Alert.alert('Magic link error', error.message)
    } else {
      Alert.alert('Check your email for the magic link!')
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Send Magic Link"
          onPress={signInWithMagicLink}
          disabled={loading || !email}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
