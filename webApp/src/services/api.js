import { supabase } from "./supabaseClient"

/**
 * Data access layer for Flashback Stream.
 * All functions return parsed data or throw a readable error.
 */

export async function fetchGenres() {
  const { data, error } = await supabase.from("genres").select("*").order("id")
  if (error) throw error
  return data
}

export async function fetchGenreBySlug(slug) {
  const { data, error } = await supabase.from("genres").select("*").eq("slug", slug).single()
  if (error) throw error
  return data
}

export async function fetchContents() {
  const { data, error } = await supabase
    .from("contents")
    .select("*, genre:genres(id, name, slug)")
    .order("id")
  if (error) throw error
  return data
}

export async function fetchContentsByGenre(genreId) {
  const { data, error } = await supabase
    .from("contents")
    .select("*, genre:genres(id, name, slug)")
    .eq("genre_id", genreId)
    .order("id")
  if (error) throw error
  return data
}

export async function fetchFeaturedContents(limit = 8) {
  const { data, error } = await supabase
    .from("contents")
    .select("*, genre:genres(id, name, slug)")
    .limit(50)
  if (error) throw error
  // Shuffle client-side for a fresh "Em destaque" selection
  const shuffled = [...data].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, limit)
}

export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("id, content_id, contents(*, genre:genres(id, name, slug))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data.map((row) => ({ favoriteId: row.id, ...row.contents }))
}

export async function fetchFavoriteIds(userId) {
  const { data, error } = await supabase.from("favorites").select("content_id").eq("user_id", userId)
  if (error) throw error
  return data.map((row) => row.content_id)
}

export async function addFavorite(userId, contentId) {
  const { error } = await supabase.from("favorites").insert({ user_id: userId, content_id: contentId })
  if (error) throw error
}

export async function removeFavorite(userId, contentId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("content_id", contentId)
  if (error) throw error
}

export async function fetchPlans() {
  const { data, error } = await supabase.from("plans").select("*").order("price")
  if (error) throw error
  return data
}
