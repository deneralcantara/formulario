import React from 'react';
import { Text, View, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { style } from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ route, navigation }) {

  const id = route.params.user.id;
  const name = route.params.user.name;
  const email = route.params.user.email;
  const telephone = route.params.user.telephone;
  const message = route.params.user.message;
  const image = route.params.user.image;

  async function removeProfile(id) {
    
    try {
      
      //PEGAR USUARIO
      await AsyncStorage.getItem('users')

      .then((users) => {

        let allUsers = JSON.parse(users);

        //SE TIVER SOMENTE UM USUARIO, APAGAR TUDO
        if(allUsers.length == 1){
          AsyncStorage.clear();
        }
        else{
          //PASSAR EM CADA USUARIO E COMPARAR ID
          allUsers.forEach(function (user, index) {
            if(user.id == id){
              allUsers.splice(index, 1);
            }
          });

          allUsers = JSON.stringify(allUsers);

          AsyncStorage.setItem('users', allUsers);
        }
        
        
        
        alert("Removido com sucesso!")

        navigation.navigate('Inicio');
      }).catch(Exception => {
        console.error(Exception);
        alert("Erro ao remover usuario");
      });
    }
    catch(exception) {
      console.error(exception);
      alert("Erro ao remover usuario");
      return false;
    }
  }

  return (
    <View style={style.body}>
      <StatusBar />

      <ScrollView style={{width: "100%", marginBottom: 20,}}>

       {image && 
          <View style={style.viewImage}>
            <Image source={{ uri: image }} style={style.image} />
          </View>
        }

        <View style={style.form}>
          <Text style={style.label}>Nome</Text>
          <Text style={style.answer}>{name}</Text>
        </View>

        <View style={style.form}>
          <Text style={style.label}>Email</Text>
          <Text style={style.answer}>{email}</Text>
        </View>

        <View style={style.form}>
          <Text style={style.label}>Telefone</Text>
          <Text style={style.answer}>{telephone}</Text>
        </View>

        <View style={style.form}>
          <Text style={style.label}>Mensagem</Text>
          <Text style={style.answer}>{message}</Text>
        </View>

        <TouchableOpacity onPress={() => removeProfile(id)} style={style.button}>
          <Text style={style.buttonText}>Remover Perfil</Text>
        </TouchableOpacity>
      </ScrollView>

    </View> 
  );
}