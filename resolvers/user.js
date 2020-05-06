const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

const { generateToken } = require('../utils');

module.exports = {
  Query: {
    async me (parent, args, context) {
      const { authUser, models } = context;
      if (!authUser) {
        throw new AuthenticationError('Unauthenticated');
      }

      return models.User.findByPk(authUser.id);
    },

    async user (parent, args, context) {
      const { authUser, models } = context;
      const { username } = args;

      const user = await models.User.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        throw new ApolloError('No user found');
      }

      return user;
    },
  },

  Mutation: {
    async signUp (parent, args, context) {
      const { models } = context;
      const { username, email, password } = args;

      if (!username || !email || !password) {
        throw new UserInputError('Missing fields');
      }

      const userExists = await models.User.findOne({ where: { email } });

      if (userExists) {
        throw new ApolloError('User already exists.');
      }

      const user = await models.User.create({
        username,
        email,
        password,
      });

      const token = generateToken(user);

      return { token };
    },

    async signIn (parent, args, context) {
      const { models } = context;
      const { email, password } = args;

      if (!email || !password) {
        throw new UserInputError('Missing fields');
      }

      const user = await models.User.findOne({ where: { email } });

      if (!user) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const token = generateToken(user);

      return { token };
    },

    async updateUser (parent, args, context) {
      const { models, authUser } = context;
      const { username, email } = args;

      const user = await models.User.findByPk(authUser.id);
      await user.update({
        username,
        email,
      });

      return user;
    },

    async changePassword (parent, args, context) {
      const { models, authUser } = context;
      const { currentPassword, newPassword } = args;

      if (!currentPassword || !newPassword) {
        throw new UserInputError('Missing fields');
      }

      const user = await models.User.findByPk(authUser.id);

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ApolloError('Current password could not be verified.');
      }

      await user.update({
        password: newPassword,
      });

      return user;
    },

    async uploadAvatar (parent, args, context) {
      const { models, authUser } = context;
      const { avatar } = args;

      const { createReadStream } = await avatar;

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      try {
        const result = await new Promise((resolve, reject) => {
          createReadStream()
            .pipe(cloudinary.uploader.upload_stream((error, result) => {
              if (error) {
                reject(error);
              }
    
              resolve(result);
            }));
          });
        console.log(result);

        const user = await models.User.findByPk(authUser.id);

        await user.update({
          avatar: result.secure_url,
        });
        return user;
      } catch (error) {
        throw new ApolloError('There was a problem uploading your avatar.');
      }
    },
  },

  User: {
    threads (user) {
      return user.getThreads();
    }
  },
};
