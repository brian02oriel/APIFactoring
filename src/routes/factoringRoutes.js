const Factoring = require('../models/factoring');

module.exports = function (app) {

    //Get all the invoices
    app.get('/dashboard', (req, res) => {
        const userData = {
            id: req.body.id,
            rol: req.body.rol
        }

        Factoring.getInvoice(userData, (err, data) =>{
            if(data){
                res.json(data);
            } else {
                res.json({
                    msg: 'You dont have invoices'
                })
            }
        })
    })
}