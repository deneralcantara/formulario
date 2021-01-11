import React, { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Text, View, StatusBar, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { style } from './styles'
import * as EmailValidator from 'email-validator';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function FormScreen({ route, navigation }) {

  const [name, onChangeName] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [telephone, onChangeTelephone] = React.useState(null);
  const [message, onChangeMessage] = React.useState(null);
  const [image, setImage] = React.useState(null);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Precisamos que você dê permissão de acesso para que isso funcione corretamente!');
      }
    })();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken, name, msg) {
 
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: name,
    body: msg,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    try { 
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    catch(exception){
      console.error(exception);
    }
    
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

  async function saveForm() {

    //VALIDACAO DO CADASTRO
    if(name == null || name == ""){
      alert("Digite o nome");
      return false;
    }
    else if(email == null || email == ""){
      alert("Digite o e-mail");
      return false;
    }
    else if(telephone == null || telephone == ""){
      alert("Digite o telefone");
      return false;
    }
    else if(telephone.length < 14){
      alert("Digite um telefone válido");
      return false;
    }
    else if(message == null || message == ""){
      alert("Digite a mensagem");
      return false;
    }
    else if(image == null || image == ""){
      alert("Selecione a imagem");
      return false;
    }
    
    //VERIFICAR SE O EMAIL É VALIDO
    if(EmailValidator.validate(email) == false){
      alert("Insira um e-mail válido");
      return false;
    }

    //SE PASSAR EM TODA VALIDACAO, SALVAR EM UM OBJETO
    const newUser = {
      id: Math.floor(Math.random() * 100) + 1,
      name: name,
      email: email,
      telephone: telephone,
      message: message,
      image: image,
    };

    try {
      //VERIFICAR SE JA CONTEM ARRAY DE USUARIOS
      let users = await AsyncStorage.getItem('users');

      //SE CONTER ARRAY DE USUARIOS, APENAS ADICIONAR (PUSH) E DAR UPDATE NO LOCALSTORAGE
      if(users && users.length > 1){
        users = JSON.parse(users);
        
        users.push(newUser);

        users = JSON.stringify(users);

        await AsyncStorage.setItem('users', users);

        alert("Usuário adicionado com sucesso!");
       
        await sendPushNotification(expoPushToken, name, message).then(user => {
          onChangeName(null);
          onChangeEmail(null);
          onChangeTelephone(null);
          onChangeMessage(null);
          setImage(null);

          navigation.navigate('Perfil', {user: newUser});
        });

      }else{
        //SE NAO EXISTIR, CRIAR ARRAY NO LOCALSTORAGE
        let users = [];

        users.push(newUser);

        users = JSON.stringify(users);

        await AsyncStorage.setItem('users', users);

        alert("Usuário adicionado com sucesso!");

        navigation.navigate('Perfil', {user: newUser});
      }
    }catch (e) {
      alert(e);
      return false;
    }
    
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={style.body}>
      <StatusBar />

      <ScrollView style={{width: "100%", marginBottom: 20,}}>
        <View style={style.title}>
          <Text style={style.text}>Formulário para cadastro</Text>
        </View>

        <View style={style.form}>
          <Text style={style.label}>Digite seu nome</Text>
          <TextInput onChangeText={text => onChangeName(text)} value={name} style={style.input} />
        </View>

        <View style={style.form}>
          <Text style={style.label}>Digite seu e-mail</Text>
          <TextInput onChangeText={text => onChangeEmail(text)} value={email} style={style.input} />
        </View>

        <View style={style.form}>
          <Text style={style.label}>Digite seu telefone</Text>
          <TextInputMask type={'cel-phone'} 
            options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
            value={telephone}
            onChangeText={text => onChangeTelephone(text)}
            keyboardType='numeric'
            style={style.input}
            maxLength={25} />
        </View>

        <View style={style.form}>
          <Text style={style.label}>Digite a mensagem</Text>
          <TextInput onChangeText={text => onChangeMessage(text)} value={message} style={style.input} />
        </View>

        <TouchableOpacity onPress={ () => pickImage()} style={style.button}>
          <Text style={style.buttonText}>Selecionar Imagem</Text>
        </TouchableOpacity>

        {image && 
          <View style={style.viewImage}>
            <Image source={{ uri: image }} style={style.image} />
          </View>
        }

        <TouchableOpacity onPress={ () => saveForm() } style={style.buttonSuccess}>
          <Text style={style.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>

    </View> 
  );
}