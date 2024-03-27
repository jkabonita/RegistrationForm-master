// RegistrationScreen.js

import React from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Image, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import Input from "../components/Input";
import Loader from "../components/Loader";
import robotlogo from "../../img/logo.png";

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [inputs, setInputs] = React.useState({
    studno: "",
    email: "",
    fullname: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    let isValid = true;

    // Validation logic
    if (!inputs.studno) {
      handleError("Please Enter a Student Number", "studno");
      isValid = false;
    }
    if (!inputs.email) {
      handleError("Please Enter an Email Address", "email");
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Please Enter a Valid Email Address", "email");
      isValid = false;
    }
    if (!inputs.fullname) {
      handleError("Please Enter a Full Name", "fullname");
      isValid = false;
    }
    if (!inputs.phone) {
      handleError("Please Enter a Phone Number", "phone");
      isValid = false;
    }
    if (!inputs.password) {
      handleError("Please Enter a Password", "password");
      isValid = false;
    } else if (inputs.password.length < 8) {
      handleError("Minimum Password Length is 8", "password");
      isValid = false;
    }
    if (!inputs.passwordConfirm) {
      handleError("Please Enter Confirm Password", "passwordConfirm");
      isValid = false;
    } else if (inputs.passwordConfirm !== inputs.password) {
      handleError("Password Confirmation does not match", "passwordConfirm");
      isValid = false;
    }

    if (isValid) register();
  };

  const register = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(inputs));
      setLoading(false);
      Alert.alert(
        "Success",
        "User Successfully Created!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("HomeScreen", { userData: inputs }),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
      handleError("An error occurred during registration", "registration");
      setLoading(false);
    }
  };

  const handleOnChange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (text, input) => {
    setErrors(prevState => ({ ...prevState, [input]: text }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.image} source={robotlogo} />
        <Text style={styles.textTitle}>Register</Text>
        <View style={styles.formContainer}>
          <Input
            label="Student Number"
            placeholder="Enter your Student Number"
            onChangeText={(text) => handleOnChange(text, "studno")}
            onFocus={() => handleError(null, "studno")}
            error={errors.studno}
          />
          <Input
            label="Full Name"
            placeholder="Enter your Full Name"
            onChangeText={(text) => handleOnChange(text, "fullname")}
            onFocus={() => handleError(null, "fullname")}
            error={errors.fullname}
          />
          <Input
            label="Phone Number"
            placeholder="Enter your Phone Number"
            onChangeText={(text) => handleOnChange(text, "phone")}
            onFocus={() => handleError(null, "phone")}
            error={errors.phone}
          />
          <Input
            label="Email Address"
            placeholder="Enter your Email Address"
            onChangeText={(text) => handleOnChange(text, "email")}
            onFocus={() => handleError(null, "email")}
            error={errors.email}
          />
          <Input
            label="Password"
            password
            placeholder="Enter your Password"
            onChangeText={(text) => handleOnChange(text, "password")}
            onFocus={() => handleError(null, "password")}
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            password
            placeholder="Confirm your Password"
            onChangeText={(text) => handleOnChange(text, "passwordConfirm")}
            onFocus={() => handleError(null, "passwordConfirm")}
            error={errors.passwordConfirm}
          />
          <Button title="Register" onPress={validate} />
        </View>
      </ScrollView>
      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  textTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    alignSelf: "center",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
});

export default RegistrationScreen;
