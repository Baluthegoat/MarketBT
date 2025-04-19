// SignInScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Add real auth logic here
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.redBackground}>
        <Text style={styles.title}>Welcome{"\n"}Back</Text>
        <Image source={require('../assets/icon.png')} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.whiteCard}>
        <Text style={styles.cardTitle}>Sign in</Text>

        <TextInput
          placeholder="Example@gmail.com"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder=""
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.circleButton} onPress={handleSignIn}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={{ color: '#FF3B3F' }}>Forgot password?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
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
  image: { width: 150, height: 150, alignSelf: 'center' },
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
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
  },
  circleButton: {
    backgroundColor: '#FF3B3F',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 30,
    padding: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  link: { color: '#FF3B3F', fontWeight: '500' },
});