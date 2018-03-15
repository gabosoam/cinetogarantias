
var bcrypt = require('bcrypt-nodejs');
var generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

var connection = require('../config/connection.js');




module.exports = {

    read: function (callback) {
        connection.query('SELECT  * FROM site ORDER BY name;', function (error, results, fields) {
            if (error) {
             
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
               
            }
        });
    },

    read2: function (callback) {
        connection.query('SELECT  * FROM v_site ORDER BY text;', function (error, results, fields) {
            if (error) {
         
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
                
            }
        });
    },

    update: function (datos, callback) {
        connection.query('UPDATE `site` SET `siteasigned`=?, `name`=? WHERE (`id`=?) LIMIT 1', [datos.siteasigned.toUpperCase(),datos.name.toUpperCase(),datos.id], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
               
            }
        });
    },

    delete: function (datos, callback) {
        connection.query('DELETE FROM site WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
                
            }
        });
    },

    create: function (datos, callback) {
        connection.query('INSERT INTO `site` (`siteasigned`, `name`) VALUES (?,?)', [datos.siteasigned.toUpperCase(), datos.name.toUpperCase()], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);
               
            }
        });
    },
}
