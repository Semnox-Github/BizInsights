import React, {Component} from 'react';
import {} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import RegestrationScreen from './src/container/RegestrationScreen';
import NavigationService from './src/lib/NavigationService';
import HomeScreen from './src/container/HomeScreen';
import SplashScreen from './src/container/SplashScreen';

const RootStack = createStackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

  RegestrationScreen: {
    screen: RegestrationScreen,
  },

  HomeScreen: {
    screen: HomeScreen,
  },
});

let Navigation = createAppContainer(RootStack);

class AppContainer extends Component {
  render() {
    return (
      <Navigation
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default AppContainer;
