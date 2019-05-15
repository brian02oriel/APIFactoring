const Factoring = require('../models/factoring');

module.exports = function (app) {
    
    //Get all the invoices depending the role
    app.get('/dashboard', (req, res) => {
        const userData = {
            id: req.query.id,
            rol: req.query.rol
        }
        console.log(req.query);
        //console.log(req.params);
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

    //Only Supplier can insert invoices
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

    //Only the Client can change an invoice state
    app.put('/state', (req, res)=>{
        const userData = {
            id: req.body.userData.id,
            rol: req.body.userData.rol
        }

        const invoiceData = {
            id: req.body.invoiceData.id,
            new_state: req.body.invoiceData.state
        }

        Factoring.changeInvoiceState(userData, invoiceData, (err, data)=>{
            if(data) {
                res.json({
                    success: true,
                    data: data
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error: Cannot update invoice state',
                    data: data
                })
            }
        })
    })

    //Preguntar si las facturas se pueden borrar antes de ser aprobadas


}