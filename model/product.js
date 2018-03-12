var connection = require('../config/connection.js');


module.exports = {

    read: function (callback) {
        connection.query('SELECT  * FROM  v_product3', function (error, results, fields) {
            if (error) {

                callback('error en la consulta: ' + error, null);
            } else {

                callback(null, results);

            }
        });
    },

    searchBarcode: function (barcode, callback) {
        connection.query('SELECT  id FROM product WHERE barcode=?;', barcode, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {

                if (results.length == 0) {
                    callback(false);
                } else {
                    callback(true);
                }

            }
        });
    },

    searchBarcodes: function (model, callback) {
        connection.query('SELECT  * FROM product WHERE model=?;', model, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {

                if (results.length == 0) {
                    callback(false);
                } else {
                    callback(results);
                }

            }
        });
    },

    updateFromBill: function (data, cb) {
        connection.query({
            sql: 'UPDATE `product` SET `location`=?, `observation`=? WHERE (`id`=?)',
            values: [data.idlocation, data.observation.toUpperCase(), data.id]
        }, function (err, results, fields) {
            if (err) {

                cb(err, null);
            } else {
                cb(null, results)
            }
        })

    },

    readBill: function (bill, callback) {
        connection.query('Select * from v_billdetail where bill=?', bill, function (error, results, fields) {
            if (error) {

                callback('error en la consulta: ' + error, null);
            } else {

                callback(null, results);

            }
        });
    },

    readBillPrice: function (bill, callback) {
        connection.query('CALL p_billprice(?)', bill, function (error, results, fields) {
            if (error) {

                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results[0]);

            }
        });
    },

    update: function (datos, callback) {

        connection.query('UPDATE product SET barcode=?,model=? WHERE (id=?) LIMIT 1', [datos.barcode.toUpperCase(), datos.code, datos.id], function (error, results, fields) {//
            if (error) {
                console.log(error)
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);

            }
        });
    },

    updateprice: function name(data, callback) {
        
        connection.query({
            sql: 'SELECT billdetail.id,product.barcode,model.`code`,model.id as idcode FROM billdetail INNER JOIN product ON billdetail.product = product.id INNER JOIN model ON product.model = model.id WHERE bill=? AND model.id=?',
            values: [data.bill, data.var]
        }, function (err, results, fields) {
            if (err) {
                console.log(err)
                callback(err, null);
            } else {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        editar(results[i].id)

                        if (i == results.length - 1) {
                            callback(null, results);
                        }

                    }
                } else {
                    callback('Existió un error', null);
                }




            }

        })


        function editar(id) {
            console.log(id)
            connection.query({
                sql: 'UPDATE billdetail SET price=? WHERE id=?',
                values: [data.price, id]
            }, function (err, results, fields) {
                if (err) {
                 
                } else {

                }
            })
        }

    },


    delete: function (datos, callback) {
        connection.query('DELETE FROM product WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);

            }
        });
    },

    delete2: function (datos, callback) {
        connection.query('DELETE FROM billdetail WHERE id=?', [datos.id], function (error, results, fields) {//
            if (error) {
                callback('error en la consulta: ' + error, null);
            } else {
                callback(null, results);

            }
        });
    },

    create: function (datos, callback) {
        connection.query('INSERT INTO product (barcode,model) VALUES (?,?)', [datos.barcode.toUpperCase(), datos.code], function (error, results, fields) {
            if (error) {

                callback(error, null)
            } else {
                callback(null, results)
            }
        });
    },

    create2: function (data, callback) {




        if (!data.fdr) { data.fdr = 'N/A' }
        if (!data.wbs) { data.wbs = 'N/A' }
        if (!data.cso) { data.cso = 'N/A' }
        if (!data.comment) { data.comment = 'N/A' }
        if (!data.area) { data.area = 'N/A' }
        if (!data.contrato) { data.contrato = 'N/A' }

        console.log(data)





        connection.query({
            sql: 'SELECT * FROM product WHERE barcode = ? and model =?',
            timeout: 40000, // 40s
            values: [data.barcode_input, data.code]
        }, function (error, results, fields) {
            if (error) {

                callback('Existió un error inesperado');
            } else {
                if (results[0]) {


                    if (results[0].barcode == 'S/N') {
                        var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `location`, `comment`, area, contrato, cant) VALUES(?,?,?,?,?,?,?,?,?,?)';
                        connection.query({
                            sql: sql,
                            timeout: 40000, // 40s
                            values: [data.bill, results[0].id, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.location, data.comment.toUpperCase(), data.area.toUpperCase(), data.contrato.toUpperCase(), data.cant]
                        }, function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                callback('existió un error');
                            } else {
                                callback('El ingreso del producto se realizó correctamente')

                            }
                        });

                    } else {

                        //CODIGO PARA VALIDAR
                        connection.query({
                            sql: 'SELECT * FROM v_existencias WHERE idprod=?',
                            values: [results[0].id]
                        }, function (err, results, fields) {

                            if (error) {
                                callback('existió un error');
                            } else {
                                if (results[0]) {
                                    if (results[0].enbodega == 0) {
                                        var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `location`, `comment`, area, contrato, cant) VALUES(?,?,?,?,?,?,?,?,?,?)';
                                        connection.query({
                                            sql: sql,
                                            timeout: 40000, // 40s
                                            values: [data.bill, data.barcode, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.location, data.comment.toUpperCase(), data.area.toUpperCase(), data.contrato.toUpperCase(), data.cant]
                                        }, function (error, results, fields) {
                                            if (error) {
                                                console.log(error)
                                                callback('existió un error');
                                            } else {
                                                callback('El ingreso del producto se realizó correctamente');

                                            }
                                        });










                                    } else {
                                        callback('El producto se encuentra en bodega');
                                    }

                                } else {
                                    callback('existió un error');
                                }
                            }

                        })



                    }





                } else {
                    connection.query({
                        sql: 'INSERT INTO `product` (`barcode`, `model`) VALUES (?,?)',
                        timeout: 40000, // 40s
                        values: [data.barcode_input.toUpperCase(), data.code]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            callback('existió un error', null);
                        } else {
                            if (results.affectedRows == 1) {
                                var sql = 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `location`, `comment`, area, contrato, cant) VALUES(?,?,?,?,?,?,?,?,?,?)';
                                connection.query({
                                    sql: sql,
                                    timeout: 40000, // 40s
                                    values: [data.bill, results.insertId, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.location, data.comment.toUpperCase(), data.area.toUpperCase(), data.contrato.toUpperCase(), data.cant]
                                }, function (error, results, fields) {
                                    if (error) {
                                        console.log(error)
                                        callback('Existió un error');
                                    } else {
                                        callback('El ingreso del producto se realizó correctamente');
                                    }
                                });
                            } else {
                                callback('existió un error', null);
                            }
                        }
                    });
                }
            }
        });
    },



    createSalida: function (data, callback) {

        if (!data.fdr) { data.fdr = 'N/A' }
        if (!data.wbs) { data.wbs = 'N/A' }
        if (!data.cso) { data.cso = 'N/A' }
        if (!data.comment) { data.comment = 'N/A' }
        if (!data.area) { data.area = 'N/A' }
        if (!data.contrato) { data.contrato = 'N/A' }

        connection.query({
            sql: 'SELECT * FROM v_existencias WHERE idprod=? LIMIT 1',
            values: [data.barcode]
        }, function (error, results, fields) {
            if (error) {
                callback('Existió un error inesperado')
            } else {
                if (results[0]) {
                    if (results[0].enbodega >= data.cant) {

                        connection.query({
                            sql: 'INSERT INTO `billdetail` (`bill`, `product`, `fdr`, `cso`, `wbs`, `comment`, area, contrato, cant) VALUES(?,?,?,?,?,?,?,?,?)',
                            values: [data.bill, data.barcode, data.fdr, data.cso, data.wbs, data.comment, data.area, data.contrato, data.cant]
                        }, function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                callback('No se pudo realizar el ingreso');
                            } else {
                                callback('Entrega realizada correctamente');

                            }
                        });



                    } else {
                        callback('No hay suficiente stock', null)
                    }

                } else {
                    callback('Existió un error inesperado', null)
                }
            }
        })




    },


    update2: function (data, callback) {

        if (data.fdr == '') { data.fdr = 'N/A' }
        if (data.wbs == '') { data.wbs = 'N/A' }
        if (data.cso == '') { data.cso = 'N/A' }
        if (data.comment == '') { data.comment = 'N/A' }
        if (data.area == '') { data.area = 'N/A' }
        if (data.contrato == '') { data.contrato = 'N/A' }

        connection.query({
            sql: 'UPDATE `billdetail` SET `bill`=?, `fdr`=?, `cso`=?, `wbs`=?, `comment`=?, `area`=?, `contrato`=?, location=?, cant=? WHERE (`id`=?) LIMIT 1',
            timeout: 40000, // 40s
            values: [data.bill, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.comment.toUpperCase(), data.area.toUpperCase(), data.contrato.toUpperCase(), data.location, data.cant, data.id]
        }, function (error, results, fields) {
            if (error) {
                console.log(error)
                callback('existió un error', null);
            } else {
                console.log(results)
                callback(null, results)

            }
        });



    },

    update3: function (data, callback) {

        if (data.fdr == '') { data.fdr = 'N/A' }
        if (data.wbs == '') { data.wbs = 'N/A' }
        if (data.cso == '') { data.cso = 'N/A' }
        if (data.comment == '') { data.comment = 'N/A' }
        if (data.area == '') { data.area = 'N/A' }
        if (data.contrato == '') { data.contrato = 'N/A' }

        var contador = 0;

        connection.query({
            sql: 'SELECT * from billdetail where id=?',
            values: [data.id]
        }, function (error, results, fileds) {
            if (error) {
                console.log(error)
                callback('existió un error', null);
            } else {
                if (results[0]) {
                    contador = results[0].cant;


                    console.log('hi: ' + data.idproduct)
                    connection.query({

                        sql: 'SELECT * FROM v_existencias WHERE idprod=? LIMIT 1',
                        values: [data.idproduct]
                    }, function (err, results, fields) {
                        if (err) {
                            console.log(error)
                            callback('existió un error', null);

                        } else {

                            if (results[0]) {
                                console.log('en bodega ' + results[0].enbodega);
                                console.log('el contador es ' + contador);
                                console.log('cant ' + data.cant)

                                if (results[0].enbodega + contador >= data.cant) {

                                    connection.query({
                                        sql: 'UPDATE `billdetail` SET `bill`=?, `fdr`=?, `cso`=?, `wbs`=?, `comment`=?, `area`=?, `contrato`=?, cant=? WHERE (`id`=?) LIMIT 1',
                                        timeout: 40000, // 40s
                                        values: [data.bill, data.fdr.toUpperCase(), data.cso.toUpperCase(), data.wbs.toUpperCase(), data.comment.toUpperCase(), data.area.toUpperCase(), data.contrato.toUpperCase(), data.cant, data.id]
                                    }, function (error, results, fields) {
                                        if (error) {
                                            console.log(error)
                                            callback('existió un error', null);
                                        } else {
                                            console.log(results)
                                            callback(null, results)

                                        }
                                    });

                                } else {
                                    console.log('no hay stock')
                                    callback('existió un error', null);
                                }
                            } else {
                                console.log('no hay data')
                                callback('existió un error', null);
                            }
                        }
                    })


                } else {
                    callback('existió un error', null);
                }
            }
        })

    },


}


