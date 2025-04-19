import { supabase } from './client'

export const addArticle = async (articleData) => {
  try {
    // First, upload images to storage if they exist
    const timestamp = new Date().getTime()
    let thumbnailUrl = null
    let mainImageUrl = null

    if (articleData.thumbnail) {
      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from('article-images')
        .upload(`thumbnail-${timestamp}`, articleData.thumbnail)

      if (thumbnailError) throw thumbnailError
      thumbnailUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/article-images/${thumbnailData.path}`
    }

    if (articleData.mainImage) {
      const { data: mainImageData, error: mainImageError } = await supabase.storage
        .from('article-images')
        .upload(`main-${timestamp}`, articleData.mainImage)

      if (mainImageError) throw mainImageError
      mainImageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/article-images/${mainImageData.path}`
    }

    // Then, insert article data into the database
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title: articleData.title,
          content: articleData.content,
          youtube_link: articleData.youtubeLink,
          language: articleData.language,
          publish_date: articleData.publishDate,
          status: articleData.status,
          thumbnail_url: thumbnailUrl,
          main_image_url: mainImageUrl,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return data[0].id

  } catch (error) {
    console.error('Error adding article:', error)
    throw error
  }
}

export const getArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateArticle = async (id, articleData) => {
  // Similar to addArticle but with update logic
  // Implementation depends on your update requirements
}

export const deleteArticle = async (id) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw error
  return id
}