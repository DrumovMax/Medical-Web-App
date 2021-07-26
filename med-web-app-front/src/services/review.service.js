import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/reviews/';

class ReviewService {

    getAllReviews() {
        return axios.get(API_URL + 'all',
            {headers: authHeader()});
    }

    saveReview(content, parent= -1) {
        return axios.post(API_URL + 'save',
            {content, parent},{ headers: authHeader() });
    }

}

export default new ReviewService()