import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {set} from 'react-native-reanimated';

var {vw, vh, vmin, vmax} = require('react-native-viewport-units');

const Checkbox = ({value, onValueChange, tittle}) => {
  // const [isSelected, setSelection] = useState(false);
  // console.log(isSelected)

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={value}
            style={styles.checkbox}
            tintColors={{true: '#595959', false: '#595959'}}
            boxType="square"
            tintColor="#595959"
            onCheckColor="#595959"
            hideBox={true}
            onValueChange={onValueChange}
          />
        </View>
        <Text style={styles.label}>Remember me</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  checkboxContainer: {
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: '#000',
        height: 25,
        width: 25,
        borderRadius: 5,
        marginBottom: vh,
        marginTop: vh,
      },
      android: {
        alignSelf: 'center',
        marginRight: vw,
        // marginBottom: 1 * vw,
        // marginTop: 1 * vw,
        // paddingTop:1*vw,
        // paddingBottom:1*vw
      },
    }),
  },
  checkbox: {
    height: 4 * vw,
    width: 4 * vw,
  },
  label: {
    fontSize: 4 * vw,
    paddingLeft: 1 * vh,
    //paddingBottom:1.4*vh,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        paddingTop: 1.2 * vh,
        fontSize: 1.9 * vh,
      },
      android: {
        // paddingTop: 1 * vh,
      },
    }),
  },
});

export default Checkbox;
