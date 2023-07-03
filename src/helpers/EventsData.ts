
import axios from 'axios'
import { baseUrl } from '../modules/auth/helpers/UsersData'


export const eventsLoad = async() => {

    const accessToken = localStorage.getItem('access_token')
    const resp = await axios.get(`${baseUrl}/events`,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return resp
    
}

export const eventsById = async(id:string) => {
    const accessToken = localStorage.getItem('access_token')
    const resp = await axios.get(`${baseUrl}/events/${id}`,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return resp
}

export const searchByQuery = async(searchInput:string) => {
    const accessToken = localStorage.getItem('access_token')

    const resp = await axios.get(`${baseUrl}/search?query=${searchInput}`,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return resp.data.data.events
}


export const createEvent = async(eventForm:Object) => {
    const accessToken = localStorage.getItem('access_token')

    const formData = new FormData()
    formData.append('title',eventForm.title)
    formData.append('description',eventForm.description)
    formData.append('main_picture', eventForm.main_picture)
    formData.append('published', eventForm.published)
    formData.append('date', eventForm.date)
    formData.append('location_name', eventForm.location_name)
    formData.append('location_x', eventForm.location_x)
    formData.append('location_y', eventForm.location_y)
    formData.append('online', eventForm.online)
    formData.append('duration', eventForm.duration)
    formData.append('max_participants', eventForm.max_participants)

    const resp = await axios.post(`${baseUrl}/events`, formData,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    
    return resp
}

export const removeUserEvent = async(id:string) => {
    const accessToken = localStorage.getItem('access_token')
    const response = await axios.delete(`${baseUrl}/events/${id}`,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response
}

export const updateEvent =async (event:object) => {    
    const accessToken = localStorage.getItem('access_token')

    const formData = new FormData()
    formData.append('title',event.title)
    formData.append('description',event.description)
    formData.append('main_picture', event.main_picture)
    formData.append('published', event.published)
    formData.append('date', event.date)
    formData.append('location_name', event.location.name)
    formData.append('location_x', event.location.x)
    formData.append('location_y', event.location.y)
    formData.append('online', event.online)
    formData.append('duration', event.duration)
    formData.append('_method', 'put')    

    const response = await axios.post(`${baseUrl}/events/${event.id}`, formData,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    console.log(response);
    
    return response 
}

export const likeIt = async(id:number) => {
    const accessToken = localStorage.getItem('access_token')

    const resp = await axios.post(`${baseUrl}/events/like/${id}`, null,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return resp    
}