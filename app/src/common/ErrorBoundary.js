import React, { Component } from 'react';
import { View, WebView, Text } from 'react-native';
import * as GenericAsyncMethods from './AsyncFunctions'

import { UserLogDTO } from '../model/UserLogDTO';
import store from '../../store/'
import { handleExitApplication } from '.';

export default class ErrorBoundary extends Component {


    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }


    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        this.sendErrorDetails(error, errorInfo);
    }

    sendErrorDetails(error, errorInfo) {
        let data = new UserLogDTO({
            Id: -1,
            CustomerId: store.getState().customer.customerDTO.id || -1,
            Controller: '',
            Action: '',
            IsActive: true,
            VariableState: error.stack,
            Message: error.message,
            Uuid: store.getState().deviceInfo.uuid || '',
            SiteId: store.getState().site.selectedSite.siteId || -1,
        });
        
        GenericAsyncMethods.logErrorToServer(data)
            .then(response => {
                try {
                    if (response instanceof
                        Error)
                        throw response;
                    this.props.asyncSuccess();
                    if (response.status) {
                        handleExitApplication();
                    }
                    else
                        throw new Error(response.data);
                }
                catch (error) {
                    //this.props.asyncFailure(error);
                    handleExitApplication();
                }
            })
            .catch((error) => {
                handleExitApplication();
            });
    }


    render() {
        return this.props.children;
    }
}
