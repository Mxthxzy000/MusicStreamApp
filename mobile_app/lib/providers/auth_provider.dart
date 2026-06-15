import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/supabase_service.dart';

class AuthProvider extends ChangeNotifier {
  final SupabaseService _supabaseService = SupabaseService();
  User? _user;
  bool _isLoading = false;
  String? _error;
  DateTime? _lastEmailSent;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _init();
  }

  void _init() {
    if (!SupabaseService.isEnabled) {
      _isLoading = false;
      _user = null;
      notifyListeners();
      return;
    }

    _user = _supabaseService.auth.currentSession?.user;
    _supabaseService.auth.onAuthStateChange.listen((data) {
      _user = data.session?.user;
      notifyListeners();
    });
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _supabaseService.signIn(email, password);
      _user = response?.user;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(
    String email,
    String password,
    Map<String, dynamic> userData,
  ) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Prevent too-frequent email sends (Supabase enforces rate limits)
    if (_lastEmailSent != null) {
      final since = DateTime.now().difference(_lastEmailSent!);
      if (since < const Duration(seconds: 30)) {
        _error =
            'Aguarde ${30 - since.inSeconds} segundos antes de tentar novamente.';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    }

    try {
      final response = await _supabaseService.signUp(email, password, userData);
      _user = response?.user;
      // mark email sent time to avoid immediate retries
      _lastEmailSent = DateTime.now();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      // map known Supabase auth errors to friendly messages
      _error = _friendlyAuthError(e);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await _supabaseService.signOut();
    _user = null;
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> resetPassword(String email) async {
    // Prevent spamming reset requests
    if (_lastEmailSent != null) {
      final since = DateTime.now().difference(_lastEmailSent!);
      if (since < const Duration(seconds: 30)) {
        _error =
            'Aguarde ${30 - since.inSeconds} segundos antes de tentar novamente.';
        return false;
      }
    }

    try {
      await _supabaseService.resetPassword(email);
      _lastEmailSent = DateTime.now();
      return true;
    } catch (e) {
      _error = _friendlyAuthError(e);
      return false;
    }
  }

  String _friendlyAuthError(Object e) {
    final msg = e is Exception ? e.toString() : '$e';
    final lower = msg.toLowerCase();
    if (lower.contains('over_email_send_rate_limit') ||
        lower.contains('rate limit') ||
        lower.contains('429')) {
      return 'Limite de envio de e-mails atingido. Aguarde alguns minutos antes de tentar novamente.';
    }
    if (lower.contains('invalid') && lower.contains('password')) {
      return 'Senha inválida. Verifique e tente novamente.';
    }
    return msg.replaceAll('Exception: ', '');
  }
}
