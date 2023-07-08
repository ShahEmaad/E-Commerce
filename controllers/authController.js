import colors from 'colors';
import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

//POST REGISTER
export const registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address} = req.body;
        //Validations
        if(!name){
            return res.send({error : 'Name is Required'});
        }
        if(!email){
            return res.send({error : 'Email is Required'});
        }
        if(!password){
            return res.send({error : 'Password is Required'});
        }
        if(!phone){
            return res.send({error : 'Phone no is Required'});
        }
        if(!address){
            return res.send({error : 'Address is Required'});
        }
        //Check User
        const existingUser = await userModel.findOne({email : email});
        //Existing User
        if(existingUser){
            return res.status(200).send({
                success : true,
                message : "Already Registered Please Login"
            })
        }
        //Regidter User
        const hashedPassword = await hashPassword(password);
        //Save
        const user = await new userModel({name,email,password : hashedPassword,phone,address}).save();
        
        res.send({
            success : true,
            message : "Successfully Registered User",
            user
        })

    } catch (error) {
        console.log(`${error}`.bgRed.white);
        res.status(500).send({
            success : false,
            message : 'Error in Registration',
            error
        })
    }
};

//POST LOGIN
export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body;
        //Validate
        if(!email || !password){
            res.status(404).send({
                success : false,
                message : 'Invalid user or password',
            })
        }
        //Check User
        const user = await userModel.findOne({email : email});
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'Invalid email'
            })
        }
        //Compare Password
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success : false,
                message : 'Invalid password',
            })
        }
        //Token
        const token = await JWT.sign({_id : user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.status(200).send({
            success : true,
            message : 'Login Successfull',
            user:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })
    } catch (error) {
        console.log(`${error}`.bgRed.white);
        res.status(500).send({
            success : false,
            message : 'Error in Login',
            error
        })
    }
};

//TEST CONTRLLER
export const testController = (req,res) => {
    res.send("Protected Route");
}; 