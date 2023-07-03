import { toast } from 'vue3-toastify'
import { UsersData, baseUrl } from '../modules/auth/helpers/UsersData'
import axios from 'axios'
import mitt from 'mitt'

export const emitter = mitt()
export interface PostsData {

    id?: number,
    title?: string,
    content?: string,
    main_picture?: File,
    publish_date?: Date,
    user?: UsersData

}

export const loadPosts = async(accessToken: string | null) => {

    const  response  = await axios.get(`${baseUrl}/posts`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        
        return response.data.data
         
}

export const postById = async(accessToken: string | null, id: string | null) => {
    const response = await axios.get(`${baseUrl}/posts/${id}`,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return response.data.data
}

export const postContent = async(accessToken: String | null, postForm: PostsData) => {

    const formData = new FormData()
    const currentDate = new Date()
    const timeStamp = Math.floor(currentDate.getTime() / 1000).toString()

    if (postForm.title !== undefined) {
        formData.append('title', postForm.title)
    }

    if (postForm.content !== undefined) {
        formData.append('content',postForm.content)
    }

    if (postForm.main_picture) {
        formData.append('main_picture', postForm.main_picture)
    }

    formData.append('publish_date', timeStamp)

    const response = await axios.post(`${baseUrl}/posts`, formData, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    return response  

}

export const updatePost = async(accessToken: String | null, postForm: PostsData,id: String) => {
    
    const formData = new FormData()
    const currentDate = new Date()
    const timeStamp = Math.floor(currentDate.getTime() / 1000).toString()

    if (postForm.title !== undefined) {
        formData.append('title', postForm.title)
    }

    if (postForm.content !== undefined) {
        formData.append('content',postForm.content)
    }

    if (postForm.main_picture) {        
        formData.append('main_picture', postForm.main_picture)
    }

    formData.append('publish_date', timeStamp)
    formData.append('_method', 'put')

    await axios.post(`${baseUrl}/posts/${id}`, formData, 
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const removeUserPost =async (accessToken: String | null, id: Number | undefined) => {
    await axios.delete(`${baseUrl}/posts/${id}`,
    {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then(() => {
        return true  
    }).catch(() => {
        toast.error("Ha habido un error al eliminar", {
            autoClose:1000,
        })
    })
}

export const searchByQuery = async(searchInput:string) => {
    const accessToken = localStorage.getItem('access_token')

        const resp = await axios.get(`${baseUrl}/search?query=${searchInput}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })        
        return resp.data.data.posts
}

