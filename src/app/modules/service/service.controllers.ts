
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Services } from './service.services';

const createService = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await Services.createService(req.body, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service Created Successful',
    data: result,
  });
});

const getAllService = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await Services.getAllService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service Retrieved Successful',
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await Services.updateService(userId, id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service Updated Successful',
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await Services.deleteService(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service Deleted Successful',
    data: result,
  });
});

export const ServiceControllers = {
  createService,
  updateService,
  getAllService,
  deleteService,
};
