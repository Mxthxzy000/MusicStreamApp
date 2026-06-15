import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  static bool _enabled = false;

  static Future<void> initialize() async {
    await dotenv.load();

    final url = dotenv.env['SUPABASE_URL'];
    final anonKey = dotenv.env['SUPABASE_ANON_KEY'];

    // Basic validation to avoid attempts to call a placeholder host
    if (url == null || anonKey == null || url.isEmpty || anonKey.isEmpty) {
      _enabled = false;
      // don't initialize Supabase if env not configured
      // caller should see clear messages instead of low-level socket exceptions
      // Log a helpful message
      // ignore: avoid_print
      print(
          'Supabase not configured: set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
      return;
    }

    if (url.contains('your-project') || anonKey.contains('your-anon-key')) {
      _enabled = false;
      // ignore: avoid_print
      print('Supabase contains placeholder values; skipping initialization.');
      return;
    }

    await Supabase.initialize(url: url, anonKey: anonKey);
    _enabled = true;
  }

  static void _ensureEnabled() {
    if (!_enabled) {
      throw StateError(
          'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.');
    }
  }

  /// Public flag to check if Supabase was initialized successfully
  static bool get isEnabled => _enabled;

  SupabaseClient get client {
    _ensureEnabled();
    return Supabase.instance.client;
  }

  GoTrueClient get auth {
    _ensureEnabled();
    return Supabase.instance.client.auth;
  }

  // Auth Methods (use dynamic to stay compatible across supabase versions)
  Future<dynamic> signUp(
    String email,
    String password,
    Map<String, dynamic> data,
  ) async {
    _ensureEnabled();
    return await auth.signUp(email: email, password: password, data: data);
  }

  Future<dynamic> signIn(String email, String password) async {
    _ensureEnabled();
    return await auth.signInWithPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    _ensureEnabled();
    await auth.signOut();
  }

  Future<void> resetPassword(String email) async {
    _ensureEnabled();
    await auth.resetPasswordForEmail(email);
  }

  // Genres
  Future<List<Map<String, dynamic>>> getGenres() async {
    return await client.from('genres').select().order('name');
  }

  Future<Map<String, dynamic>> getGenreBySlug(String slug) async {
    return await client.from('genres').select().eq('slug', slug).single();
  }

  // Contents
  Future<List<Map<String, dynamic>>> getContents({
    int? genreId,
    String? search,
  }) async {
    var query = client.from('contents').select('*, genres(name, slug)');

    if (genreId != null) {
      query = query.eq('genre_id', genreId);
    }
    if (search != null && search.isNotEmpty) {
      query = query.ilike('title', '%$search%');
    }

    return await query.order('title');
  }

  Future<List<Map<String, dynamic>>> getContentsByGenre(int genreId) async {
    return await client
        .from('contents')
        .select('*, genres(name, slug)')
        .eq('genre_id', genreId)
        .order('title');
  }

  Future<Map<String, dynamic>> getContentById(int id) async {
    return await client
        .from('contents')
        .select('*, genres(name, slug)')
        .eq('id', id)
        .single();
  }

  Future<List<Map<String, dynamic>>> getFeaturedContents(int limit) async {
    return await client
        .from('contents')
        .select('*, genres(name, slug)')
        .limit(limit);
  }

  // Favorites
  Future<List<Map<String, dynamic>>> getFavorites(String userId) async {
    return await client
        .from('favorites')
        .select('*, contents(*)')
        .eq('user_id', userId);
  }

  Future<void> addFavorite(String userId, int contentId) async {
    await client.from('favorites').insert({
      'user_id': userId,
      'content_id': contentId,
    });
  }

  Future<void> removeFavorite(String userId, int contentId) async {
    await client
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId);
  }

  Future<bool> isFavorite(String userId, int contentId) async {
    final result = await client
        .from('favorites')
        .select()
        .eq('user_id', userId)
        .eq('content_id', contentId);
    return result.isNotEmpty;
  }

  // Plans
  Future<List<Map<String, dynamic>>> getPlans() async {
    return await client.from('plans').select().order('price');
  }
}
