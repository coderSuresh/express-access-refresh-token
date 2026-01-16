import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/api-response.js";

const requireLogin = (req, res, next) => {
    const accessToken = req.cookies['access_token'];

    if (!accessToken) {
        return apiResponse.badRequest(res, 'Access token is required');
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return apiResponse.unauthorized(res, 'Invalid or expired access token');
    }
};

export default requireLogin;