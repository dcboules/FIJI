import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from './../api';
const RegisterButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.registerButtonContainer}>
    <Text style={styles.registerButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default function Register() {
  const navigation = useNavigation();

  const [organizationName, setOrganizationName] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('false'); 
  
  //false == staff  |  true == admin

  const handleRegister = async () => {
    try {
      const response = await api.post('auth/register', {
        email,
        password,
        role: selectedRole, // send the boolean value
        organization_name: organizationName,
        organization_code: organizationCode,
      });

      if (response.data.success) {
        navigation.navigate('Locks');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to FIJI</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/FIJI.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.roleSelectionContainer}>
          <Text style={styles.roleSelectionText}>Select your role:</Text>
          <View style={styles.rolesContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                !selectedRole && styles.selectedRoleButton,
              ]}
              onPress={() => setSelectedRole(false)} // false for Staff
            >
              <Text
                style={[
                  styles.roleButtonText,
                  !selectedRole && styles.selectedRoleButtonText,
                ]}
              >
                Staff
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole && styles.selectedRoleButton,
              ]}
              onPress={() => setSelectedRole(true)} // true for Admin
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole && styles.selectedRoleButtonText,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputFieldsContainer}>
          {selectedRole ? (
            <>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Organization Name"
                  placeholderTextColor="#000"
                  onChangeText={(text) => setOrganizationName(text)}
                />
              </View>
              <Text style={styles.subText}>
                Provide a name for your organization.
              </Text>
            </>
          ) : (
            <>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Organization Code"
                  placeholderTextColor="#000"
                  onChangeText={(text) => setOrganizationCode(text)}
                />
              </View>
              <Text style={styles.subText}>
                Enter the organization ID (provided by admin)
              </Text>
            </>
          )}
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#000"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <RegisterButton onPress={handleRegister} title="Create Account" />

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
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  roleSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleSelectionText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  roleButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#c5b5a5',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedRoleButton: {
    backgroundColor: '#34e3e3',
  },
  selectedRoleButtonText: {
    fontWeight: 'bold',
  },
  inputFieldsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputView: {
    backgroundColor: '#c5b5a5',
    borderRadius: 8,
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
  subText: {
    fontSize: 12,
    color: '#000',
    marginBottom: 10,
  },
  registerButtonContainer: {
    backgroundColor: '#d9c4a1',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '56%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
