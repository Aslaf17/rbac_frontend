import api from './axiosConfig'

export const getAttendanceBySession = (sessionId) =>
	api.get(`/attendance/session/${sessionId}`).then((res) => res.data)

export const getAttendanceByStudent = (studentId) => {
	console.log("Calling API with:", studentId);

	return api
		.get(`/attendance/student/${studentId}`)
		.then((res) => res.data);
};

export const markAttendance = (payload) =>
	api.post('/attendance/mark', payload).then((res) => res.data)

export const updateAttendance = (payload) =>
	api.put('/attendance/update', payload).then((res) => res.data)

export const logoutAttendance = (payload) =>
	api.put('/attendance/logout', payload).then((res) => res.data)
