import React, { useState, useEffect  } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const API_URL = 'http://71.94.151.15:5000/api';

const CreateActButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.CreateAct_container}>
      <Text style={styles.LogInButton_text}>{title}</Text>
    </TouchableOpacity>
)

const BackButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.BackButton_container}>
      <Text style={styles.BackButton_text}>{title}</Text>
    </TouchableOpacity>
)


export default function App() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  useEffect(() => {
    fetch(API_URL + '/users', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => setUserInfo(data))
      .catch(error => console.log(error));
  }, []);
  


  return (
    <SafeAreaView style={styles.container}>

      <BackButton onPress={() => navigation.navigate('login_screen')} title = "Back"/>

      <Text style={styles.row}>New User</Text>
      <StatusBar style="auto" />

      <View style={styles.inputView}>
        <TextInput
          style={styles.Txt}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.Txt}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <CreateActButton onPress={() => navigation.navigate('createAct_screen')} title = "Create Account"/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50, 
        backgroundColor: '#FFF7F5',
      },
      row: {
        padding: 100, 
        fontSize: 35,
        textAlign: 'center',
        color: '#61D0D8', 
      },
      inputView: {
        backgroundColor: "#B8DCF6",
        borderRadius: 30,
        width: "70%",
        height: 40,
        marginLeft: 65,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
      },
      TextInput: {
        height: 10,
        flex: 1,
        padding: 20,
        marginLeft: 20,
      },
      CreateAct_container: {
        backgroundColor: "#A6C6DC",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
        marginLeft: 125,
        marginRight: 125,
        marginBottom: 0,
     },
     LogInButton_text: {
        fontSize: 15,
        color: '#D6E3EC',
     },
     BackButton_container: {
        backgroundColor: "#97E4EA", 
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 300,
        marginBottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    BackButton_text: {
        fontSize: 15,
        color: '#FFF7F5',
    },

});