import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView,} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const API_URL = 'http://71.94.151.15:5000/api';

const LogOutButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.LogOutButton_container}>
      <Text style={styles.LogOutButton_text}>{title}</Text>
    </TouchableOpacity>
)

const BackButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.BackButton_container}>
      <Text style={styles.BackButton_text}>{title}</Text>
    </TouchableOpacity>
)

export default function App() {
  const navigation = useNavigation();
  
  const [lights, setLights] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLight, setSelectedLight] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/lights')
      .then(response => response.json())
      .then(data => setLights(data))
      .catch(error => console.log(error));

    fetch(API_URL + '/users')
      .then(response => response.json())
      .then(data => setUsers(data))
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

  const handleLightOn = (light) => {
    fetch(API_URL + `/lights/${light.id}/on`, {
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

  const handleLightOff = (light) => {
    fetch(API_URL + `/lights/${light.id}/off`, {
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

  const handleAssignUser = () => {
    if (selectedLight && selectedUser) {
      fetch(API_URL + `/lights/${selectedLight.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: selectedUser.id })
      })
        .then(response => response.json())
        .then(data => {
          const updatedLights = lights.map(l => l.id === data.id ? data : l);
          setLights(updatedLights);
        })
        .catch(error => console.log(error));
    }
  };
return (
  <SafeAreaView style={styles.container}> 
  <LogOutButton onPress={() => navigation.navigate('login_screen')} title = "Log out"/>
  <View style={styles.assignDropdowns}>
  <View style={styles.assignDropdown}>
    <Text style={styles.assignDropdownLabel}>Light:</Text>
    <View style={styles.dropdownContainer}>
      <RNPickerSelect
        placeholder={{ label: 'Select Light...', value: null }}
        onValueChange={(value) => setSelectedLight(value)}
        items={lights.map(light => ({ label: light.name, value: light }))}
        value={selectedLight}
        style={{ inputAndroid: styles.dropdownInput }}
      />
    </View>
  </View>
  <View style={styles.assignDropdown}>
    <Text style={styles.assignDropdownLabel}>User:</Text>
    <View style={styles.dropdownContainer}>
      <RNPickerSelect
        placeholder={{ label: 'Select User...', value: null }}
        onValueChange={(value) => setSelectedUser(value)}
        items={users.map(user => ({ label: user.name, value: user }))}
        value={selectedUser}
        style={{ inputAndroid: styles.dropdownInput }}
      />
    </View>
  </View>
  <TouchableOpacity style={styles.assignButton} onPress={handleAssignUser}>
    <Text style={styles.assignButtonText}>Assign</Text>
  </TouchableOpacity>
</View>
<BackButton onPress={() => navigation.navigate('admButtonCtrl_screen')} title = "Back"/>
</SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  listItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  LogOutButton_container: {
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
LogOutButton_text: {
    fontSize: 15,
    color: '#FFF7F5',
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
  assignContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  assignHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assignDropdowns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dropdownContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  assignButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});