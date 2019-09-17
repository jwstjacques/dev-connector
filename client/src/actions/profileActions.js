import axios from 'axios';

import {
  CLEAR_CURRENT_PROFILE,
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  SET_CURRENT_USER
} from './types';

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    });
};

// Create Profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post('/api/profile/', profileData)
    .then((res) => history.push('/dashboard'))
    .catch((err) =>
      dispatch({
        payload: err.response.data,
        type: GET_ERRORS
      })
    );
};

// Delete account & profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm('Are you sure?  This can NOT be undone!')) {
    axios
      .delete('/api/profile')
      .then((res) => {
        dispatch({
          payload: {},
          type: SET_CURRENT_USER
        });
      })
      .catch((err) =>
        dispatch({
          payload: err.response.data,
          type: GET_ERRORS
        })
      );
  }
};

// Profile load
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
