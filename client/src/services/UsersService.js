import Api from '@/services/Api'

export default {
  fetchUsers () {
    return Api().get('users');
  },
  addUser (params) {
    return Api().post('users', params)
  },
  updateUser(params) {
   return Api().put('users/' + params._id, params)
 },
  getUser (params) {
    return Api().get('user/' + params.id)
  }
}
