const connection = require('./connection');

let factoringModel = {}

//Select all bills with their owners
//Recibe el rol y el id del usuario
factoringModel.getInvoice = (userData, callback) => {
    if(connection){
        switch(userData.rol) {
            //For clients
            case '1': 
            connection.query(
                "select users.id as users_id, invoices.id as invoices_id, invoices.id_emission as id_emission, users.company as client_company, invoices.owner as owner, invoices.state as state, invoices.amount as amount, invoices.exp_date as exp_date " +
                "from user_invoice " +
                "inner join users on user_invoice.users_id = users.id " +
                "inner join invoices on user_invoice.invoices_id = invoices.id " +
                "where users.company LIKE invoices.debtor AND users.rol = 1 AND users.id = " + userData.id,
                (err,rows) => {
                    if(err){
                        console.log(err);
                    } else {
                        callback(null, rows);
                        
                        }
                })
            break;
            
            //For debtors
            case '2':
            connection.query(
                "select users.id as debtor, invoices.id as invoices, invoices.id_emission as id_emitted, users.company as owner, invoices.debtor as debtor, invoices.state as state, invoices.amount, invoices.em_date as emission_date " +
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
            case '3': 
            connection.query(
                "select users.id as investor_id, invoices.id as invoice_id,invoices.owner as owner, invoices.debtor as debtor, invoices.factoring_amount as factoring_amount, invoices.roi as roi, investor_invoice.inversion as my_inversion " +
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
    var invoiceDebtor;
    var id_debtor; 
    var errors = [];
    var msg = [];
    if(connection){
        if(userData.rol == "2"){
            //Invoice insertion
            connection.query('INSERT INTO invoices SET ?', invoiceData,
            (err1, rows1) => {
                if(err1){
                    errors.push(err1);
                } else {
                    insertedInvoice = rows1.insertId;
                }
                
                connection.query('INSERT INTO user_invoice (users_id, invoices_id) '+
                'values('+ userData.id +', ' + insertedInvoice + ')',  
                (err2, rows2) => {
                    errors.push(err2);
                    connection.query('Select users.id as users_id'+
                    'from users where users.company LIKE ' + invoiceData.debtor,
                    (err3, rows3)=>{

                        connection.query('INSERT INTO user_invoice (users_id, invoices_id) '+
                        'values('+ id_debtor +', ' + insertedInvoice + ')', 
                        (err4, rows4)=>{

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