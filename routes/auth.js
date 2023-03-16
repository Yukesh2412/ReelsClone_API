const router = require('express').Router();
const verify = require('./verification');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const SHA_256 = "7419bdb1d6689a4bcc1d6a2ef82eba13bee46961866bf304497c2a6e85fb08b9"

router.post('/register', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password
    const confirmPassword = req.body.confirm_password

    //Check email exists or not
    const emailExists = await User.findOne({email : email})
    if(emailExists !== null) return res.json({message : "Email already exists."})

    await bcrypt.genSalt(11, async function(err, salt) {

        if(err) return res.json(err);

        if(password === confirmPassword){

            const hashPassword = await bcrypt.hash(password, salt);

            try {
                const new_user = new User({
                    id : uuid(),
                    email : email,
                    password : hashPassword
                })

                await new_user.save()

                //Create and assign a token
                const token = generateJWT(new_user.id);
                res.header('auth-token', token).json({ message: token });

            } catch (error) {
                console.log(error);
            }

        }

    });

});


router.post("/login", async (req, res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    
    const user = await User.findOne({email : email});
    if(!user) return res.json({message : "This is not a registered email address"}).status(400);

    try{

        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.json({message : "Email or Password is invalid."});

        const token = generateJWT(user.id);

        return res.header('auth-token', token).json({message : token});

    }
    catch (err){
        console.log(err);
    }

})


function generateJWT(userid) {
    return jwt.sign({ id: userid }, SHA_256, { expiresIn: '30d' });
}


module.exports = router;