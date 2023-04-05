import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from './../api.js';

const LogInButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.LogInButton_container}>
    <Text style={styles.LogInButton_text}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);


  const [logoScale] = useState(new Animated.Value(1));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        Animated.timing(logoScale, {
        toValue: 0.7,
        duration: 200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(logoScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [logoScale]);

  const handleLogin = async () => {
  if (email.length === 0) {
    setErrorMsg("Please enter an email.");
    return;
  }

  if (password.length === 0) {
    setErrorMsg("Please enter a password.");
    return;
  }

  try {
    const response = await api.post('auth/login', { email, password });
    if (response.status === 200) {
      await AsyncStorage.setItem('userToken', response.data.token);
      navigation.navigate('Locks');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      setErrorMsg("Invalid email or password.");
    } else {
      setErrorMsg("Could not connect to the backend server.");
    }
  }
};

const renderErrorMsg = () => {
  if (errorMsg != null) {
    return (
      <View>
        <Text>{errorMsg}</Text>
      </View>
    )
  }
  return <View></View>
}

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../../assets/FIJI.png')}
          resizeMode="contain"
          style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#000"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <LogInButton
          onPress={() => handleLogin()}
          title="Log In"
        />
        <View style={styles.signupLinkContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('register_page')}
          >
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  </KeyboardAvoidingView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9d3a4',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '85%',
    height: undefined,
    aspectRatio: 1,
  },
  inputView: {
    backgroundColor: '#c5b5a5',
    borderRadius: 5,
    width: '70%',
    height: 40,
    marginBottom: 15,
    alignSelf: 'center',
  },
  TextInput: {
    height: 40,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  LogInButton_container: {
    backgroundColor: '#d9c4a1',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '56%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  LogInButton_text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#000',
  },
});
