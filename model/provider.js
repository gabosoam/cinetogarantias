var connection = require('../config/connection.js');


module.exports = {

    read: function (callback) {
        connection.query('SELECT  * FROM provider ORDER BY name ASC;', function (error, results, fields) {
            if (error) {

                callback(error, null);
            } else {
                callback(null, results);

            }
        });
    },

    read2: function (callback) {
        connection.query('SELECT  * FROM v_provider ORDER BY text ASC;', function (error, results, fields) {
            if (error) {

                callback(error, null);
            } else {
                callback(null, results);

            }
        });
    },

    update: function (datos, callback) {
        connection.query('UPDATE `provider` SET `company`=? WHERE (`id`=?) LIMIT 1', [datos.company.toUpperCase(), datos.id], function (error, results, fields) {//
            if (error) {
                callback(error, null);
            } else {


                callback(null, results);


            }
        });
    },

    delete: function (datos, callback) {
        connection.query('DELETE FROM provider WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    },


    create: function (datos, callback) {
        connection.query('INSERT INTO provider(company) VALUES(?)', [datos.company.toUpperCase()], function (error, results, fields) {//
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    },




}