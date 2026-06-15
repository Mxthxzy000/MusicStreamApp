import 'package:flutter/material.dart';
import '../../services/supabase_service.dart';
import '../../data/models/genre.dart';
import '../../data/models/content.dart';
import '../../widgets/content_card.dart';
import '../../widgets/shimmer_placeholder.dart';

class GenreScreen extends StatefulWidget {
  final String slug;

  const GenreScreen({super.key, required this.slug});

  @override
  State<GenreScreen> createState() => _GenreScreenState();
}

class _GenreScreenState extends State<GenreScreen> {
  final SupabaseService _supabaseService = SupabaseService();
  Genre? _genre;
  List<Content> _contents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final genreData = await _supabaseService.getGenreBySlug(widget.slug);
      _genre = Genre.fromJson(genreData);

      final contentsData = await _supabaseService.getContentsByGenre(
        _genre!.id,
      );
      _contents = contentsData.map((json) => Content.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error loading genre data: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_genre?.name ?? 'Carregando...')),
      body: _isLoading
          ? GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: 6,
              itemBuilder: (context, index) {
                return const ShimmerPlaceholder();
              },
            )
          : _contents.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.music_off, size: 64, color: Colors.white54),
                  const SizedBox(height: 16),
                  Text(
                    'Nenhum conteúdo encontrado',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ],
              ),
            )
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: _contents.length,
              itemBuilder: (context, index) {
                return ContentCard(content: _contents[index]);
              },
            ),
    );
  }
}
