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



module.exports = factoringModel;