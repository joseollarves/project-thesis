export const useLawyerData = () => useState<Array<Object>>('data', () => [{
    id: '',
    name: '',
    email: '',
    description:'',
    specializations: '',
    profile_picture: '',
}]);