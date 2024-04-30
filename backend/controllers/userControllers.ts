import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { checkUserExists, createUser } from '../models/userModel';

//@desc register a new user
//@route POST /api/users
//@access Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const userExists = await checkUserExists(email);

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await createUser(email, password);
})