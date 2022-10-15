const currnetDate = new Date();

const getDataBase = {
    currnetDate : `${ currnetDate.getFullYear() }.${ currnetDate.getMonth() + 1 }.${ currnetDate.getDate() } ${ currnetDate.getHours() }:${ currnetDate.getMinutes() }:${ currnetDate.getSeconds() }`
}

module.exports = getDataBase;