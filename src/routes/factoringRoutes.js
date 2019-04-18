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

    app.post('/new_invoice', (req, res) =>{
        const userData = {
            id: req.body.userData.id,
            rol: req.body.userData.rol
        };
        const invoiceData = {
            id_emission: req.body.invoiceData.id_emission,
            em_date: req.body.invoiceData.em_date,
            amount: req.body.invoiceData.amount,
            factoring_amount: req.body.invoiceData.factoring_amount,
            min_inversion: req.body.invoiceData.min_inversion,
            roi: req.body.invoiceData.roi,
            owner: req.body.invoiceData.owner,
            emitter: req.body.invoiceData.emitter
        };

        Factoring.insertInvoice(userData, invoiceData, (err, data) =>{
            console.log(data);
            if(data) {
                res.json({
                    success: true,
                    msg: 'Invoice inserted',
                    data: data
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error: Cannot insert your invoice',
                    data: data
                })
            }
        })
    })
}