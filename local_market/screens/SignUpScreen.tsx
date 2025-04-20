import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

const { height } = Dimensions.get('window')

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: { navigation: SignUpScreenNavigationProp }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignUp = async () => {
    if (!name || !phone || !email || !password) {
      alert('Please fill in all fields')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone_number: phone },
      },
    })

    if (error) return alert(error.message)
    navigation.replace('Home')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.redBackground}>
          <Text style={styles.title}>Let's Start!</Text>
          <Image source={require('../assets/icon.png')} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Create Your Account</Text>

          <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
          <TextInput placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />

          <View style={styles.passwordContainer}>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={styles.passwordInput} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.circleButton} onPress={handleSignUp}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={{ color: '#FF3B3F' }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.link}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF3B3F',
  },
  redBackground: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
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
    textAlign: 'center',
    marginBottom: 20,
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
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  circleButton: {
    backgroundColor: '#FF3B3F',
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 120,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: '#FF3B3F',
    fontWeight: 'bold',
  },
});