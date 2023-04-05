import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CustomDrawer(props) {
  const { navigation } = props;
  
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      const userEmail = await AsyncStorage.getItem('email');
      setEmail(userEmail);
    };

    fetchEmail();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    props.navigation.navigate('login_page');
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.userInfoSection}>
        {/* Add your user info section here */}
        <Text style={styles.userName}>{email}</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
      paddingTop: 20,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    drawerSection: {
      marginTop: 15,
    },
    drawerItem: {
      padding: 15,
    },
    drawerItemText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
});

    export default CustomDrawer;
