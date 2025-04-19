import { supabase } from './client'

const BUCKET_NAME = 'article-images'

export const uploadImage = async (file, prefix) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${prefix}-${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file)

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error(`Error uploading ${prefix}:`, error)
    throw new Error(`Failed to upload ${prefix} image`)
  }
}

export const addArticle = async (articleData) => {
  try {
    let thumbnailUrl = null
    let mainImageUrl = null

    if (articleData.thumbnail) {
      thumbnailUrl = await uploadImage(articleData.thumbnail, 'thumbnail')
    }
    if (articleData.mainImage) {
      mainImageUrl = await uploadImage(articleData.mainImage, 'main')
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: articleData.title,
        content: articleData.content,
        youtube_link: articleData.youtubeLink,
        language: articleData.language,
        publish_date: articleData.publishDate,
        status: articleData.status,
        thumbnail_url: thumbnailUrl,
        main_image_url: mainImageUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding article:', error)
    throw new Error('Failed to add article')
  }
}

export const getArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw new Error('Failed to fetch articles')
  }
}

export const deleteArticle = async (id) => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting article:', error)
    throw new Error('Failed to delete article')
  }
}