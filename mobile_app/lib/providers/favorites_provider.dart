import 'package:flutter/material.dart';
import '../services/supabase_service.dart';
import '../data/models/content.dart';

class FavoritesProvider extends ChangeNotifier {
  final SupabaseService _supabaseService = SupabaseService();
  List<Content> _favorites = [];
  bool _isLoading = false;

  List<Content> get favorites => _favorites;
  bool get isLoading => _isLoading;
  int get favoritesCount => _favorites.length;

  Future<void> loadFavorites(String userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _supabaseService.getFavorites(userId);
      _favorites = response
          .map((item) => Content.fromJson(item['contents']))
          .toList();
    } catch (e) {
      debugPrint('Error loading favorites: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addFavorite(String userId, int contentId) async {
    try {
      await _supabaseService.addFavorite(userId, contentId);
      await loadFavorites(userId);
      return true;
    } catch (e) {
      debugPrint('Error adding favorite: $e');
      return false;
    }
  }

  Future<bool> removeFavorite(String userId, int contentId) async {
    try {
      await _supabaseService.removeFavorite(userId, contentId);
      await loadFavorites(userId);
      return true;
    } catch (e) {
      debugPrint('Error removing favorite: $e');
      return false;
    }
  }

  Future<bool> isFavorite(String userId, int contentId) async {
    try {
      return await _supabaseService.isFavorite(userId, contentId);
    } catch (e) {
      debugPrint('Error checking favorite: $e');
      return false;
    }
  }
}
