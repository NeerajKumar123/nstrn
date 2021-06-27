import AsyncStorage from '@react-native-community/async-storage'

const setKeyValue = async (key, value, callback) => {
    let valuestring = '';
    if (typeof value === 'object') {
      valuestring = JSON.stringify(value);
    } else if (typeof value === 'string' || value instanceof String) {
      valuestring = value;
    } else {
      valuestring = '' + value;
    }
    try {
      await AsyncStorage.setItem(key, valuestring)
      callback && callback()
    } catch (e) {
      alert('Failed to save the data to the storage')
      callback && callback()
    }
  }

  const readData = async () => {
    try {
      const name = await AsyncStorage.getItem('name')
      if (name !== null) {
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
    }
  }

  const storeUserData = async (userData, callback) => {
    try {
      await setKeyValue('USER_DATA', userData, callback);
    } catch (error) {
        console.log(error);
        callback && callback(error)
    }
  };

  const getUserData = async () => {
    try {
      await AsyncStorage.getItem('USER_DATA');
    } catch (error) {
        console.log(error);
    }
  };
  const isAlreadyAdded =  async (productID,callback) => {
    try {
     let cartItems =  await AsyncStorage.getItem('USER_CART_DATA');
     cartItems = JSON.parse(cartItems)
     const results = cartItems && cartItems.filter(item => item.productID == productID);
     let item = results && results.length > 0 ? results[0] : 0
     callback && callback(item && item.productQuantity)
    } catch (error) {
      callback && callback(0)
        console.log(error);
    }
  };

 const updateQuantToLocalCart = async (cartItem, callback) =>{
    try {
    let alreadySavedItems =  await AsyncStorage.getItem('USER_CART_DATA');
    alreadySavedItems = JSON.parse(alreadySavedItems)

    // check if cart item is already in cart
    const results =  alreadySavedItems && alreadySavedItems.filter(item =>{
      return item.productID == cartItem.productID
    });
    if(results && results.length > 0){
      let alreadySavedItem = results && results.length > 0 ? results[0] : 0
      alreadySavedItem.productQuantity = cartItem.productQuantity
      let newList = [];
      alreadySavedItems.forEach(function (item) {
          if (item.productID === alreadySavedItem.productID) {
            alreadySavedItem.productQuantity > 0 ? newList.push(alreadySavedItem) : newList.pop();
          } else {
              newList.push(item);
          }
      });
      alreadySavedItems = newList
      await setKeyValue('USER_CART_DATA', alreadySavedItems, callback);
      callback && callback()  
    }else{ /// save this item
      let finalItems = []
      finalItems.push(cartItem)
      if(alreadySavedItems && alreadySavedItems.length > 0){
        finalItems  = finalItems.concat(alreadySavedItems)
      }
      await setKeyValue('USER_CART_DATA', finalItems, callback);
      callback && callback() 
    }
  }catch (error) {
    console.log(error);
  }
  }

  const getMultiValue = async (keys, callback) => {
    try {
     let values =  await AsyncStorage.multiGet(keys);
     callback && callback(values)
    } catch (error) {
        console.log(error);
    }
  };

  const saveStoreInfo =  async (storeInfo, callback) => {
    try {
      await setKeyValue('STORE_INFO', storeInfo);
      callback && callback()
    } catch (error) {
    }
  };

  const getStoreInfo = async (callback) => {
    try {
     const storeInfo =  await AsyncStorage.getItem('STORE_INFO');
     callback && callback(storeInfo)
    } catch (error) {
        console.log(error);
    }
  };

  const getUserCartData = async (callback) => {
    try {
     let cartItems =  await AsyncStorage.getItem('USER_CART_DATA');
     callback && callback(cartItems ? JSON.parse(cartItems) : [])
    } catch (error) {
        console.log(error);
    }
  };

  const getCustID = async (callback) => {
    try {
     const cust_id =  await AsyncStorage.getItem('CUST_ID');
     callback && callback(cust_id)
    } catch (error) {
        console.log(error);
    }
  };
  const clearAllData = async (callback) => {
    try {
      global.userInfo = undefined
     await AsyncStorage.clear();
     callback && callback()
    } catch (error) {
        console.log(error);
    }
  };

  const clearStoresCart = async (callback) => {
    try {
     await AsyncStorage.removeItem('STORE_INFO');
     callback && callback()
    } catch (error) {
        console.log(error);
    }
  };

  const loadInitailData = async (callback) =>{
    try {
      const storeInfo =  await AsyncStorage.getItem('STORE_INFO');
      const userInfo = await AsyncStorage.getItem('USER_DATA');
      global.storeInfo = storeInfo && JSON.parse(storeInfo)
      global.userInfo = userInfo && JSON.parse(userInfo)
      callback && callback()
     } catch (error) {
         console.log(error);
     }
  }

  export {
    loadInitailData,
    setKeyValue,
    readData,
    getUserCartData,
    storeUserData,
    getCustID,
    clearAllData,
    isAlreadyAdded,
    updateQuantToLocalCart,
    saveStoreInfo,
    getStoreInfo,
    getUserData,
    getMultiValue,
    clearStoresCart
  }