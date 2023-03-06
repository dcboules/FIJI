import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const API_URL = 'http://71.94.151.15:5000/api';

export default function LightsPage() {
  const [lights, setLights] = useState([]);
  const [selectedLight, setSelectedLight] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/lights')
      .then(response => response.json())
      .then(data => setLights(data))
      .catch(error => console.log(error));
  }, []);

  const handleLightToggle = (light) => {
    fetch(API_URL + `/lights/${light.id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const updatedLights = lights.map(l => l.id === data.id ? data : l);
        setLights(updatedLights);
      })
      .catch(error => console.log(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Lights Page</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedLight(value)}
        placeholder={{ label: 'Select a light...', value: null }}
        value={selectedLight}
        items={lights.map(light => ({ label: light.name, value: light }))}
      />
      {selectedLight && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: selectedLight.is_on ? 'green' : 'red' }]}
          onPress={() => handleLightToggle(selectedLight)}
        >
          <Text style={styles.buttonText}>{selectedLight.is_on ? 'Turn Off' : 'Turn On'}</Text>
        </TouchableOpacity>
      )}
      {lights.map(light => (
        <View key={light.id} style={styles.lightContainer}>
          <Text style={styles.lightName}>{light.name}</Text>
          <View style={[styles.lightStatus, { backgroundColor: light.is_on ? 'green' : 'red' }]} />
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  lightName: {
    marginRight: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightStatus: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});