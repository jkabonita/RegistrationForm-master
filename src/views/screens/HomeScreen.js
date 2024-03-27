import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import robot from '../../img/robot.png';
const HomeScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const UserLoggedInData = await AsyncStorage.getItem("UserLoggedInData");

      if (userData) {
        setUserDetails(JSON.parse(userData));
      }

      if (UserLoggedInData) {
        const udata = JSON.parse(UserLoggedInData);
        setUserDetails(udata.user);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error getting user data:", error);
      setLoading(false);
    }
  };

  const onSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem("UserLoggedInData");
      setUserDetails(null);
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {userDetails && userDetails.photoURL && (
        <ImageBackground
          style={styles.imageContainer}
          source={{ uri: userDetails.photoURL }}
        >
          <Image style={styles.image} source={{ uri: userDetails.photoURL }} />
          <Image
    style={styles.robot}
    source={robot} // Use the imported image as the source
/>
        </ImageBackground>
      )}
      <Text style={styles.greeting}>Welcome to Robotics Club!</Text>
      {userDetails && (
        <>
          <Text style={styles.username}>
            {userDetails.fullname || userDetails.displayName}
          </Text>
          <Text style={styles.email}>{userDetails.email}</Text>
        </>
      )}
      <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
    width: 200,
    height: 200,
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  robot: {
    position: "absolute",
    bottom: 5,
    left: 5,
    width: 50,
    height: 58,
  },
  greeting: {
    fontSize: 24,
    color: "#333",
    marginBottom: 10,
  },
  username: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "darkblue",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default HomeScreen;
