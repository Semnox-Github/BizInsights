import AsyncStorage from '@react-native-async-storage/async-storage';


class AsyncStorageHandler {

    setItem = async (key, data) => {
        try {
            return await AsyncStorage.setItem(key, ((typeof data) != 'string') ? JSON.stringify(data) : data);
        } catch (err) {
            return err;
        }
    }


    setItems = async (data) => {
        try {
            return await AsyncStorage.multiSet(data)
        } catch (err) {
            return err
        }
    }

    setItemArray = async (key, data) => {
        try {
            item = await AsyncStorage.getItem(key);
            if (item) {
                item = JSON.parse(item);
                item.push(data);
                return this.setItem(key, item);
            } else {
                let temp = [];
                temp.push(data);
                return this.setItem(key, temp);
            }
        } catch (err) {
            return (err);
        }
    }

    updateItem = async (key, data) => {
        try {
            this.deleteItem(key);
            return this.setItem(key, data);
        } catch (err) {
            return err;
        }
    }

    updateItemArray = async (key, index, data) => {
        try {
            let item = await AsyncStorage.getItem(key);

            if (item) {
                item = JSON.parse(item);
            } else {
                return null;
            }

            if (Array.isArray(item)) {
                for (i = 0; i < item.length; i++) {
                    if (i === index) {
                        item[i] = data;
                        this.deleteItem(key);
                        return this.setItem(key, item);
                    }
                }
                return false;
            } else {
                return null;
            }
        } catch (err) {
            return err;
        }
    }

    getItem = async (key) => {
        try {
            const data = await AsyncStorage.getItem(key)
            if (data != null) {
                if (this.isJsonString(data))
                    return JSON.parse(data);
                else
                    return data;
            } else {
                return null;
            }
        } catch (err) {
            return (err);
        }
    }

    getItems = async (keys) => {
        try {

            const data = await AsyncStorage.multiGet(keys)
            if (data != null) {
                if (this.isJsonString(data))
                    return JSON.parse(data);
                else
                    return data;
            } else {
                return null;
            }
        } catch (err) {
            return (err);
        }
    }





    getKeysData = async (keys) => {
        try {
            const stores = await AsyncStorage.multiGet(keys);
            return stores.map(([key, value]) => value)
        }
        catch (err) {
            //  console.log(err)
        }
    }


    isJsonString(str) {
        try {
            var json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }

    deleteItemArray = async (key, index) => {
        try {
            //let item = '';
            item = await AsyncStorage.getItem(key);
            if (item) {
                item = JSON.parse(item);
            } else {
                return null;
            }
            if (Array.isArray(item)) {
                for (i = 0; i < item.length; i++) {
                    if (i === index) {
                        item.splice(index, 1);
                        this.deleteItem(key);
                        return this.setItem(key, item);
                    }
                }
                return false;
            } else {
                return null;
            }
        } catch (err) {
            return err;
        }
    }

    deleteItem = async (key) => {
        try {
            AsyncStorage.removeItem(key);
            return true;
        } catch (err) {
            return err;
        }
    }

    clearAllItems = async () => {
        try {
            AsyncStorage.clear();
            return true;
        } catch (err) {
            return err;
        }
    }

    //Queue

    setItemArrayQueue = async (key, data, size = -1) => {
        try {
            item = await AsyncStorage.getItem(key);
            if (item) {
                item = JSON.parse(item);
                if ((size != -1) && (item.length > size))
                    item.pop();
                item.unshift(data);
                return this.updateItem(key, item);
            } else {
                let temp = [];
                temp.unshift(data);
                return this.setItem(key, temp);
            }
        } catch (err) {
            return (err);
        }
    }

}



export default AsyncStorageHandler;
