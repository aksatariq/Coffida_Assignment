import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  mainBg: {
    backgroundColor: '#001624',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginTop: 20,
  },
  greyText: {
    fontSize: 15,
    color: 'grey',
    paddingBottom: 10,
  },
  greyInputText: {
    borderRadius: 3,
    color: 'grey',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  greenButton: {
    borderRadius: 3,
    backgroundColor: '#00ffea',
    width: 120,
    color: 'white',
    margin: 20,

  },
  greenButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    height: 35,
    paddingTop: 6,
  },
  subTitle: {
    color: 'grey',
    padding: 10,
    fontSize: 15,
    alignSelf: 'center',

  },
  formItem: {
    padding: 20,
  },
  formLabel: {
    fontSize: 15,
    color: 'grey',
  },
  formInput: {
    borderRadius: 3,
    color: 'grey',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginTop: 20,
  },
  formTouch: {
    backgroundColor: '#00ffea',
    borderRadius: 3,
    padding: 12,
    width: 290,
    alignSelf: 'center',

  },
  formTouchText: {
    fontSize: 15,
    color: 'white',
    flexShrink: 1,
    lineHeight: 27,
    textAlign: 'center',
  },
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'white',

  },
  flatListTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    flexShrink: 1,
    fontWeight: 'bold',
    marginBottom: 35,
  },

});
