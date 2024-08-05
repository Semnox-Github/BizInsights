import { Linking, Alert, BackHandler } from 'react-native';
import * as types from './types';
import ServiceHandler from '../../services/APIHandler';
import * as Constants from '../../constants';
import AsyncStorageHanlder from '../../services/AsyncStorageHanlder';
import { ClientAppVersionMappingDTO } from '../../models/clientDTO';
import { ParafaitServer } from '../../constants/ParafaitServer';
import { generateDate, generateHashCode } from '../../utilitis';
import { authenticateUser } from './userActions';
import { config } from '../../constants/parafaitConfig';

var asyncStorageHandler = new AsyncStorageHanlder();

export const getClientDetail = (userId, password, securitycode) => {
  return (dispatch, getState) => {

    var securityCode = securitycode.slice(-2);
    const appId = config.APP_ID;
    const releaseNumber = config.VERSION;

    const currenntTime = generateDate();
    const hashedVal = generateHashCode(
      appId,
      securitycode,
      currenntTime,
    );


    dispatch({ type: types.FETCH_CLIENT_DETAILS_REQUEST });

    ServiceHandler.post({
      url: Constants.CLIENT_APP_VERSION,
      headers: {
        queryParameters: {
          appId: appId,
          buildNumber: releaseNumber,
          generatedTime: currenntTime,
          securityCode: securityCode,
        },
      },
      data: { codeHash: hashedVal },
      timeout: ParafaitServer.DEFAULT_TIMEOUT,
    })
      .then((response) => {
        try {
          if (response instanceof Error) throw response;
          if (response.statusCode === 200) {
            //console.log('finalValidationCode', securitycode);
            asyncStorageHandler.setItem(Constants.SET_SHOW_VERIFICATION_CODE, securitycode)
            dispatch(
              setClientData(
                new ClientAppVersionMappingDTO(response.data),
                userId,
                password,
                securitycode,
              ),
            );
          } else {
            // console.log('error123', response);

            dispatch({
              type: types.FETCH_CLIENT_DETAILS_FAILURE,
              payload: new Error(
                response?.data || Constants.UNKNOWN_ERROR_MESSAGE,
              ),
            });
          }
        } catch (error) {
          //console.log('error12', error);
          dispatch({ type: types.FETCH_CLIENT_DETAILS_FAILURE, payload: error });
        }
      })
      .catch((error) => {
        // console.log('error2', error);
        dispatch({ type: types.FETCH_CLIENT_DETAILS_FAILURE, payload: error });
      });
  };
};

export function setClientData(clientData, userId, password, securityCode) {
  return (dispatch, getState) => {
    asyncStorageHandler.setItem(Constants.CLIENT_DTO, clientData);
    asyncStorageHandler.setItem(Constants.GATEWAY_URL, clientData.GateWayURL); //clientData.GateWayURL
    // console.log('clientDTOcheck', clientData);
    dispatch({ type: types.FETCH_CLIENT_DETAILS_SUCCESS, payload: clientData });
    dispatch({ type: types.SET_CLIENT_GATEWAY, payload: clientData.GateWayURL }); //clientData.GateWayURL
    dispatch({ type: types.SET_SECURITY_CODE, payload: securityCode });
    //  console.log('chceksecurity', securityCode);

    dispatch(authenticateUser(userId, password));
  };
}
