
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SpecializationServices } from './specialization..services';


const createSpecialization = catchAsync(async (req, res) => {
  const result = await SpecializationServices.specializationSaveToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialization Created Successful',
    data: result,
  });
});


const getAllSpecialization = catchAsync(async (req, res) => {
  const result = await SpecializationServices.getAllSpecialization();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialization Retrieved Successful',
    data: result,
  });
});


const getSingleSpecialization = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecializationServices.getSingleSpecialization(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Specialization Retrieved Successful',
    data: result,
  });
});

export const SpecializationControllers = {
  createSpecialization,
  getAllSpecialization,
  getSingleSpecialization,
};
