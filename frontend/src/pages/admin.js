import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const admin = () => {
  const [users, setUsers] = useState([]);
  const [lights, setLights] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const organization_name = 'Your Organization';

  useEffect(() => {
    // Fetch users and lights data here

  }, []);

  const toggleLightPermission = (userId, lightId) => {
    // API call to toggle light permission for a user

  };

  

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.userTabs}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userTab}
            onPress={() => setSelectedUser(user)}
          >
            <Text style={styles.userName}>User_{user.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedUser && (
        <View style={styles.userContent}>
          <Text style={styles.userEmail}>{selectedUser.email}</Text>
          <Text style={styles.assignPermissions}>Assign permissions</Text>
          <View style={styles.lightsList}>
            {lights.map((light) => (
              <TouchableOpacity
                key={light.id}
                style={[
                  styles.lightButton,
                  selectedUser.lights.includes(light.id)
                    ? styles.lightButtonActive
                    : null,
                ]}
                onPress={() => toggleLightPermission(selectedUser.id, light.id)}
              >
                <Text style={styles.lightName}>{light.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={styles.organizationInfo}>
        <Text style={styles.organizationText}>
          {organization_name}'s code: ______
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userTabs: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  userTab: {
    padding: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
  },
  userContent: {
    padding: 20,
  },
  userEmail: {
    fontSize: 20,
    marginBottom: 10,
  },
  assignPermissions: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lightsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lightButton: {
    backgroundColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  lightButtonActive: {
    backgroundColor: '#0f0',
  },
  lightName: {
    fontSize: 16,
  },
  organizationInfo: {
    backgroundColor: '#000',
    padding: 15,
  },
  organizationText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default admin;