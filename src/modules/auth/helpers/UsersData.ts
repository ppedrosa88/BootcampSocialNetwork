import axios from "axios";
import { toast } from "vue3-toastify";

export interface UsersData {

    name?: string;
    email: string;
    password?: string;
    newPassword?: string;

}

export const baseUrl = 'https://bootcamp-api.itexon.net/api'


export const loginUser = async (user:UsersData) => {
    try {
        const {data} = await axios.post(`${baseUrl}/login`, user)
        asignAccessToken(data.data)
        return data
    } catch(response) {        
        return response.response.data.data
    }
}

export const updatePassword = async(user:UsersData) => {

    const {password, newPassword} = user
    const accessToken = localStorage.getItem('access_token')

    const response = await axios.post(`${baseUrl}/update-password`,
        {
            old_password: password, 
            password: newPassword
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((resp) => {
            toast.success("Se ha actualizado la contraseña correctamente", {
                autoClose:1000,
              })            
        }).catch((error) => {
            toast.error("Contraseña no válida", {
                autoClose:1000,
              })
        })
}

export const forgotPassword = async (user:UsersData) => {
    const {email} = user
    const resp = await axios.post(`${baseUrl}/forgot-password`, {email: email})
}

const asignAccessToken = async({access_token, user}) => {
    if( access_token ) {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('id',user.id)
    }
}

export const getUserImage = async (accessToken?: string) => {
    const response = await axios.get(
        `${baseUrl}/me`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response
}

export const UploadImage = async (file: File, accessToken?:string) => {
    
    const formData =  new FormData()

    formData.append('avatar', file)

    const response = await axios.post(
        `${baseUrl}/me/profile/update`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response
    
}


export const finishSession =async () => {
    const accessToken = localStorage.getItem('access_token')

    const resp = axios.post(`${baseUrl}/logout`, null,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('id')
    }).catch()
    
}