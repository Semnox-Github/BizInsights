import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  PlatForm,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Button,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  BackHandler,
  Alert,
  ScrollView,
  Linking,
  AppState,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import {
  getTableauDashboard,
  getBusinessStartTime,
  getTableauToken,
  getSalesDashboard,
  onLoadURL,
  fetchDataFromBackground,
  handleDashboardUpdate,
  selectedDashboardDetails,
  asyncRequest,
  asyncFailure,
  asyncSuccess,
} from '../redux/actions/dashboardActions';
import { ParafaitServer } from '../constants/ParafaitServer';
import { store } from '../../index';
import {
  HeaderIcon,
  HeaderTitle,
  Spinner,
  DashboardActivityCard,
  DashboardCollection,
  Loader,
} from '../components/index';
import { WebView } from 'react-native-webview';
import AsyncStorageHanlder from '../services/AsyncStorageHanlder';
var asyncStorageHandler = new AsyncStorageHanlder();
var { vw, vh, vmin, vmax } = require('react-native-viewport-units');
import * as GenericMethods from '../common/index';
import { handleError } from '../redux/actions/clearErrorActions';
import NavigationService from '../lib/NavigationService';
import * as types from '../redux/actions/types';
import * as Constants from '../constants';
var RNFS = require('react-native-fs');
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import dateFormat, { masks } from 'dateformat';
import { config } from '../constants/parafaitConfig';
import { log } from 'react-native-reanimated';

const { width, height } = Dimensions.get("window");
// console.log('widthInHomeScreen', width);
// const baseScreenWidth = 360;
// const scaleFactor = baseScreenWidth / width;
// calculatedWidth = 432 * scaleFactor;
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const screenSize = Math.sqrt(width * height) / 100;


const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
//console.log('scaleTest', scale(width));

const appstoreURL = 'https://itunes.apple.com/app/id1634566995';
const playStoreURL =
  'https://play.google.com/store/apps/details?id=com.semnox.analyticsdashboardapplite';

///import ?* as  Constants from '../constants'

const INJECTED_JS = `
const style = document.createElement('style');
style.innerHTML = \`
 @media screen and (max-width: 500px) {
    body {
      width: 432px;
      transform: scale(${Dimensions.get('window').width / 432});
      transform-origin: top left;
      margin-bottom:0;
    }
 }
\`;
document.head.appendChild(style);

document.body.style.overflow = 'hidden'; // Disables scrolling
document.body.style.height = 'auto'; // Ensures the body takes up the full viewport height

window.onscroll = function() {
 window.ReactNativeWebView.postMessage(
    JSON.stringify({
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop
    }),
 );
};
`;

const old_INJECTED_JS = `
window.onscroll = function() {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop
    }),     
  )
}`;



class HomeScreen extends Component {

  _isMounted = false;
  webview = null;
  static navigationOptions = {
    headerLeft: () => { },
    gestureEnabled: false,
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTitle: () => <HeaderTitle />,

    headerRight: () => <HeaderIcon />,
  };

  backAction = () => {
    if (this.state.showTodayReport) {
      this.setState({
        showTodayReport: false,
      });
      return true;
    } else if (this.state.showWeekReport) {
      this.setState({
        showWeekReport: false,
      });
      return true;
    } else {
      GenericMethods.showAlertWithCancel(
        Constants.MSG,
        () => BackHandler.exitApp(),
        () => null,
      );
      return true;
    }
  };

  handleUpdate = () => {
    if (Platform.OS === 'android') {
      Linking.canOpenURL(playStoreURL)
        .then(() => {
          Linking.openURL(playStoreURL);
        })
        .catch();
      // Redirect Apple store
    } else if (Platform.OS === 'ios') {
      Linking.canOpenURL(appstoreURL)
        .then(() => Linking.openURL(appstoreURL))
        .catch();
    }
  };

  handleSelection = (id, dbQuery) => {
    this.props.selectedDashboardDetails(id, dbQuery);
    this.setState({ selectedId: id });
  };

