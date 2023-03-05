import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import  login_screen  from './src/pages/login_screen';
import  buttonCtrl_screen  from './src/pages/buttonCtrl_screen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
            <Stack.Navigator initialRouteName="login_screen">
              <Stack.Screen name="login_screen" component={login_screen} options={{headerShown: false}} />
              <Stack.Screen name="buttonCtrl_screen" component={buttonCtrl_screen} options={{headerShown: false}} />
            </Stack.Navigator>
      </NavigationContainer>
  );
}