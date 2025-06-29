import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/auth.utils';
import { User } from '../user/user.model';
import { TAuth } from './auth.types';

// Authenticate and Login User
const processUserLogin = async (credentials: TAuth) => {
  const existingUser = await User.isExistUserByEmailOrNumber(credentials.email);

  if (!existingUser) {
    throw new AppError(400, 'User not found');
  }

  const isPasswordCorrect = await User.isPasswordMatched(
    credentials.password,
    existingUser?.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError(400, 'Incorrect email or password');
  }

  const jwtPayload = {
    userEmail: existingUser?.email,
    role: existingUser?.role,
    userId: existingUser?._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_TOKEN_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return { accessToken };
};

// Get Logged User Details
const retrieveLoggedUserData = async (email: string) => {
  const loggedUser = await User.findOne({ email });
  return loggedUser;
};

export const AuthLogic = {
  processUserLogin,
  retrieveLoggedUserData,
};
