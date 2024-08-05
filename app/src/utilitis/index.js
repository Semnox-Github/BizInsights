import React from 'react';
import {store} from '../../index';
//import  Utf8 from 'crypto-js/enc-utf8'
const CryptoJS = require('crypto-js');
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';

export const generateDate = () => {
  let date = new Date();
  let dateISO = date.toISOString().split('.')[0] + 'Z';
  //console.log( now.toISOString().split('.')[0]+"Z" );

  return dateISO;
};

export const generateHashCode = (appId, securityCode, generateTime) => {
  let myString = appId + securityCode + generateTime;

  let encodedWord = CryptoJS.enc.Utf8.parse(myString);
  let hashDigest = sha1(encodedWord);
  let hmacDigest = Base64.stringify(hashDigest);

  return hmacDigest;
};

export function generateUUID() {
  const uuid = require('uuid/v1');
  const id = uuid();
  return id;
}

export function fetchBusinessDate() {
  const moment = require('moment');
  let currDate = new Date();
  let currTime = parseInt(moment(currDate).format('HH'));
  let businessStartTime = parseInt(store.getState().dashboard.startTime ?? 6);

  if (currTime < businessStartTime) currDate.setDate(currDate.getDate() - 1);

  let formatedDate = moment(currDate).format('YYYY-MM-DD');
  let formatedTime = moment(currDate).format('hh:mm'); //
  return {formatedDate, formatedTime};
}

export function formatCurrency(currencyFormat) {
  var thousandSeparator = undefined,
    decimalSeparator = undefined,
    decimalScale = undefined;
  const pattern = currencyFormat;
  let regexp = /,|\./g;
  var isDecimal = /^0[0-9].*$/;

  const separators = pattern.match(regexp) ?? [];
  const lastElement = pattern.split(/[,.]+/).reverse()[0];

  if (separators.length == 2) {
    [thousandSeparator, decimalSeparator] = separators;
  } else if (separators.length == 1 && !isDecimal.test(lastElement)) {
    [thousandSeparator, decimalSeparator = undefined] = separators;
  } else {
    [decimalSeparator = undefined, thousandSeparator = undefined] = separators;
  }
  if (decimalSeparator) decimalScale = lastElement?.length ?? undefined;

  return {thousandSeparator, decimalSeparator, decimalScale};
}
