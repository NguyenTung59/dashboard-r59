import { combineReducers } from 'redux';
import AuthReducer from './auth';
import UserReducer from './users';
import SparklineData from './sparkline-data'
import CoreReducer from './core';

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
	users: UserReducer,
	auth: AuthReducer,
	sparkline: SparklineData,
	cores: CoreReducer
});

export default allReducers