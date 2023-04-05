import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens
import Register from './src/pages/register.js';
import Login from './src/pages/login.js';
import LocksDrawer from './src/pages/locks.js';
import Admin from './src/pages/admin.js';

// Custom drawer component
import CustomDrawer from './src/pages/customDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerRoutes() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Drawer"
        component={LocksDrawer}
        options={{ title: 'Drawer', headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login_page"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#e9d3a4',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="login_page"
          component={Login}
          options={{ title: 'Login', headerShown: false }}
        />
        <Stack.Screen
          name="register_page"
          component={Register}
          options={{ title: 'Register', headerShown: false }}
        />
        <Stack.Screen
          name="Locks"
          component={DrawerRoutes}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}