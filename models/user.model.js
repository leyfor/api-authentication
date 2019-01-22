const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
    method: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      required: true
    },
    local: {
        email: {
            type: String,
            //unique: true,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }

    },
    facebook: {
        id: String,
        email: {
            type: String,
            lowercase: true
        } 
    },
    twitter: {
        id: String,
        email: {
            type: String,
            lowercase: true
        } 
    },
    
});

userSchema.pre('save', async function (next) {
    try {

        if (this.method !== 'local') {
            next();
        }
      const salt = await bcrypt.genSalt(10);
     const passwordHash =  await bcrypt.hash(this.local.password, salt);
     this.local.password = passwordHash;
   
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        // The password in the database is the this.password. the new password from the user
      return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        // We don't access to next...
        throw new Error(error)
    }

}


// Create Model
module.exports = mongoose.model('User', userSchema);

// export the Models
//module.exports = User;