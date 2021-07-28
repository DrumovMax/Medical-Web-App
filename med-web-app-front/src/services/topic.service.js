import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL + '/api/topics/';

class TopicService {

    getAllTopics() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    saveTopic(topicName) {
        return axios.post(API_URL + 'save', {topicName: topicName},{ headers: authHeader() });
    }
}

export default new TopicService();