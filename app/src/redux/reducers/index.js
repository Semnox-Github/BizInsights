import {combineReducers} from 'redux';
import {client} from './ClientReducer';
import {ui} from './uiReducer';
import {deviceInfo} from './deviceInfoReducer';
import {user} from './userReducer';
import {dashboard} from './dashboardReducer';
import {asyncStore} from './asyncReducer';
import {update} from './updatereducer';

export default combineReducers({
  client: client,
  ui: ui,
  deviceInfo: deviceInfo,
  user: user,
  dashboard: dashboard,
  asyncStore: asyncStore,
  update: update,
});
