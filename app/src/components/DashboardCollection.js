import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import * as Constants from '../constants';
var { vw, vh, vmin, vmax } = require('react-native-viewport-units');
import NumberFormat from 'react-number-format';

const DashboardCollection = ({
  thousandSeparator,
  decimalSeparator,
  currencySymbol,
  siteList,
  onPress,
  siteId,
  pastCollectionText,
  currentCollectionText,
  decimalScale,
}) => {
  const renderPosMachines = ({ item }) => {
    const {
      PosMachine,
      PresentPosCollection,
      PastPosCollection,
      PresentPosConsumption,
      PreviousPosConsumption,
      PosCollectionToday,
      CollectionPreviousDay,
      CollectionWeek,
      CollectionPreviousWeek,
    } = item;
    return (
      <View style={styles.posMachineContainer}>
        <Text style={styles.posMachineText}>{PosMachine}</Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={[styles.posCollectionView, { backgroundColor: '#B0B0B0' }]}>
            {/* <Text style={[styles.siteCollectionText, {color: '#F8F8F8'}]}>
              {currencySymbol} {PastPosCollection}
            </Text> */}
            <NumberFormat
              value={PastPosCollection}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              decimalScale={decimalScale}
              prefix={currencySymbol}
              renderText={(value) => (
                <Text style={[styles.siteCollectionText, { color: '#F8F8F8' }]}>
                  {value}
                </Text>
              )}
            />
            <Text style={[styles.siteConsumptionText, { color: '#F8F8F8' }]}>
              {Constants.COLLECTION}
            </Text>
          </View>
          <View
            style={[styles.posCollectionView, { backgroundColor: '#909090' }]}>
            {/* <Text style={[styles.siteCollectionText, {color: '#F8F8F8'}]}>
              {PresentPosCollection}
            </Text> */}
            <NumberFormat
              value={PresentPosCollection}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              decimalScale={decimalScale}
              prefix={currencySymbol}
              renderText={(value) => (
                <Text style={[styles.siteCollectionText, { color: '#F8F8F8' }]}>
                  {value}
                </Text>
              )}
            />
            <Text style={[styles.siteConsumptionText, { color: '#F8F8F8' }]}>
              {Constants.COLLECTION}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderItem = ({ item, onPress, siteId }) => {
    const {
      PastCollection,
      PresentCollection,
      PresentConsumption,
      PastConsumption,
      CollectionWeek,
      GamePlayPreviousDay,
      GamePlayPreviousWeek,
      GamePlayToday,
      GamePlayWeek,
      SiteId,
      SiteName,
      PosCollections,
    } = item;

    return (
      <View style={styles.flatListContainer}>
        <Text style={styles.siteText}>{SiteName}</Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => onPress(SiteId)}>
          <View style={[styles.siteCollectionView, { flex: 1 }]}>
            {/* <Text style={styles.siteCollectionText}>
              {currencySymbol} {PastCollection}
            </Text> */}
            <NumberFormat
              value={PastCollection}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              decimalScale={decimalScale}
              prefix={currencySymbol}
              renderText={(value) => (
                <Text style={styles.siteCollectionText}>{value}</Text>
              )}
            />
            <Text style={styles.siteConsumptionText}>
              {Constants.COLLECTION}
            </Text>
            <View style={{ margin: 2.5 }}></View>
            <NumberFormat
              value={PastConsumption} //PastConsumption
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              decimalScale={decimalScale}
              // prefix={currencySymbol}
              renderText={(value) => (
                <Text style={styles.siteCollectionText}>{value}</Text>
              )}
            />
            {/* <Text style={styles.siteCollectionText}>{PastConsumption}</Text> */}
            <Text style={styles.siteConsumptionText}>
              {Constants.CONSUMPTION}
            </Text>
          </View>
          <View
            style={[
              styles.siteCollectionView,
              { backgroundColor: '#DCDCDC', flex: 1 },
            ]}>
            {/* <Text style={styles.siteCollectionText}>
              {currencySymbol} {PresentCollection}
            </Text> */}
            <NumberFormat
              value={PresentCollection}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              decimalScale={decimalScale}
              prefix={currencySymbol}
              renderText={(value) => (
                <Text style={styles.siteCollectionText}>{value}</Text>
              )}
            />
            <Text style={styles.siteConsumptionText}>
              {Constants.COLLECTION}
            </Text>
            <View style={{ margin: 2.5 }}></View>
            <NumberFormat
              value={PresentConsumption}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              decimalScale={decimalScale}
              // prefix={currencySymbol}
              renderText={(value) => (
                <Text style={styles.siteCollectionText}>{value}</Text>
              )}
            />
            {/* <Text style={styles.siteCollectionText}>{PresentConsumption}</Text> */}
            <Text style={styles.siteConsumptionText}>
              {Constants.CONSUMPTION}
            </Text>
          </View>
        </TouchableOpacity>
        {PosCollections?.length > 0 && siteId == SiteId ? (
          <View>
            <FlatList
              data={PosCollections}
              renderItem={renderPosMachines}
              keyExtractor={(item) => item.PosMachine.toString()}
            />
          </View>
        ) : null}
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#C0C0C0' }}>
      <View
        style={[
          styles.siteCollectionView,
          { backgroundColor: 'grey', flexDirection: 'row' },
        ]}>
        <View
          style={{
            flex: 1,
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: 'bold',
              alignSelf: 'center',
              //justifyContent: 'space-evenly',

              // alignItems: 'center',
              // justifyContent: 'center',
            }}>
            {pastCollectionText}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              flex: 1,
              fontSize: 16,
              color: 'white',
              fontWeight: 'bold',
            }}>
            {currentCollectionText}
          </Text>
        </View>
      </View>
      <FlatList
        nestedScrollEnabled
        data={siteList}
        renderItem={({ item }) => (
          <RenderItem item={item} onPress={onPress} siteId={siteId} />
        )}
        //   renderItem={renderListItem}
        keyExtractor={(item) => item.SiteId.toString()}
      />
    </View>
  );
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
    //padding: 5,
    paddingHorizontal: 0,
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: '#C0C0C0',
  },

  siteText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 5,
  },

  siteCollectionView: {
    // flex:1,
    //justifyContent: 'center',
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
    paddingLeft: 5,
  },

  posCollectionView: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 2,
    alignItems: 'center',

    backgroundColor: '#FFFAFA',
  },
});

export { DashboardCollection };
