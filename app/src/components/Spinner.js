import React from 'react';
import {
  View,
  ActivityIndicator,
  Modal,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
var {vw, vh, vmin, vmax} = require('react-native-viewport-units');
const {width, height} = Dimensions.get('window');

const Spinner = ({loading}) => {
  const onModalBack = () => {};
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={loading}
      onRequestClose={onModalBack}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} size="small" color="black" />
        </View>
      </View>
    </Modal>
  );
};

 const Loader = (props) => {
  if (!props.isLoading) {
    return null;
  }
  return (
    <View
      style={
        props.fullScreen
          ? styles.fullScreenContainer
          : props.componentScreen
          ? styles.component
          : styles.container
      }>
      <StatusBar barStyle="dark-content" />
      {/* {props.fullScreen || props.componentScreen && ( */}
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator
          size={props.size ? props.size : 'large'}
          color={props.color ? props.color : 'black'}
        />
      </View>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#f2f2f2',
    height: 5 * vh,
    width: 5 * vh,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    position: 'absolute',
    backgroundColor: 'rgba(200,200,200,0)',
    zIndex: 999,
  },
  component: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    top: 50,
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  container: {
    justifyContent: 'center',
  },
  loadingText: {
    alignSelf: 'center',
    color: '#000000',
    marginTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: 99,
    height: '100%',
    width: '100%',
    backgroundColor: '#00000080',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export {Spinner, Loader};
