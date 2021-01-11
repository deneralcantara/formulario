import { StyleSheet } from 'react-native';


export const style = StyleSheet.create({
    body: {  
        flex:1,
        alignItems: "center",
        backgroundColor: "#DFE1E6",
    },
    label: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: '#d9534f',
        borderRadius: 10,
        paddingRight: 30,
        paddingLeft: 30,
        paddingBottom: 15,
        alignItems: "center",
        marginLeft: 50,
        marginRight: 50,
        marginTop: 30,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontWeight: 'bold'
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    viewImage: {
        alignItems: "center",
    },
    answer: {
        fontSize: 15,
        fontWeight: "normal",
        color: "#000",
        marginLeft: 20,
    },
})