import 'package:flutter/material.dart';
import '../services/supabase_service.dart';
import '../data/models/genre.dart';
import '../data/models/content.dart';

class ContentProvider extends ChangeNotifier {
  final SupabaseService _supabaseService = SupabaseService();
  List<Genre> _genres = [];
  List<Content> _contents = [];
  List<Content> _featuredContents = [];
  bool _isLoading = false;
  String? _error;
  int? _selectedGenreId;
  String _searchQuery = '';

  List<Genre> get genres => _genres;
  List<Content> get contents => _contents;
  List<Content> get featuredContents => _featuredContents;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int? get selectedGenreId => _selectedGenreId;
  String get searchQuery => _searchQuery;

  Future<void> loadGenres() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _supabaseService.getGenres();
      _genres = response.map((json) => Genre.fromJson(json)).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadContents() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _supabaseService.getContents(
        genreId: _selectedGenreId,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
      );
      _contents = response.map((json) => Content.fromJson(json)).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadFeaturedContents() async {
    try {
      final response = await _supabaseService.getFeaturedContents(6);
      _featuredContents = response
          .map((json) => Content.fromJson(json))
          .toList();
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading featured: $e');
    }
  }

  Future<List<Content>> getContentsByGenre(int genreId) async {
    try {
      final response = await _supabaseService.getContentsByGenre(genreId);
      return response.map((json) => Content.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error loading contents by genre: $e');
      return [];
    }
  }

  Future<Content?> getContentById(int id) async {
    try {
      final response = await _supabaseService.getContentById(id);
      return Content.fromJson(response);
    } catch (e) {
      debugPrint('Error loading content: $e');
      return null;
    }
  }

  void setGenreFilter(int? genreId) {
    _selectedGenreId = genreId;
    loadContents();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    loadContents();
  }

  void clearFilters() {
    _selectedGenreId = null;
    _searchQuery = '';
    loadContents();
  }
}
