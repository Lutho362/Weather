import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import moment from 'moment';

const time = new Date();
let month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
let day = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
let mins = time.getMinutes();
let dispMins = mins < 10 ? '0' + mins : mins;
let hours = time.getHours() > 12 ? time.getHours() % 12 : time.getHours()
let dispHours = hours < 10 ? '0' + hours : hours;
let ampm = time.getHours() >= 12 ? 'pm' : 'am';
let months = time.getMonth();
let days = time.getDay();
let date = time.getDate();

const API_key = '9b51424f065445f6675667b727f8490e';
let ic = require('./assets/warmIcon.png')
export default function App() {
  const [img, setImg] = useState(require('./assets/back.jpeg'));
  const [currentD, setCurrentD] = useState([{temperature:'', night:'', wind_speed: '', day:'', humidity:'', pressure:'', dec:'', icon:''}])
  const [followingD, setFollowingD] = useState([{night:'', wind_speed: '', day:'', dec:'', icon:''}])
  const [nextD, setNextD] = useState([{night:'', wind_speed: '', day:'', dec:'', icon:''}])
  const [desc, setDesc] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('cape town');
  
  //getting the coordinates of curren position and setting the lat and lon state
  let lat = ''
  let long=''
  //const [lat, setLat] = useState(navigator.geolocation.getCurrentPosition(suc=>{let latitude = suc.coords}))
  //const [long, setLong] = useState(navigator.geolocation.getCurrentPosition(suc=>{let longitude = suc.coords}))
  const [name, setName]= useState('Current')

  
  {/*navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;
      setLat(latitude)
      setLong(longitude)
    });*/}
  
   //Searching for a place using latitudes and longitudes
  
  function setWeatherData(){
      navigator.geolocation.getCurrentPosition((success=>{
        let {latitude, longitude} = success.coords
        lat = latitude
        long = longitude
       
    
        
        
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${API_key}`
      )
        .then((res) => res.json())
        .then((data) => {
         
          showWeatherData(data);
        })
        .catch((error) => {
          console.log(error.message);
        })}))
  }

   //Searching a city by name to take only its latitudes, name and longitude values
  function getWeatherData() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_key}`).then(res=>{res.json().then(data=>{
      
      let l =(data.coord.lat)
      let lo =(data.coord.lon)
      setName(data.name)
    
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${l}&lon=${lo}&exclude=hourly,minutely&units=metric&appid=${API_key}`
      )
        .then((res) => res.json())
        .then((data) => {
          
          showWeatherData(data);
        })
        .catch((error) => {
          console.log(error.message);
        })
    })})
  }

  useEffect(()=>{
    setWeatherData()
  },[])



  //Destructuring variables to set my state
  function showWeatherData(data) {
    let {
      humidity,
      pressure,
      temp,
      wind_speed,
    } = data.current;
    let {description, icon} = data.current.weather[0];
    
    setCurrentD({temperature:temp, wind_speed: wind_speed, day:temp, night: data.daily[0].feels_like.night, humidity: humidity, pressure: pressure, dec:description, icon:icon })
    
    setFollowingD({
      night: data.daily[1].feels_like.night, 
      wind_speed: data.daily[1].wind_speed, 
      day: data.daily[1].feels_like.day,
      dec: {description}=data.daily[1].weather[0].description,
      icon: {icon}=data.daily[1].weather[0].icon
      })
     
    setNextD({
      night: data.daily[2].feels_like.night, 
      wind_speed: data.daily[2].wind_speed, 
      day: data.daily[2].feels_like.day,
      dec:data.current.weather[2]
      })
      
    
    {/*if (currentD.temperature < 0) {
     // setImg(require('./assets/freezing.jpeg'));
      setIcon(require('./assets/icons8-winter-48.png'))
    } else if (currentD.temperature < 10) {
      //setImg(require('./assets/cold10.jpeg'));
     setIcon(require('./assets/icons8-windy-weather.gif'))
    } else if (currentD.temperature < 15) {
      //setImg(require('./assets/cool.jpeg'));
      setIcon(require('./assets/icons8-windy-weather.gif'))
    } else if (currentD.temperature <= 27) {
     // setImg(require('./assets/warm.jpeg'));
     setIcon(require('./assets/warmIcon.png'))
    } else {
      //setImg(require('./assets/hot.jpeg'));
      setIcon(require('./assets/icons8-sun-48.png'))
    }*/}
  }
  {
    /*} function fetchCity(){
    if (search!== ''){
      fetch('https://autocomplete.wunderground.com/aq?query='= +search).then(item=> item.json()).then(cityData=>{console.log(cityData)})
    }
  }*/
  }
  //display future forecast
   function futureForecast(){

     return(
       <View>
        <ScrollView
          horizontal="true"
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 30, }}>
          <View style={styles.scroll}>
            Today{' '}
            <Text style={{ fontWeight: 'bold', paddingVertical: 3, color: 'white', paddingLeft: 45 }}>
              <img src = {`http://openweathermap.org/img/w/${currentD.icon}.png`} style={{width: 45, height: 45,}} />
            </Text>
            <Text
              style={{ fontWeight: 'bold', color: 'white', paddingTop: 2 }}>
              Day : {currentD.day}{'\u00b0'} C{' '}
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 0, color: 'white' }}>
              Night :{currentD.night}{'\u00b0'} C
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 0, color: 'white' }}>
              W Speed :{currentD.wind_speed}m/s
            </Text>
          </View>
          <View style={styles.scroll}>
            Tomorrow{' '}
            <Text style={{  paddingVertical: 10, paddingLeft: 35 }}>
              <Image source={ic} style = {styles.icon}/>
            </Text>
            <Text
              style={{ fontWeight: 'bold', color: 'white', paddingTop: 5 }}>
              Day : {followingD.day}{'\u00b0'} C{' '}
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 0, color: 'white' }}>
            Night :{followingD.night}{'\u00b0'} C{' '}
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 0, color: 'white' }}>
              W Speed :{followingD.wind_speed}m/s
            </Text>
          </View>
          <View style={styles.scroll}>
            Overmorrow{' '}
            <Text style={{ fontWeight: 'bold', paddingVertical: 10, color: 'white', paddingLeft: 35 }}>
              <Image source={ic} style={styles.icon} />
            </Text>
            <Text
              style={{ fontWeight: 'bold', color: 'white', paddingTop: 5 }}>
              Day : {nextD.day}{'\u00b0'} C{' '}
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 0, color: 'white' }}>
              Night :{nextD.night}{'\u00b0'} C{' '}
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 0, color: 'white' }}>
              W Speed :{nextD.wind_speed}m/s
            </Text>
          </View>
          
        </ScrollView>
       
       </View>
       
     )
    
   }



  return (
    <View style={styles.container}>
      <ImageBackground source={img} style={styles.back}>
        <View style={styles.vie}>
          <TextInput
            style={styles.txt}
            onChangeText={(search) => setSearch(search)}
          />
          <TouchableOpacity onPress={() => getWeatherData()}>
            <FontAwesome
              name="search"
              size={24}
              color="black"
              style={{ marginTop: 4 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', }}>
          <View style={{ alignItems: 'center', flexDirection:'row' }}>
            <Text
            style={{
              fontSize: 38,
              fontWeight: 'bolder',
              color: 'white',
              marginVertical: 10,
              paddingBottom: 7,
            }}>
            {name} 
          </Text>
          <Ionicons name="location" size={34} color="white" />
          </View>
          
          <Text style={{ fontSize: 33, color: 'white', marginTop: 15 }}>
            {hours}:{dispMins} {ampm}
          </Text>
          <Text style={{ fontSize: 27, color: 'white', marginBottom: 15 }}>
            {day[days]}, {date} {month[months]}
          </Text>
          <Text style={{ fontSize: 37, color: 'white', marginVertical: 3 }}>
            {currentD.dec}
          </Text>
          <View style = {{flexDirection: 'row',}}>
            <Text
              style={{
                fontSize: 35,
                fontWeight: 'bold',
                color: 'white',
                paddingTop: 10,
              }}>
              {currentD.temperature}
              {'\u00b0'} C 
            </Text>
            <img src = {`http://openweathermap.org/img/w/${currentD.icon}.png`} style={{width: 75, height: 75, paddingTop: -15, marginLeft: 2, }} />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.box}>
            <Text style={{ fontWeight: 'bold' }}>Humidity : {currentD.humidity}% </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 10 }}>
              Wind Speed :{currentD.wind_speed}m/s
            </Text>
            <Text style={{ fontWeight: 'bold', paddingTop: 10 }}>
              Pressure :{currentD.pressure}
            </Text>
          </View>
        </View>
        {futureForecast()}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon:{
    width: 25,
    height: 25
  },
  
  scroll: {
    height: 170,
    width: 160,
    backgroundColor: 'grey',
    opacity: 0.7,
    borderWidth: 3,
    padding: 10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 2,
    borderRadius: 15,
  },
  vie: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 20,
  },
  box: {
    height: 130,
    width: 180,
    backgroundColor: 'white',
    opacity: 0.5,
    marginHorizontal: 0,
    borderRadius: 10,
    borderWidth: 7,
    borderColor: 'grey',
    padding: 10,
    marginVertical: 10,
    paddingVertical: 20,
  },
  txt: {
    outline: 'none',
    width: '83%',
    height: 35,
    backgroundColor: 'white',
    marginLeft: 20,
  },

  back: {
    flex: 1,
    resizeMode: 'cover',
  },
});
