import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const LogOutButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.LogOutButton_container}>
      <Text style={styles.LogOutButton_text}>{title}</Text>
    </TouchableOpacity>
)

export default function App() {
  const navigation = useNavigation();

  const lights = [
    {
        id: 1,
        item: 'Popcorn chicken', 
        price: 8,
        description: 'Savory deep fried chicken with basil',
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    },
  ]

  const lightList = lights.map(light => <Text style ={styles.item}>Light: {lights.id} {'\n'} {lights.price} </Text>)

  return (
    <SafeAreaView style={styles.container}>
      <LogOutButton onPress={() => navigation.navigate('login_screen')} title = "Log out"/>
      
      <Text style={styles.row}>Light Control</Text>
      <StatusBar style="auto" />

      <ScrollView>
        {lightList}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50, 
    backgroundColor: '#FFF7F5',
  },
  menuContainer: {
    flex: 1,
    padding: 1, 
    marginLeft: 20,
    backgroundColor: '#A0ADB2',
  },
  row: {
    padding: 25, 
    fontSize: 35,
    textAlign: 'center',
    color: '#61D0D8', 
  },
  item: {
    fontSize: 20,
    padding: 10,
    marginTop: 1,
    backgroundColor: '#D4E5F1',
  },
  LogOutButton_container: {
    backgroundColor: "#97E4EA", // A6C6DC
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
LogOutButton_text: {
    fontSize: 15,
    color: '#FFF7F5',
},

});