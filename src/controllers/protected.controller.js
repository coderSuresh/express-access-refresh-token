import { apiResponse } from "../utils/api-response.js";

// dummy for test
const getData = async (req, res) => {
    try {
        const data = { info: 'This is protected data accessible only to logged-in users.' };
        return apiResponse.success(res, 'Data retrieved successfully', { data });
    } catch (error) {
        return apiResponse.error(res, error.message);
    }
};

export { getData };