  onPress = (ReportId, DBQuery) => {
    this.handleSelection(ReportId, DBQuery);
    if (ReportId != -1) {
      this.setState({
        showHome: false,
        showWeekReport: false,
        showTodayReport: false,
        showWebView: true,
      });
      this.props.getTableauToken(ReportId, DBQuery);
    } else {
      this.setState({
        showHome: true,
        showWebView: false,
      });
      this.props.getSalesDashboard(this.props.userRoleId);
    }
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });

    if (this.props.reportId != -1) {
      this.props.getTableauToken(
        store.getState().dashboard.currentReportId,
        store.getState().dashboard.currentdbQuery,
      );
    }
  };

  onPressSite = (SiteId) => {
    this.setState((prevState) => {
      return {
        selectedSite: prevState.selectedSite != SiteId ? SiteId : null,
      };
    });
  };

  onLoadEnd = () => {
    this.props.onLoadURL();
    this.setState({ refreshing: false });
  };

  renderItem = (item) => {
    const { ReportName, DBQuery, ReportId } = item.item;

    return (
      <TouchableOpacity
        style={
          item.item.ReportId === this.state.selectedId
            ? styles.selected
            : styles.tabButton
        }
        onPress={() => {
          this.onPress(ReportId, DBQuery);
        }}>
        <Text
          style={
            item.item.ReportId === this.state.selectedId
              ? styles.selectedText
              : styles.text
          }>
          {ReportName}
        </Text>
      </TouchableOpacity>
    );
  };

  constructor(props) {
    super(props);
    const isTableauDashboard = Boolean(JSON.parse(config?.ISTABLEUDASHBOARD));
    // Don't call this.setState() here!
    this.state = {
      selected: true,
      SelectedButton: '',
      refreshing: false,
      selectedId: null,
      enablePTR: true,
      update: false,
      dashboard: [],
      updateRequired: false,
      showReport: false,
      showHome: true,
      showTodayReport: false,
      showWeekReport: false,
      showWebView: false,
      showTodayPos: false,
      showWeekPos: false,
      selectedSite: null,
      isTableauDashboard: isTableauDashboard,
      appState: AppState.currentState,
      width: Dimensions.get('window').width
    };
  }
  handleAppChange = (nextAppState) => {
    //  console.log(this._isMounted);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.props.getSalesDashboard(this.props.userRoleId);
    }
    if (this._isMounted) {
      this.setState({ appState: nextAppState });
    }
  };

  componentDidMount() {

    this._isMounted = true;
    AppState.addEventListener('change', this.handleAppChange);

    // Dimensions.addEventListener('change', ({ window }) => {
    //   if (window.width !== this.state.width) {
    //     this.setState({ width: this.state.width });
    //     function calculateWidth() {
    //       const { width } = Dimensions.get("window");
    //       const baseScreenWidth = width; // current screen width
    //       const scaleFactor = baseScreenWidth / width;
    //       calculatedWidth = 432 * scaleFactor;
    //       console.log('calculatedWidth', calculatedWidth);
    //     }
    //   }
    // });

    if (this.props.dashboard.length == 0) {
      this.props.getBusinessStartTime();
      this.props.asyncRequest();
      this.props.getSalesDashboard(this.props.userRoleId);
    } else {
      this.setState({
        dashboard: this.props.dashboard,
      });
      this.props.getBusinessStartTime((showLoader = false));
      this.props.getSalesDashboard(this.props.userRoleId);
      this.props.selectedDashboardDetails(
        this.props.dashboard[0].ReportId,
        this.props.dashboard[0].DBQuery,
      );
    }

    if (this.props.deprecated == 'M') {
      Alert.alert(
        Constants.UPDATE_TITLE,
        Constants.UPDATE_MESSAGE_ONE,
        [
          {
            text: 'Ok',
            onPress: () => {
              BackHandler.exitApp();
              this.handleUpdate();
            },
          },
        ],
        { cancelable: false },
      );
    } else if (this.props.deprecated == 'O') {
      Alert.alert(
        Constants.UPDATE_TITLE,
        Constants.UPDATE_MESSAGE_TWO,
        [
          {
            text: 'Later',
            onPress: () => {
              // console.log('Cancel Pressed');
              this.state.update = false;
            },
          },
          {
            text: 'Ok',
            onPress: () => {
              BackHandler.exitApp();
              //Linking.openURL('https://play.google.com/store/apps/details?id=com.parafait.dashboardapp')
              this.handleUpdate();
            },
          },
        ],
        { cancelable: false },
      );
    }

    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    // console.log('Hii');
    this._isMounted = false;
    AppState.removeEventListener('change', this.handleAppChange);

    Dimensions.removeEventListener('change');

    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.state.selectedId != this.props?.reportId ||
      this.state.dashboard.length != this.props.dashboard.length
    ) {
      this.setState({
        selectedId: this.props.reportId,
        selected: false,
        dashboard: this.props.dashboard,
      });
    }
  }

  handleRestart = () => {
    this.props.handleError();
    store.dispatch({ type: types.RESET_UI });
    store.dispatch({ type: types.CLEAR_TOKEN });
    store.dispatch({ type: types.SET_TOKEN, payload: null });
    asyncStorageHandler.setItem(Constants.LOGIN_TOKEN, null);

    NavigationService.reset({
      index: 0,
      actions: [NavigationService.navActions('SplashScreen')],
    });
  };

  renderLoader = () => {
    if (this.props?.loading && !this.state?.refreshing) {
      // return <Loader isLoading={true} fullScreen={true} />
      return (
        <Progress.Bar
          indeterminate={true}
          width={500}
          animationType="timing"
          style={{ borderRadius: 0, width: '100%' }}
        />
      );
    }
    if (this.props?.error) {
      if (this.props?.errorCode != ParafaitServer.ERROR_TYPES.NONE) {
        // console.log('errro', this.props?.errorCode);
        switch (this.props?.errorCode) {
          case ParafaitServer.ERROR_TYPES.BAD_REQUEST:
            GenericMethods.showAlertWithOk(this?.props?.error?.message, () =>
              this.props.handleError(),
            );
            break;
          case ParafaitServer.ERROR_TYPES.REQUEST_TIMEOUT:
            GenericMethods.showErrorAlertWithOk(
              Constants.UNKNOWN_ERROR_MESSAGE,
              () => () => this.handleRestart(),
            );
            break;
          case ParafaitServer.ERROR_TYPES.UNAUTHORIZED:
            // GenericMethods.showErrorAlertWithRestart(Constants.SESSION_EXPIRE_MESSAGE, ()=>this.handleRestart());
            GenericMethods.showErrorAlertWithRestart(
              Constants.SESSION_EXPIRE_MESSAGE,
              () => this.handleRestart(),
            );
            break;
          case ParafaitServer.ERROR_TYPES.USER_DEFINED_ALERT:
            GenericMethods.showAlertWithOk(
              Constants.DASHBOARD_NOTFOUND_ERROR,
              () => this.props.handleError(),
            );
            break;
          case ParafaitServer.ERROR_TYPES.FORBIDDEN:
            GenericMethods.showAlertWithOk(this.props?.error?.message, () =>
              this.props.handleError(),
            );
            break;
          case ParafaitServer.ERROR_TYPES.NONE:
            GenericMethods.showAlertWithOk(this.props?.error?.message, () =>
              this.props.handleError(),
            );
            break;
          case ParafaitServer.ERROR_TYPES.NOT_FOUND:
            GenericMethods.showAlertWithOk(this.props?.error?.message, () =>
              this.props.handleError(),
            );
            break;
          default:
            GenericMethods.showErrorAlertWithRestart(
              //  console.log('errorHere'),
              Constants.UNKNOWN_ERROR_MESSAGE,
              () => this.handleRestart(),
            );
        }
      }
    }
  };

  onMessage = (e) => {
    JSON.parse(e.nativeEvent.data);

    if (
      JSON.parse(e.nativeEvent.data).scrollTop === 0 &&
      !this.state.enablePTR
    ) {
      this.setState({ enablePTR: true });
    } else if (
      JSON.parse(e.nativeEvent.data).scrollTop > 10 &&
      this.state.enablePTR
    ) {
      this.setState({ enablePTR: false, refreshing: false });
    }
  };

  onTodayLayoutPress = () => {
    {
      this.setState({
        showTodayReport: true,
      });
    }
  };

  onWeekLayoutPress = () => {
    this.setState({
      showWeekReport: true,
    });
  };

  render() {
    const {
      CollectionToday,
      GamePlayToday,
      GamePlayWeek,
      CollectionWeek,
    } = this.props?.totalCollection;
    const { thousandSeparator, decimalSeparator, decimalScale } = this.props;
    //console.log('response *****', this.props.userRoleId);
    //console.log('webURI', this.props.webview);

    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          flexDirection: 'column',
          height: '100%',
        }}>
        <View
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'space-between',
            paddingLeft: vh,
          }}>
          {this.state.dashboard.length ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={this.state.dashboard}
              extraData={this.state.selectedId}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.ReportName}
            />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          {this.renderLoader()}
          <ScrollView
            scrollEnabled={false}
            nestedScrollEnabled
            automaticallyAdjustContentInsets={true}
            contentContainerStyle={{
              // flex: 1,
              height: '100%',
            }}
            refreshControl={
              this.state.isTableauDashboard ? (
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                  enabled={
                    this.state.showWebView
                      ? Platform.OS === 'ios'
                        ? true
                        : this.state.enablePTR
                      : false
                  }
                />
              ) : undefined
            }>
            {this.state.showHome ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  {this.state.showTodayReport || this.state.showWeekReport ? (
                    <Icon
                      onPress={() =>
                        this.setState({
                          showTodayReport: false,
                          showWeekReport: false,
                          //showHome:true
                        })
                      }
                      name="arrow-back-circle-sharp"
                      size={vw * 9}
                      color="#000"
                      style={{
                        alignSelf: 'center',
                        paddingTop: 10,
                        paddingLeft: 5,
                      }}
                    />
                  ) : null}
                  <Text
                    style={{
                      fontSize: 3.5 * vw,
                      alignSelf: 'center',
                      paddingTop: 10,
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}>
                    {this.props.currentDate}
                  </Text>
                  <Icon
                    onPress={() => {
                      this.props.asyncRequest();
                      this.props.getSalesDashboard(this.props.userRoleId);
                    }}
                    name="refresh-circle"
                    size={vw * 9}
                    color="#000"
                    style={{
                      alignSelf: 'center',
                      paddingTop: 10,
                      paddingRight: 5,
                    }}
                  />
                </View>
                {/* <Text
                style={{
                  fontSize: 14,
                  alignSelf: 'center',
                  paddingTop: 10,
                  paddingLeft: 10,
                  justifyContent: 'space-evenly',
                }}>
                {dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}
               
              </Text> */}
              </View>
            ) : null}

            {this.state.showWebView ? (
              // <View style={{ flex: 1, backgroundColor: 'red', alignContent: 'center' }}>
              <WebView
                scalesPageToFit={false}
                nestedscrollEnabled
                source={{ uri: this.props.webview }}
                onLoadEnd={this.onLoadEnd}
                style={{
                  padding: 10,
                  backgroundColor: 'transparent',
                  flex: 1,
                  height: 213 * vh,
                  marginBottom: 20,


                }}
                javaScriptEnabled={true}
                ref={(b) => (this._bridge = b)}
                onMessage={(event) => this.onMessage(event)}
                injectedJavaScript={(this.state.isTableauDashboard) ? old_INJECTED_JS : INJECTED_JS}
                scrollEnabled={false}

              />
              // </View>
            ) : !this.state.showTodayReport && !this.state.showWeekReport ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 5,
                  }}>
                  <DashboardActivityCard
                    decimalScale={decimalScale}
                    thousandSeparator={thousandSeparator}
                    decimalSeparator={decimalSeparator}
                    currencySymbol={this.props.currencySymbol || '$'}
                    collectionAmt={CollectionToday}
                    consumptionAmt={GamePlayToday}
                    collectionText={Constants.COLLECTION}
                    consumptionText={Constants.CONSUMPTION}
                    cardTitle={Constants.TODAY}
                    onPress={this.onTodayLayoutPress}
                  />
                  <DashboardActivityCard
                    decimalScale={decimalScale}
                    thousandSeparator={thousandSeparator}
                    decimalSeparator={decimalSeparator}
                    currencySymbol={this.props.currencySymbol || '$'}
                    collectionAmt={CollectionWeek}
                    consumptionAmt={GamePlayWeek}
                    collectionText={Constants.COLLECTION}
                    consumptionText={Constants.CONSUMPTION}
                    cardTitle={Constants.WEEK}
                    onPress={this.onWeekLayoutPress}
                  />
                </View>
              </View>
            ) : this.state.showTodayReport ? (
              <DashboardCollection
                decimalScale={decimalScale}
                thousandSeparator={thousandSeparator}
                decimalSeparator={decimalSeparator}
                currencySymbol={this.props.currencySymbol || '$'}
                siteList={this.props.todayCollectionList}
                onPress={this.onPressSite}
                siteId={this.state.selectedSite}
                pastCollectionText={Constants.YESTERDAY}
                currentCollectionText={Constants.CURRENT_DAY}
              />
            ) : this.state.showWeekReport ? (
              <DashboardCollection
                decimalScale={decimalScale}
                thousandSeparator={thousandSeparator}
                decimalSeparator={decimalSeparator}
                currencySymbol={this.props.currencySymbol || '$'}
                siteList={this.props.weeklyCollectionList}
                onPress={this.onPressSite}
                siteId={this.state.selectedSite}
                pastCollectionText={Constants.LAST_WEEK}
                currentCollectionText={Constants.THIS_WEEK}
              />
            ) : null}
          </ScrollView>
        </View >
      </View >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dashboard: state.dashboard.dashboardDTO,
    sartTime: state.dashboard.startTime,
    url: state.dashboard.dbQuery,
    webview: state.dashboard.webURL,
    reportId: state.dashboard.reportId,
    reportName: state.dashboard.reportName,
    dbQuery: state.dashboard.dbQuery,
    error: state.ui.error,
    loading: state.ui.loading,
    clientGateway: state.client.clientGateway,
    userDTO: state.user.clientAppUserLoginDTO,
    currencySymbol: state.user.defaultConfig.currencySymbol,
    guId: state.user.deviceGUID,
    errorCode: state.ui.errorCode,
    clientDTO: state.client.clientDTO,
    deprecated: state.client.deprecated,
    updateRequired: state.dashboard.updateDashboard,
    totalCollection: state.dashboard.totalCollection,
    siteList: state.dashboard.siteList,
    currentDate: state.dashboard.currentDate,
    todayCollectionList: state.dashboard.todayCollectionList,
    weeklyCollectionList: state.dashboard.weeklyCollectionList,
    lastReportFetchTime: state.dashboard.lastReportFetchTime,
    thousandSeparator: state.user.defaultConfig.thousandSeparator,
    decimalSeparator: state.user.defaultConfig.decimalSeparator,
    decimalScale: state.user.defaultConfig.decimalScale,
    userRoleId: state.user.userRoleId,
  };
};

