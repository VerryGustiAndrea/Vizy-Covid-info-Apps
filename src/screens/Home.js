import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
navigator.geolocation = require('@react-native-community/geolocation');
import MapView, {Marker, Circle, Callout} from 'react-native-maps';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Modal, {SlideAnimation, ModalContent} from 'react-native-modals';

const COVID_WORLD = 'https://corona.lmao.ninja/all';
const COVID_COUNTRY = 'https://corona.lmao.ninja/countries?sort=country';

const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0,
  longitudeDelta: 2.05,
};

const convertTime = time => {
  let d = new Date(time);
  let c = new Date();
  let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
  result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  if (c.getDay() !== d.getDay()) {
    result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
  }
  return result;
};

export default class Maps extends Component {
  constructor() {
    super();
    this.state = {
      visible1: false,
      currentPosition: initialState,
      dataCountry: {
        cases: 0,
        deaths: 0,
        recovered: 0,
        updated: 0,
        active: 0,
        affectedCountries: 0,
        flag: 'default',
      },
      listDataCountry: [],
      countryInfo: [],
    };
  }

  getCovidAll = async () => {
    await axios.get(COVID_WORLD).then(res => {
      let dataCountry = res.data;
      //   console.warn(dataCountry);
      this.setState({dataCountry});
    });
  };

  getCovidCountry = async () => {
    await axios.get(COVID_COUNTRY).then(res => {
      const listDataCountry = res.data;
      //   console.warn(listDataCountry);
      this.setState({listDataCountry});
    });
  };

