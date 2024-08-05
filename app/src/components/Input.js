import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import {Value} from 'react-native-reanimated';

var {vw, vh, vmin, vmax} = require('react-native-viewport-units');
const Input = ({placeholder, value, onChangeText, secureTextEntry}) => {
  return (
    <TextInput
      style={styles.textInput}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#000"
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 0,
    width: '100%',
    height: 5 * vh,
    backgroundColor: '#fff',
    // lineHeight: 4 * vw,
    textAlign: 'center',
    fontSize: 4 * vw,
    color: '#000',
    marginBottom: 0.8 * vh,
    borderWidth: 0.5,
    borderColor: '#000',
    ...Platform.select({
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
});

export {Input};
