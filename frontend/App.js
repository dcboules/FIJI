import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import createAct_screen from './src/pages/createAct_screen';
import login_screen from './src/pages/login_screen';
import buttonCtrl_screen from './src/pages/buttonCtrl_screen';
import admButtonCtrl_screen from './src/pages/admButtonCtrl_screen';
import admPriv_screen from './src/pages/admPriv_screen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
            <Stack.Navigator initialRouteName="login_screen">
              <Stack.Screen name="login_screen" component={login_screen} options={{headerShown: false}} />
              <Stack.Screen name="buttonCtrl_screen" component={buttonCtrl_screen} options={{headerShown: false}} />
              <Stack.Screen name="createAct_screen" component={createAct_screen} options={{headerShown: false}} />
              <Stack.Screen name="admButtonCtrl_screen" component={admButtonCtrl_screen} options={{headerShown: false}} />
              <Stack.Screen name="admPriv_screen" component={admPriv_screen} options={{headerShown: false}} />
            </Stack.Navigator>
      </NavigationContainer>
  );
}