const styles = StyleSheet.create({
  tabButton: {
    borderColor: '#808080',
    borderWidth: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0.9 * vh,
    height: 3.5 * vh,
    marginVertical: 0.5 * vh,
    borderRadius: 2,

    // flex:1,
  },
  selected: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: vh,
    height: 3.5 * vh,
    marginVertical: 0.5 * vh,
    borderRadius: 2,
    borderColor: 'orange',
    borderWidth: 2,
  },

  text: {
    textAlign: 'center',
    fontSize: (vw * vh) / 2.2,
    paddingHorizontal: vh,
  },

  selectedText: {
    textAlign: 'center',
    fontSize: (vw * vh) / 2.3,
    paddingHorizontal: vh,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    marginTop: 10 || 0,
  },
  item: {
    padding: 5,
    flex: 1,
    marginVertical: 5,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 15,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },

  flatListContainer: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 0,
    justifyContent: 'space-evenly',
    backgroundColor: '#C0C0C0',
  },

  siteText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  siteCollectionView: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 5,
    alignItems: 'center',

    backgroundColor: '#FFFAFA',
  },
  siteCollectionText: { fontSize: 20, color: '#1E90FF', fontWeight: 'bold' },

  siteConsumptionText: { fontSize: 14 },

  posMachineContainer: {
    flex: 1,
    paddingTop: 2,
    marginHorizontal: 2,
    justifyContent: 'space-evenly',
    backgroundColor: '#303030',
  },

  posMachineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8F8F8',
  },

  posCollectionView: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 2,
    alignItems: 'center',

    backgroundColor: '#FFFAFA',
  },
});

export default connect(mapStateToProps, {
  getTableauDashboard,
  selectedDashboardDetails,
  getSalesDashboard,
  handleError,
  getBusinessStartTime,
  getTableauToken,
  onLoadURL,
  handleDashboardUpdate,
  asyncFailure,
  asyncRequest,
  asyncSuccess,
})(HomeScreen);
