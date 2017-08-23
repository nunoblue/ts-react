/* eslint-disable no-param-reassign */
export default {
    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    },

    swapArrayItem(arr, index, replaceIndex) {
        arr[replaceIndex] = arr.splice(index, 1, arr[replaceIndex])[0];
        return arr;
    },

    getUniqueKey(number = 100000000000) {
        const uniqueKey = String(Math.floor(Math.random() * number));
        return uniqueKey;
    },

    convertStringOfTrueAndFalseToBollean(str) {
        if (str === 'true') {
            return true;
        } else if (str === 'false') {
            return false;
        }
        return str;
    },

    valuesToConfig(formBuilderConfig, data){
        formBuilderConfig.forEach((v,k)=>{
            if(v.type === "array"){
                v.type = "table";
            }
            if(!v.key){
                v.key = this.getUniqueKey();
            }
            if(!v.children){
                if(data[v.name] !== undefined){
                    v.value = data[v.name];
                }
            }else if(v.type === "object" && v.children){
                if(data[v.name] !== undefined){
                    valuesToConfig(v.children,data[v.name]);
                }
            }else if(v.type === "table" && v.children){
                if(data[v.name] !== undefined){
                    var arr = [];
                    var temp_data = data[v.name];
                    temp_data.forEach((v2,k2)=>{
                        var temp = _.cloneDeep(v.children[0]);
                        //处理key值
                        temp.forEach((v3,k3)=>{
                            v3.key = this.getUniqueKey();
                        })
                        valuesToConfig(temp, v2);
                        arr.push(temp)
                        //console.debug(v)
                    })
                    v.children = arr;
                }
            }
        })
        return formBuilderConfig;
    },

    dataType: [
        {
            value: 'object',
            text: 'object',
        },
        {
            value: 'table',
            text: 'table',
        },
        {
            value: 'dropdown',
            text: 'dropdown',
        },
        {
            value: 'string',
            text: 'string',
        },
        {
            value: 'number',
            text: 'number',
        },
        {
            value: 'integer',
            text: 'integer',
        },
        {
            value: 'float',
            text: 'float',
        },
        {
            value: 'boolean',
            text: 'boolean',
        },
        {
            value: 'date',
            text: 'date',
        },
        {
            value: 'url',
            text: 'url',
        },
        {
            value: 'email',
            text: 'email',
        },
    ],
};