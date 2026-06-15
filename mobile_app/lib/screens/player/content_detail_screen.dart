import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/player_provider.dart';
// removed unused provider imports
import '../../services/supabase_service.dart';
import '../../data/models/content.dart';
import '../../widgets/favorite_button.dart';
import '../../widgets/shimmer_placeholder.dart';

class ContentDetailScreen extends StatefulWidget {
  final int contentId;

  const ContentDetailScreen({super.key, required this.contentId});

  @override
  State<ContentDetailScreen> createState() => _ContentDetailScreenState();
}

class _ContentDetailScreenState extends State<ContentDetailScreen> {
  final SupabaseService _supabaseService = SupabaseService();
  Content? _content;
  bool _isLoading = true;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Future<void> _loadContent() async {
    try {
      final data = await _supabaseService.getContentById(widget.contentId);
      if (mounted) {
        setState(() {
          _content = Content.fromJson(data);
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading content: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _togglePlay() {
    if (_content?.previewUrl == null) return;

    final playerProvider = Provider.of<PlayerProvider>(context, listen: false);

    if (playerProvider.currentContentId == widget.contentId.toString() &&
        playerProvider.isPlaying) {
      playerProvider.pause();
      setState(() => _isPlaying = false);
    } else if (playerProvider.currentContentId == widget.contentId.toString() &&
        !playerProvider.isPlaying) {
      playerProvider.resume();
      setState(() => _isPlaying = true);
    } else {
      playerProvider.playPreview(
        widget.contentId.toString(),
        _content!.previewUrl!,
      );
      setState(() => _isPlaying = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_content == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Erro')),
        body: const Center(child: Text('Conteúdo não encontrado')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(_content!.title),
        actions: [FavoriteButton(contentId: _content!.id)],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Image
            AspectRatio(
              aspectRatio: 1,
              child: CachedNetworkImage(
                imageUrl: _content!.coverUrl,
                fit: BoxFit.cover,
                placeholder: (context, url) => const ShimmerPlaceholder(),
                errorWidget: (context, url, error) => Container(
                  color: Colors.grey[800],
                  child: const Icon(
                    Icons.album,
                    size: 100,
                    color: Colors.white54,
                  ),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    _content!.title,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),

                  // Genre
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.primary.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _content!.genreName,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.secondary,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Synopsis
                  Text(
                    'Sinopse',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  Text(_content!.synopsis, style: const TextStyle(height: 1.6)),

                  const SizedBox(height: 24),

                  // Preview Player
                  if (_content!.previewUrl != null) ...[
                    Text(
                      'Prévia da Música',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Theme.of(
                              context,
                            ).colorScheme.primary.withOpacity(0.1),
                            Theme.of(
                              context,
                            ).colorScheme.tertiary.withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Theme.of(
                            context,
                          ).colorScheme.primary.withOpacity(0.3),
                        ),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: LinearGradient(
                                    colors: [
                                      Theme.of(context).colorScheme.primary,
                                      Theme.of(context).colorScheme.tertiary,
                                    ],
                                  ),
                                ),
                                child: IconButton(
                                  onPressed: _togglePlay,
                                  icon: Icon(
                                    _isPlaying ? Icons.pause : Icons.play_arrow,
                                    size: 40,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Consumer<PlayerProvider>(
                                  builder: (context, playerProvider, child) {
                                    final isCurrent =
                                        playerProvider.currentContentId ==
                                            widget.contentId.toString();
                                    final duration = isCurrent
                                        ? playerProvider.duration
                                        : Duration.zero;
                                    final position = isCurrent
                                        ? playerProvider.position
                                        : Duration.zero;
                                    final progress = isCurrent
                                        ? playerProvider.progress
                                        : 0.0;

                                    return Column(
                                      children: [
                                        Slider(
                                          value: progress,
                                          onChanged: isCurrent
                                              ? (value) {
                                                  final newPosition = Duration(
                                                    seconds: (value *
                                                            duration.inSeconds)
                                                        .toInt(),
                                                  );
                                                  playerProvider.seek(
                                                    newPosition,
                                                  );
                                                }
                                              : null,
                                          activeColor: Theme.of(
                                            context,
                                          ).colorScheme.secondary,
                                        ),
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              _formatDuration(position),
                                              style: const TextStyle(
                                                fontSize: 12,
                                              ),
                                            ),
                                            Text(
                                              _formatDuration(duration),
                                              style: const TextStyle(
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Tocando prévia de ${_content!.title}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }
}
