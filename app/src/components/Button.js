import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
var {vw, vh, vmin, vmax} = require('react-native-viewport-units');

const Button = ({children, onPress}) => {
  return (
    <TouchableOpacity style={styles.myButton} onPress={onPress}>
      <Text style={styles.myText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  myButton: {
    //borderRadius:4,
    marginHorizontal: 1.2,
    borderWidth: 0.5,
    borderColor: 'black',
    height: 7 * vh,
    width: null,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  myText: {
    alignSelf: 'center',
    fontSize: 4 * vw,
    fontWeight: 'bold',
    color: 'white',
  },
});

export {Button};
