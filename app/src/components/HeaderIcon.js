import React from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, { MenuItem } from 'react-native-material-menu';
var { vw, vh, vmin, vmax } = require('react-native-viewport-units');
import AsyncStorageHanlder from '../services/AsyncStorageHanlder';
var asyncStorageHandler = new AsyncStorageHanlder();
import * as GenericMethods from '../common/index';
import * as types from '../redux/actions/types';
import { useDispatch } from 'react-redux';
import { signoutUser, signoutAllUser } from '../redux/actions/userActions';
import * as Constants from '../constants';
import { config } from '../constants/parafaitConfig';
//import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { log } from 'react-native-reanimated';


const msg = 'This action will clear your data';
// const height = responsiveHeight(25); // 25% of total window size
// const width = responsiveWidth(40);
// const { width, height } = Dimensions.get("window");
// console.log(`Window width: ${width}`);
// console.log(`Window height: ${height}`);

const { width, height } = Dimensions.get("window");

// console.log('width', width)
// console.log('OS check', Platform.OS);
// console.log('height', height)
var oscheck = Platform.OS;
const HeaderTitle = () => {
  return (
    // <View  style={{ width:75*vw,flex:1, justifyContent:'center', backgroundColor:'red', alignItems:'flex-start', padding:2}}>
    // <View style={{
    // height, width, 
    //   flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1, 
    // }}
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        ...(Platform.OS === 'ios' ? { height, width } : { flex: 1 }),
      }}
    // style={{
    //   flexDirection: 'row',
    //   justifyContent: 'flex-start',
    //   alignItems: 'center',
    // }}
    >
      {Platform.OS === 'ios' ? (
        <>
          <Image
            source={require('../assets/data/image/BIZINSIGHTS_Header_Logo.png')}
            resizeMode="contain"
            //style={{ width:'90%' , flex:1}}
            style={{ width: 250, height: 50 }}></Image>
          <Text
            style={{
              marginRight: 10 * vw,
              textAlign: 'justify',
              alignSelf: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {' '}
            {config.VERSION_NAME}
          </Text>
        </>
      ) : (
        <>
          <Image
            source={require('../assets/data/image/BIZINSIGHTS_Header_Logo.png')}
            resizeMode="contain"
            //style={{ width:'90%' , flex:1}}
            style={{ width: width > 500 ? 350 : width > 400 ? 250 : width > 350 ? 200 : width > 300 ? 180 : 100 }}></Image>
          <Text

            style={{
              marginRight: 10 * vw,
              textAlign: 'justify',
              alignSelf: 'center',
              fontSize: width > 500 ? 22 : width > 400 ? 21 : width > 350 ? 20 : width > 300 ? 16 : 10,
              fontWeight: 'bold',
            }}>
            {' '}
            {config.VERSION_NAME}
          </Text>
        </>
      )}
    </View >

    //  </View>
  );

  //  <Text style={{ fontSize:2.5*vh, fontWeight:'500' ,color:'white'}}>{Constants.APP_IDENTIFIER}</Text>
};

const HeaderIcon = () => {
  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch(signoutUser());
  };

  const handleSignoutAll = () => {
    dispatch(signoutAllUser());
  };

  _menu = null;

  setMenuRef = (ref) => {
    _menu = ref;
  };

  const signout = () => {
    _menu.hide();
    GenericMethods.showAlertWithCancel(msg, () => handleSignout());
  };

  const signoutAll = () => {
    _menu.hide();
    GenericMethods.showAlertWithCancel(msg, () => handleSignoutAll());
  };

  showMenu = () => {
    _menu.show();
  };

  return (
    <View style={{ paddingRight: 2 * vw }}>
      <Menu
        style={{ width: 250 }}
        ref={setMenuRef}
        button={
          <Text onPress={showMenu}>
            {' '}
            <Icon name="power-sharp" size={vw * 7} color="#000" />
          </Text>
        }>
        <MenuItem textStyle={{ fontSize: 4 * vw }} onPress={signout}>
          Sign out
        </MenuItem>
        <MenuItem textStyle={{ fontSize: 4 * vw }} onPress={signoutAll}>
          Sign out from all devices
        </MenuItem>
        {/* <MenuItem onPress={hideMenu}>Settings</MenuItem> */}
      </Menu>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: width > 500 ? 20 : 16, // Increase font size on larger screens
  },
});
export { HeaderIcon, HeaderTitle };
