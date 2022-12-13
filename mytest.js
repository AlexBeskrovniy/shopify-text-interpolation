const testObj = {
    person: {
        name: 'Max',
        age: '28'
    },
    job: 'coffe'
}

// const composeMap = (data, mapPath = '', map) => {
//     if(typeof data === 'string') {
//         map[mapPath] = data;
//         return;
//     }
//     Object.entries(data).map(([k, v]) => {
//             composeMap(v, mapPath ? (mapPath + '.' + k) : k, map);
//     })
//   }
 
// const withMap = (data) => {
//     const map = {};
//     composeMap(data, '', map);
//     return map;
// }

const getValuesPaths = (data, mapPath = '') => {
    return Object.values(data).reduce((acc, curr) => {
        if (typeof data === 'string') {
            acc[mapPath] = data;
            return acc
        }
        const composedEntries = Object.entries(data).map(([key, value]) => {
            getValuesPaths(value, mapPath ? (mapPath + '.' + key) : key);
        })
        return Object.assign(acc, composedEntries)
    }, {})
}

console.log(getValuesPaths(Object.values(testObj)));