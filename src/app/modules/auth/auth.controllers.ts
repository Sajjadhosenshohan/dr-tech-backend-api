import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthLogic } from './auth.services';

const handleUserLogin = catchAsync(async (req, res) => {
  const result = await AuthLogic.processUserLogin(req.body);

  res.cookie('dr_tech_token', result?.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 10,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login completed successfully',
    data: result,
  });
});

const fetchLoggedInUser = catchAsync(async (req, res) => {
  const result = await AuthLogic.retrieveLoggedUserData(req?.user?.userEmail);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Current user fetched successfully',
    data: result,
  });
});

export const AuthController = {
  handleUserLogin,
  fetchLoggedInUser,
};
