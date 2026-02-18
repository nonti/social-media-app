import jwt from 'jsonwebtoken';
import HttpError from '../models/errorModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cloudinary from '../../utils/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REGISTER USER
//POST: /api/users/register
// UNPROTECTED
export const registerUser = async (req, res, next) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;
    if( !fullname || !email || !password || !confirmPassword ) {
      return next(new HttpError('All fields are required', 422));
    }

    //make email lowercase
    const lowerCasedEmail = email.toLowerCase();
    // check if user already exists
    const existingEmail = await User.findOne({ email: lowerCasedEmail });
    if(existingEmail) {
      return next(new HttpError('Email already exists', 422));
    }

    if(password !== confirmPassword) {
      return next(new HttpError('Passwords do not match', 422));
    }

    // check password length
    if(password.length < 8) {
      return next(new HttpError('Password must be at least 8 characters', 422));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      fullname,
      email: lowerCasedEmail,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ newUser, message: 'User registered successfully' });
  } catch (error) {
    return next(new HttpError(error))
  }
}
 

// LOGIN USER
//POST: /api/users/login
// UNPROTECTED
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if( !email || !password ) {
      return next(new HttpError('Fill fields are required', 422));
    }

    const lowerCasedEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowerCasedEmail });
    if(!user) {
      return next(new HttpError('Invalid credentials', 422));
    }

    const comparePassword = await bcrypt.compare(password, user?.password);
    if(!comparePassword) {
      return next(new HttpError('Invalid credentials', 422));
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, id: user._id, user, message: 'User logged in successfully' });
  } catch (error) {
    return next(new HttpError(error))
  }
}


// GET USER 
//GET: /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const user = await User.findById(id).select('-password').populate('followers following bookmarks posts');
      const user = await User.findById(id).select('-password');
    if(!user) {
      return next(new HttpError('User not found', 404));
    }
    
    res.status(200).json({ user, message: 'User retrieved successfully' });
  } catch (error) {
    return next(new HttpError(error))
  }

}

// GET ALL USERS
// GET: /api/users
// PROTECTED
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').limiit(10).sort({ createdAt: -1 });
    res.status(200).json({ users,message: 'All users retrieved successfully' });
  } catch (error) {
    return next(new HttpError(error))
  }
}

// EDIT USER
// PATCH: /api/users/edit
// PROTECTED
export const updateUser = async (req, res, next) => {
  try {
    const {fullname, bio} = req.body;
    if(!fullname || !bio) {
      return next(new HttpError('All fields are required', 422));
    }

    const editedUser = await User.findByIdAndUpdate(req.user.id, { fullname, bio }, { new: true }).select('-password');
    
    res.status(200).json({ editedUser, message: 'User updated successfully' });
  } catch (error) {
    return next(new HttpError(error))
  }
}


// FOLLOW-UNFOLLOW USER 
// PATCH: /api/users/:id/follow-unfollow
export const followUnfollowUser = async (req, res, next) => {
  try {
    const userToFollowId = req.params.id;
    if (req.user.id === userToFollowId) {
      return next(new HttpError('You cannot follow/unfollow yourself', 422));
    }

    const currentUser = await User.findById(req.user.id);
    const isFollowing = currentUser.following.includes(userToFollowId);
    // follow if not following, unfollow if already following
    if (!isFollowing) {
      const updatedUser = await User.findByIdAndUpdate(userToFollowId,
        { $push: { followers: req.user.id } }, { new: true })
      await User.findByIdAndUpdate(req.user.id, { $push: { following: userToFollowId } }, { new: true })
      res.json(updatedUser)
    } else {
      const updatedUser = await User.findByIdAndUpdate(userToFollowId,
        { $pull: { followers: req.user.id } }, { new: true })
      await User.findByIdAndUpdate(req.user.id, { $pull: { following: userToFollowId } }, { new: true })
      res.json(updatedUser)
    }
    res.status(200).json({ message: 'User followed/unfollowed successfully' });
  } catch (error) {
    return next(new HttpError(error))
  }
}

// CHANGE AVATAR
// POST: /api/users/avatar
// PROTECTED
export const changeAvatar = async (req, res, next) => {
  try {
    if(!req.files || !req.files.avatar) {
      return next(new HttpError('No file uploaded', 422));
    }

    const { avatar } = req.files;
    if (avatar.size > 500000) {
      return next(new HttpError('File size must be less than 50KB', 422));
    }

    let filename = avatar.name;
    let splitFilename = filename.split('.');
    let newFilename= splitFilename[0]  + uuidV4() + '.' + splitFilename[splitFilename.length - 1];
    avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => { 
      if (err) {
        return next(new HttpError(err));
      }

      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads', newFilename),
      { resource_type: 'image' })
      
      if (!result.secure_url) {
        return next(new HttpError('Error uploading file to cloudinary', 500));
      }

      const updatedUser = await User.findByIdAndUpdate(req.user?.id, { profileAvatar: result?.secure_url }, { new: true }).select('-password');
      res.status(200).json({ updatedUser, message: 'Avatar changed successfully' });
    })
      ;

  } catch (error) {
    return next(new HttpError(error))
  }
}