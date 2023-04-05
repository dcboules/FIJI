import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import api from './../api';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Locks = () => {
  const [lights, setLights] = useState([]);
  const [currentLight, setCurrentLight] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    getLights();
  }, []);
  const getLights = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await api.get('/lights/', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const data = response.data;
      console.log(data);
      setLights(data); // Make sure to set the lights state with the fetched data
      setCurrentLight(data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

const toggleLight = async (lightId, status) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');

    await api.post(
      `/lights/${lightId}/control`,
      { status: !status },
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      }
    );
    getLights();
  } catch (error) {
    console.error('Error toggling lights:', error);
  }
}; 

  if (!currentLight) {
    return <Text>Loading...</Text>;
  }

  const switchToLight = (index) => {
    setCurrentLight(lights[index]);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/FIJI.png')} style={styles.logo} />
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={() => navigation.toggleDrawer()}
      >
        <Text style={styles.drawerButtonText}>≡</Text>
      </TouchableOpacity>
      <View style={styles.box}>
        <Swiper
          style={styles.swiperWrapper}
          showsPagination={false}
          loop={false}
          onIndexChanged={switchToLight}
          index={lights.indexOf(currentLight)}
        >
          {lights.map((light, index) => (
            <View key={light.id} style={styles.lightContainer}>
              <Text style={styles.lightNameText}>{light.name}</Text>
              <Text style={styles.lightStatusText}>
                {light.status ? 'On' : 'Off'}
              </Text>
              <TouchableOpacity
                style={styles.lightButtonContainer}
                onPress={() => toggleLight(light.id, light.status)}
              >
                <Text style={styles.lightButtonText}>
                  {light.status ? 'Turn Off' : 'Turn On'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
        <View style={styles.lightNameWrapper}>
          {lights.map((light, index) => (
            <TouchableOpacity
              key={light.id}
              style={[
                styles.lightNameButton,
                light.id === currentLight.id && styles.lightNameButtonSelected,
              ]}
              onPress={() => switchToLight(index)}
            >
              <Text style={styles.lightNameButtonText}>{light.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9d3a4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '25%',
    height: undefined,
    aspectRatio: 1,
    position: 'absolute',
    top: 50,
  },
  drawerButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  drawerButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  box: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  swiperWrapper: {
    flex: 1,
    width: '100%',
  },
  lightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lightNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  lightStatusText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  lightButtonContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '56%',
    marginBottom: 20,
  },
  lightButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  lightNameWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#23272A',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ffffff',
  },
  lightNameButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  lightNameButtonSelected: {
    backgroundColor: '#7289DA',
  },
  lightNameButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Locks;

