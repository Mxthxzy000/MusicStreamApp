import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/favorites_provider.dart';

class FavoriteButton extends StatefulWidget {
  final int contentId;
  final double size;

  const FavoriteButton({super.key, required this.contentId, this.size = 24});

  @override
  State<FavoriteButton> createState() => _FavoriteButtonState();
}

class _FavoriteButtonState extends State<FavoriteButton> {
  bool _isFavorite = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _checkFavorite();
  }

  Future<void> _checkFavorite() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (!authProvider.isAuthenticated) return;

    final favoritesProvider = Provider.of<FavoritesProvider>(
      context,
      listen: false,
    );
    final isFav = await favoritesProvider.isFavorite(
      authProvider.user!.id,
      widget.contentId,
    );

    if (mounted) {
      setState(() {
        _isFavorite = isFav;
      });
    }
  }

  Future<void> _toggleFavorite() async {
    if (_isLoading) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (!authProvider.isAuthenticated) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Faça login para favoritar')),
        );
      }
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final favoritesProvider = Provider.of<FavoritesProvider>(
      context,
      listen: false,
    );
    bool success;

    if (_isFavorite) {
      success = await favoritesProvider.removeFavorite(
        authProvider.user!.id,
        widget.contentId,
      );
    } else {
      success = await favoritesProvider.addFavorite(
        authProvider.user!.id,
        widget.contentId,
      );
    }

    if (success && mounted) {
      setState(() {
        _isFavorite = !_isFavorite;
      });
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: _toggleFavorite,
      icon: _isLoading
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _isFavorite ? Colors.pink : Colors.white,
              size: widget.size,
            ),
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(),
    );
  }
}
