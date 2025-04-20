import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

const { height } = Dimensions.get('window')

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return alert(error.message)
    navigation.replace('Home')
  }

  return (
    <View style={styles.container}>
      <View style={styles.redBackground}>
        <Text style={styles.title}>Welcome{"\n"}Back</Text>
        <Image source={require('../assets/icon.png')} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.whiteCard}>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>Sign In</Text>
        </View>

        <TextInput
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.circleButton} onPress={handleSignIn}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={{ color: '#FF3B3F' }}>Forgot Password?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  redBackground: {
    flex: 0.45,
    backgroundColor: '#FF3B3F',
    paddingTop: 60,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  whiteCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: height * 0.6,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 17,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 7,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 10,
  },
  circleButton: {
    backgroundColor: '#FF3B3F',
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  link: {
    color: '#FF3B3F',
    fontWeight: '500',
  },
})