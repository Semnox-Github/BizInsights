import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, BackHandler, Alert } from 'react-native';
import NavigationService from '../lib/NavigationService';
import AsyncStorageHanlder from '../services/AsyncStorageHanlder';
import * as GenericMethods from '../common/index';
import * as types from '../redux/actions/types';
import * as Constants from '../constants';
import { firebase } from "@react-native-firebase/crashlytics";

import {
    initialSetUp,
    setToken,
    setGateway,
    setGuid,
    setDashboard,
    showVerificationCode,
    registerClient,
} from '../redux/actions/splashscreenActions';
import { connect } from 'react-redux';
import { checkForUpdate, checkValidToken } from '../redux/actions/updateAction';
var { vw, vh, vmin, vmax } = require('react-native-viewport-units');
const appstoreURL = 'https://itunes.apple.com/app/id1547246277';
const playStoreURL =
    'https://play.google.com/store/apps/details?id=com.semnox.analyticsdashboardapp';
import { generateUUID } from '../utilitis';
import { store } from '../../index';
import { config } from '../constants/parafaitConfig';

// const clientLastUpdated =
//   store?.getState()?.client?.lastClientUpdated ?? new Date(-1);

var asyncStorageHandler = new AsyncStorageHanlder();

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginId: '',
            password: '',
            isChecked: false,
            guId: null,
            gatewayURL: null,
            isMounted: true,
        };
    }

    gotoHomeScreen() {
        NavigationService.reset({
            index: 0,
            actions: [NavigationService.navActions('HomeScreen')],
        });
    }

    gotoRegestrationScreen() {
        setTimeout(
            () =>
                NavigationService.reset({
                    index: 0,
                    actions: [NavigationService.navActions('RegestrationScreen')],
                }),
            0,
        );
    }

    handleUpdate = () => {
        if (Platform.OS === 'android') {
            Linking.canOpenURL(playStoreURL)
                .then(() => {
                    Linking.openURL(playStoreURL);
                })
                .catch();
        } else if (Platform.OS === 'ios') {
            Linking.canOpenURL(appstoreURL)
                .then(() => Linking.openURL(appstoreURL))
                .catch();
        }
    };

    componentDidMount() {
        const { securityCode, clientGateway, loginToken } = this.props;

        if (securityCode != null) {
            // let clientLastUpdated=this.props?.lastClientUpdated||new Date(-1)
            // if (
            //   clientLastUpdated.toISOString().split('T')[0] !=
            //   new Date().toISOString().split('T')[0]
            // ) {
            //   this.props.checkForUpdate(securityCode);
            // }
            this.props.checkForUpdate(securityCode);
            checkValidToken();
        } else {
            this.gotoRegestrationScreen();
        }
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <View style={styles.SplashScreen_RootView}>
                    <View style={styles.SplashScreen_ChildView}>
                        <Image
                            source={require('../assets/data/image/Splash_Screen_Logo.png')}
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        />
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                width: '100%',
                                height: '100%',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>
                            {/* <Text style={{fontSize: 20}}>{config.VERSION_NAME}</Text> */}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        error: state.ui.error,
        loading: state.ui.loading,
        clientGateway: state.client.clientGateway,
        userDTO: state.user.clientAppUserLoginDTO,
        userId: state.asyncStore.userId,
        securityCode: state.client?.securityCode,
        loginToken: state?.deviceInfo?.token,
        lastClientUpdated: state.client?.lastClientUpdated
    };
};

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor: '#fff',
    },

    SplashScreen_RootView: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        position: 'relative',
        width: '100%',
        height: '100%',
    },

    SplashScreen_ChildView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 10 * vw,
    },
});

export default connect(mapStateToProps, {
    setToken,
    setGuid,
    setGateway,
    setDashboard,
    showVerificationCode,
    registerClient,
    checkForUpdate,
})(SplashScreen);
