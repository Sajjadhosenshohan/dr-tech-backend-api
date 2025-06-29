import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HospitalServices } from './hospital.services';

const createHospital = catchAsync(async (req, res) => {
  const result = await HospitalServices.hospitalSaveToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital Created Successful',
    data: result,
  });
});


const getAllHospital = catchAsync(async (req, res) => {
  const result = await HospitalServices.getAllHospital();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital Retrieved Successful',
    data: result,
  });
});


const getSingleHospital = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HospitalServices.getSingleHospital(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hospital Retrieved Successful',
    data: result,
  });
});

export const HospitalControllers = {
  createHospital,
  getAllHospital,
  getSingleHospital,
};
