// import React, { Component} from 'react';
// import { Container, Header, Left, Body, Right, Button, Title } from 'native-base';
// import {View, Text,Alert, Image, ImageBackground} from 'react-native'
// import  Icon from 'react-native-vector-icons/Ionicons'
// import Menu, { MenuItem} from 'react-native-material-menu';
// var {vw, vh, vmin, vmax} = require('react-native-viewport-units');
// import AsyncStorageHanlder from '../services/AsyncStorageHanlder'
// var asyncStorageHandler=new AsyncStorageHanlder();
// import * as GenericMethods from '../common/index'
// import { useDispatch } from 'react-redux'
// import {signoutUser , signoutAllUser} from '../redux/actions/userActions'
// import * as  Constants from '../constants'






// export default class NavHeader extends Component {
//   render() {
//     return (
//       <Container>
//         <Header>
//           <Left>
//             <Button transparent>
//               <Icon name='arrow-back' />
//             </Button>
//           </Left>
//           <Body>
//             <View  style={{ flex:1}}>
//                 <Image
//                 source={require('../assets/image/BIZINSIGHTS_Header_Logo.png')}
//                 resizeMode="contain"
//                 style={{ width:'90%' , flex:1}}
                
//                 />
//             </View>
//           </Body>
//           <Right>
//            {HeaderIcon()}
//           </Right>
//         </Header>
//       </Container>
//     );
//   }
// }






// const HeaderIcon=()=>


// {
//   const dispatch = useDispatch()

//   const handleSignout =()=>
//   {
//     dispatch(
//       signoutUser()
      
//     );
//   }

//   const handleSignoutAll =()=>
//   {
//     dispatch(
//       signoutAllUser()
      
//     );
//   }

//      _menu = null;
 
//     setMenuRef = ref => {
//       _menu = ref;
//     };
   
//     const  signout= () => {
//       _menu.hide();
//       GenericMethods.showAlertWithCancel(Constants.DATA_CLEAR_MESSAGE, ()=>handleSignout())
//     };


//     const  signoutAll= () => {
//       _menu.hide();
//       GenericMethods.showAlertWithCancel(Constants.DATA_CLEAR_MESSAGE,()=>handleSignoutAll())
//     };
   
//     showMenu = () => {
//       _menu.show();
      
//     };
   
   
//     return(
//       <View  style={{paddingRight:5*vw}}>
//         <Menu
//             ref={setMenuRef}
//             button={<Text onPress={showMenu}> <Icon name='power-sharp'   size={vw*7} color='#000' /></Text>}
//         >
//             <MenuItem  onPress={signout}>Sign out</MenuItem>
//             <MenuItem onPress={signoutAll}>Sign out from all devices</MenuItem>
//             {/* <MenuItem onPress={hideMenu}>Settings</MenuItem> */}
//         </Menu>
//      </View>
        
        
       
//     )
// }