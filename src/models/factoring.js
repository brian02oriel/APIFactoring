const connection = require('./connection');

let factoringModel = {}

//Select all bills with their owners
//Recibe el rol y el id del usuario
factoringModel.getInvoice = (userData, callback) => {
    if(connection){
        switch(userData.rol) {
            //For clients
            case 1: 
            connection.query(
                "select users.id as users_id, invoices.id as invoices_id, invoices.id_emission as id_emitted, users.company as client_company, invoices.owner as supplier, invoices.state as state, invoices.amount as amount " +
                "from user_invoice " +
                "inner join users on user_invoice.users_id = users.id " +
                "inner join invoices on user_invoice.invoices_id = invoices.id " +
                "where users.company LIKE invoices.emitter AND users.rol = 1 AND users.id = " + userData.id,
                (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        callback(null, rows);
                        }
                })
            break;
            
            //For suppliers
            case 2:
            connection.query(
                "select users.id as supplier, invoices.id as invoices, invoices.id_emission as id_emitted, users.company as owner, invoices.emitter as emitter, invoices.state as state, invoices.amount, invoices.em_date as emission_date " +
                "from user_invoice "+
                "inner join users on user_invoice.users_id = users.id " +
                "inner join invoices on user_invoice.invoices_id = invoices.id " +
                "where users.rol = 2 AND users.id = user_invoice.users_id AND users.id = " + userData.id,
                (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        callback(null, rows);
                       // console.log(rows);
                        }
                })
            break;
            
            //For investors
            case 3: 
            connection.query(
                "select users.id as investor_id, invoices.id as invoice_id,invoices.owner as owner, invoices.emitter as emitter, invoices.factoring_amount as factoring_amount, invoices.roi as roi, investor_invoice.inversion as my_inversion " +
                "from investor_invoice " +
                "inner join user_invoice on investor_invoice.user_invoice_id = user_invoice.id " +
                "inner join users on user_invoice.users_id = users.id " +
                " inner join invoices on user_invoice.invoices_id = invoices.id where users.id =" + userData.id,
                (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        callback(null, rows);
                        console.log(rows);
                        }
                })
            break;
            default: console.log("No existe el rol");
        }        
    }
}

factoringModel.insertInvoice = (userData, invoiceData, callback) => {
    var insertedInvoice;
    var invoiceEmitter;
    var id_emitter; 
    var errors = []
    if(connection){
        if(userData.rol == 2){
            //Invoice insertion
            connection.query('INSERT INTO invoices SET ?', invoiceData,
            (err, rows) => {
                insertedInvoice = rows.insertId;

                connection.query('INSERT INTO user_invoice (users_id, invoices_id) '+
                'values('+ userData.id +', ' + insertedInvoice + ')',  
                (err_user_invoice, rows_user_invoice) => {

                    connection.query('Select users.id as users ' +
                        'from user_invoice '+
                        'inner join users on user_invoice.users_id = users.id ' +
                        'inner join invoices on user_invoice.invoices_id = invoices.id ' +
                        'where invoices.emitter LIKE users.company ', 
                    (err_emitter, rows_emitter)=>{
                        
                        id_emitter = rows_emitter[0].users;
                        console.log("Emitter id", id_emitter);

                        connection.query('INSERT INTO user_invoice (users_id, invoices_id) ' +
                        'values('+id_emitter +', ' + insertedInvoice + ')',
                        (err_user_emitter, rows_user_emitter) =>{
                            if(err || err_user_invoice || err_emitter || err_user_emitter){
                                console.log(err);
                                console.log(err_user_invoice);
                                console.log(err_emitter);
                                console.log(err_user_emitter);
                             } else {
                                callback(null, {
                                insert_invoice_info: rows,
                                insert_user_invoice_info: rows_user_invoice,
                                emitter_info: rows_emitter,
                                insert_user_invoice_emitter: rows_user_emitter,
                                msg: "Invoice and the provider relation is ok"
                                })
                            }
                        });
                       
                    });

                });
            });

        }
    }
}

factoringModel.changeInvoiceState = (userData, invoiceData, callback) =>{
    if(connection){
        if(userData.rol === 1){
            connection.query("UPDATE invoices SET state =" + invoiceData.new_state + " WHERE id = " + invoiceData.id, 
            (err,rows) => {
                if(err){
                    console.log(err);
                } else {
                    callback(null, {
                        msg: "State changes correctly"
                    })
                }
            });
        }
    }
    
}

module.exports = factoringModel;