  getcoordinate = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const {longitude, latitude} = position.coords;
        let data = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0,
          longitudeDelta: 8.05,
        };
        // console.warn(data);
        this.setState({
          currentPosition: data,
        });
        // console.warn(longitude, latitude);
      },
      error => alert(error.message),
      {timeout: 20000, maximumAge: 1000},
    );
  };

  filterCountry = data => {
    // console.warn(data);
    let dataCountry = this.state.listDataCountry.filter(a => {
      return a.country.toLowerCase().indexOf(data.toLowerCase()) !== -1;
    });
    // console.warn(dataCountry[0]);
    let dataCountryNew = dataCountry[0];
    this.setState({dataCountry: dataCountryNew});
    () => this.countryInfo();
  };

  countryInfo = () => {
    let data = this.state.dataCountry.countryInfo;
    {
      this.state.dataCountry.country === undefined
        ? console.warn('country check null')
        : console.warn('country check find'),
        this.setState({countryInfo: data});
    }
  };

  componentDidMount() {
    this.getcoordinate();
    this.getCovidAll();
    this.getCovidCountry();
    this.countryInfo();
  }

  render() {
    return this.state.currentPosition.latitude ? (
      //  this.state.currentPosition.latitude ?
      /* <StatusBar translucent backgroundColor="transparent" /> */
      <>
        <StatusBar backgroundColor="#3E503C" />
        <MapView
          ref={ref => (this.myMap = ref)}
          style={styles.map}
          // showsTraffic
          // showsMyLocationButton
          // showsUserLocation
          mapType={'satellite'}
          showsCompass={true}
          initialRegion={this.state.currentPosition}>
          <Marker
            style={styles.marker}
            coordinate={this.state.currentPosition}
            onPress={() => {
              // this.setState({chatInfo: ''});
              let datax = {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0,
                longitudeDelta: 4.05,
              };
              this.setState({currentPosition: datax});
              // this.myMap.fitToCoordinates([this.state.currentPosition], {
              //   edgePadding: {top: 500, right: 50, bottom: 50, left: 50},
              //   //   animated: true,
              // });
            }}></Marker>

          {this.state.listDataCountry.map(e => {
            return (
              <Marker
                style={styles.marker}
                coordinate={{
                  latitude: e.countryInfo.lat,
                  longitude: e.countryInfo.long,
                  latitudeDelta: 0,
                  longitudeDelta: 0.05,
                }}
                onPress={() => {
                  let data = {
                    name: e.name,
                    phone: e.phone,
                  };
                  this.setState({chatInfo: data});
                  this.setState({visible: true});
                  this.myMap.fitToCoordinates(
                    [
                      {
                        latitude: e.latitude,
                        longitude: e.longitude,
                        latitudeDelta: 0,
                        longitudeDelta: 0.05,
                      },
                    ],
                    {
                      edgePadding: {
                        top: 50,
                        right: 50,
                        bottom: 1400,
                        left: 50,
                      },
                      animated: true,
                    },
                  );
                }}>
                <Image
                  style={{
                    marginTop: '100%',
                    width: '100%',
                    height: '45%',
                    borderRadius: 50,
                    borderWidth: 5,
                    borderColor: '#A5EACF',
                  }}
                  source={{
                    uri: e.pict,
                  }}
                />
              </Marker>
            );
          })}
        </MapView>
        {/* {console.warn(this.state.countryInfo)} */}
        <Modal
          style={{
            paddingTop: 660,
            borderRadius: 50,
          }}
          transparent={true}
          visible={this.state.visible1}
          modalAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }
          onTouchOutside={() => {
            this.setState({visible1: false});
          }}>
          <View
            style={{
              // paddingTop: '50%',

              height: 180,
              width: 370,
              top: 0,
              // paddingHorizontal: 40,
              backgroundColor: '#fff',
            }}>
            {this.state.dataCountry.country === undefined ? (
              <>
                <View
                  style={{
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    height: '25%',
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 25,
                  }}>
                  <View
                    style={{
                      top: '12%',
                      left: '10%',
                      width: '40%',
                    }}>
                    <Text
                      style={{
                        left: '-4%',
                        width: 150,
                        textAlign: 'center',
                        top: '5.5%',
                        fontSize: 14,
                        color: '#7d887a',
                        fontStyle: 'italic',
                      }}>
                      Active
                    </Text>
                    <View
                      style={{
                        top: '6%',
                        width: '100%',
                        height: '100%',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          left: '-4%',
                          top: '50%',
                          textAlign: 'center',
                          color: '#f8ad1e',
                          width: 150,
                          height: '100%',
                          fontSize: 20,
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                        }}>
                        {this.state.dataCountry.active}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      top: '12%',
                      left: '100%',
                      width: '40%',
                    }}>
                    <Text
                      style={{
                        left: '-4%',
                        width: 150,
                        textAlign: 'center',
                        top: '5.5%',
                        fontSize: 14,
                        color: '#7d887a',
                        fontStyle: 'italic',
                      }}>
                      Affected Countries
                    </Text>
                    <View
                      style={{
                        top: '6%',
                        width: '100%',
                        height: '100%',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          left: '-4%',
                          top: '50%',
                          textAlign: 'center',
                          color: '#B11E31',
                          width: 150,
                          height: '100%',
                          fontSize: 20,
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                        }}>
                        {this.state.dataCountry.affectedCountries}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{top: '-25%'}}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: '16%',
                      height: '57%',
                    }}
                    source={{
                      uri:
                        'https://cdn.iconscout.com/icon/premium/png-256-thumb/virus-78-613107.png',
                    }}
                  />
                </View>
                <View style={{top: '50%'}}>
                  <Text
                    style={{
                      //   height: '100%',
                      //   width: '100%',
                      textAlign: 'center',
                      fontSize: 8,
                    }}>
                    Data Updated at{' '}
                    {convertTime(this.state.dataCountry.updated)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* {console.warn(this.state.countryInfo)} */}
                <View
                  style={{
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    height: '25%',
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 25,
                  }}>
                  <View
                    style={{
                      top: '12%',
                      left: '10%',
                      width: '40%',
                    }}>
                    <Text
                      style={{
                        left: '-4%',
                        width: 150,
                        textAlign: 'center',
                        top: '5.5%',
                        fontSize: 14,
                        color: '#7d887a',
                        fontStyle: 'italic',
                      }}>
                      Today Cases
                    </Text>
                    <View
                      style={{
                        top: '6%',
                        width: '100%',
                        height: '100%',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          left: '-4%',
                          top: '50%',
                          textAlign: 'center',
                          color: '#f8ad1e',
                          width: 150,
                          height: '100%',
                          fontSize: 20,
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                        }}>
                        {this.state.dataCountry.todayCases}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      top: '12%',
                      left: '100%',
                      width: '40%',
                    }}>
                    <Text
                      style={{
                        left: '-4%',
                        width: 150,
                        textAlign: 'center',
                        top: '5.5%',
                        fontSize: 14,
                        color: '#7d887a',
                        fontStyle: 'italic',
                      }}>
                      Today Deaths
                    </Text>
                    <View
                      style={{
                        top: '6%',
                        width: '100%',
                        height: '100%',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          left: '-4%',
                          top: '50%',
                          textAlign: 'center',
                          color: '#B11E31',
                          width: 150,
                          height: '100%',
                          fontSize: 20,
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                        }}>
                        {this.state.dataCountry.todayDeaths}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{top: '-25%'}}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: '16%',
                      height: '57%',
                    }}
                    source={{
                      uri:
                        'https://cdn.iconscout.com/icon/premium/png-256-thumb/virus-78-613107.png',
                    }}
                  />
                </View>
                <View style={{top: '50%'}}>
                  <Text
                    style={{
                      //   height: '100%',
                      //   width: '100%',
                      textAlign: 'center',
                      fontSize: 8,
                    }}>
                    Data Updated at{' '}
                    {convertTime(this.state.dataCountry.updated)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </Modal>

        <View
          style={{
            backgroundColor: '#f0f0f0',

            height: '100%',
            weight: '100%',
            top: '-6%',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <Text
            style={{
              top: '2%',
              fontSize: 16,
              alignSelf: 'center',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}>
            Covid-19 Virus Cases Data
          </Text>
          {/* {console.warn(this.state.dataCountry)} */}

          <View
            style={{
              top: '4%',
              width: '90%',
              //   backgroundColor: 'rgba(255, 255,255,0.2)',
              //   borderRadius: 25,
              paddingHorizontal: 16,
              alignSelf: 'center',
            }}>
            <View
              style={{
                // backgroundColor: 'red',
                top: '2%',
                width: '95%',
                backgroundColor: '#fff',
                borderRadius: 15,
                paddingHorizontal: 19,
                alignSelf: 'center',
              }}>
              <RNPickerSelect
                onValueChange={value => this.filterCountry(value)}
                // value={this.state.dataCountry.value}
                items={this.state.listDataCountry.map((x, i) => {
                  return {
                    label: x.country,
                    value: x.country,
                  };
                })}
              />
            </View>
            <View
              style={{
                // backgroundColor: 'red',
                flexDirection: 'row',
                top: '4%',
                height: '22%',
                width: '90%',
                alignSelf: 'center',
                borderRadius: 25,
              }}>
              <TouchableOpacity
                style={{
                  top: '5%',
                  left: '0%',
                  // alignSelf: 'center',
                  width: '30%',
                  backgroundColor: '#1c313a',
                  borderRadius: 10,

                  paddingVertical: 8,
                  position: 'absolute',
                  // bottom: 0,
                }}
                onPress={() => {
                  this.countryInfo(), this.setState({visible1: true});
                }}>
                <Text style={styles.buttonTextDetail}>World</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  top: '5%',
                  left: '35%',
                  // alignSelf: 'center',
                  width: '30%',
                  backgroundColor: '#1c313a',
                  borderRadius: 10,

                  paddingVertical: 8,
                  position: 'absolute',
                  // bottom: 0,
                }}
                onPress={() => {
                  this.countryInfo(), this.setState({visible1: true});
                }}>
                <Text style={styles.buttonTextDetail}>Indonesia</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  top: '5%',
                  right: '0%',
                  // alignSelf: 'center',
                  width: '30%',
                  backgroundColor: '#1c313a',
                  borderRadius: 10,

                  paddingVertical: 8,
                  position: 'absolute',
                  // bottom: 0,
                }}
                onPress={() => {
                  this.countryInfo(), this.setState({visible1: true});
                }}>
                <Text style={styles.buttonTextDetail}>Lampung</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              top: '-6%',
              fontSize: 15,
              alignSelf: 'center',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}>
            {/* {console.warn(this.state.dataCountry.countryInfo)} */}
            {this.state.dataCountry.country === undefined
              ? 'On Earth 🌎'
              : this.state.dataCountry.country}
          </Text>

          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              top: '-10%',
              height: '25%',
              width: '90%',
              alignSelf: 'center',
              borderRadius: 25,
            }}>
            <View
              style={{
                top: '6%',
                left: '4%',
                width: '30%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  top: '5.5%',
                  fontSize: 14,
                  color: '#7d887a',
                  fontStyle: 'italic',
                }}>
                Confirmed
              </Text>
              <View
                style={{
                  top: '6%',
                  width: '100%',
                  height: '35%',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    left: '-4%',
                    top: '30%',
                    textAlign: 'center',
                    color: '#f8ad1e',
                    width: '100%',
                    height: '100%',
                    fontSize: 21,
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                  }}>
                  {' '}
                  {this.state.dataCountry.cases}
                </Text>
              </View>
            </View>

            <View style={{left: '6%', top: '6%', width: '30%'}}>
              <Text
                style={{
                  textAlign: 'center',
                  top: '5.5%',
                  fontSize: 14,
                  color: '#7d887a',
                  fontStyle: 'italic',
                }}>
                Recover
              </Text>
              <View
                style={{
                  top: '6%',
                  width: '100%',
                  height: '35%',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    left: '-4%',
                    textAlign: 'center',
                    top: '30%',
                    width: '100%',
                    height: '100%',
                    color: '#166138',
                    fontSize: 21,
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                  }}>
                  {' '}
                  {this.state.dataCountry.recovered}
                </Text>
              </View>
            </View>

            <View style={{left: '8%', top: '6%', width: '30%'}}>
              <Text
                style={{
                  textAlign: 'center',
                  top: '5.5%',
                  fontSize: 14,
                  color: '#7d887a',
                  fontStyle: 'italic',
                }}>
                Death
              </Text>
              <View
                style={{
                  top: '6%',
                  width: '100%',
                  height: '35%',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    left: '-8%',
                    textAlign: 'center',
                    top: '30%',
                    width: '100%',
                    height: '100%',
                    color: '#B11E31',
                    fontSize: 21,
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                  }}>
                  {' '}
                  {this.state.dataCountry.deaths}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonDetail}
              onPress={() => {
                this.countryInfo(), this.setState({visible1: true});
              }}>
              <Text style={styles.buttonTextDetail}>Detail Cases</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    ) : (
      <>
        <StatusBar translucent backgroundColor="transparent" />

        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: '#7F886A',
          }}>
          {/* <Image
          style={{
            alignSelf: 'center',
          }}
          source={require('../images/logo.png')}
        /> */}
          <ActivityIndicator style={{top: 0}} animating size="large" />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: '30%',
    width: '100%',
  },
  marker: {
    // backgroundColor: 'red',
    width: '20%',
    height: '20%',
  },

  buttonProfile: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  buttonDetail: {
    bottom: '10%',
    left: '15%',
    // alignSelf: 'center',
    width: '70%',
    backgroundColor: '#1c313a',
    borderRadius: 25,

    paddingVertical: 8,
    position: 'absolute',
    // bottom: 0,
  },
  buttonTextDetail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  marker: {
    // backgroundColor: 'red',
    width: '20%',
    height: '20%',
  },
});