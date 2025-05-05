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
    return data || []
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
  } catch (error) {
    console.error('Error deleting article:', error)
    throw new Error('Failed to delete article')
  }
}

export const getArticle = async (id) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error('Failed to fetch article');
  }
};

export const updateArticle = async (id, articleData) => {
  try {
    let thumbnailUrl = articleData.thumbnail_url;
    let mainImageUrl = articleData.main_image_url;

    // Upload new images if provided
    if (articleData.thumbnail instanceof File) {
      thumbnailUrl = await uploadImage(articleData.thumbnail, 'thumbnail');
    }
    if (articleData.mainImage instanceof File) {
      mainImageUrl = await uploadImage(articleData.mainImage, 'main');
    }

    const { data, error } = await supabase
      .from('articles')
      .update({
        title: articleData.title,
        content: articleData.content,
        youtube_link: articleData.youtubeLink,
        language: articleData.language,
        status: articleData.status,
        thumbnail_url: thumbnailUrl,
        main_image_url: mainImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw new Error('Failed to update article');
  }
};

export const updateArticleStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating article status:', error);
    throw new Error('Failed to update article status');
  }
};