const User = require('../models/user');

module.exports = function (app){
    app.get('/', (req, res)=>{
        res.json([]);
    });

    //Get existing users
    app.get('/client', (req, res) =>{
        User.getClient((err, data) => {
            res.json(data);
        });
    });    

    //Insert new users
    app.post('/users', (req, res) =>{
        const userData = {
            id: null,
            rol: req.body.rol,
            email: req.body.email,
            password: req.body.password,
            company: req.body.company,
            created_at: null,
        };
        
        User.insertUser(userData, (err, data) =>{
            if(data && data.insertId){
                res.json({
                    success: true,
                    msg: 'User inserted',
                    data: data   
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error: Cannot insert user'

                })
            }
        })
    })

    //Update user information
    app.put('/users', (req, res) =>{
        const userData = {
            id: req.body.id,
            rol: req.body.rol,
            email: req.body.email,
            password: req.body.password,
            company: req.body.company,
            created_at: null,
        };

        User.updateUser(userData, (err, data) =>{
            if(data && data.msg){
                res.json({
                    success: true,
                    msg: 'User updated',
                    data: data   
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error: Cannot update user'

                })
            }
        })
    })


    app.delete('/users', (req, res) =>{
        User.deleteUser(req.body.id, (err, data) =>{
            
            if(data && data.msg === "success"){
                res.json({
                    success: true,
                    msg: 'User deleted',
                    data: data   
                })
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'Error: This user dont exist'

                })
            }
        })
    })
}