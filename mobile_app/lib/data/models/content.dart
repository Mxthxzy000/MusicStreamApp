class Content {
  final int id;
  final String title;
  final String synopsis;
  final String coverUrl;
  final int genreId;
  final String? previewUrl;
  final DateTime createdAt;
  final Map<String, dynamic>? genre;

  Content({
    required this.id,
    required this.title,
    required this.synopsis,
    required this.coverUrl,
    required this.genreId,
    this.previewUrl,
    required this.createdAt,
    this.genre,
  });

  factory Content.fromJson(Map<String, dynamic> json) {
    return Content(
      id: json['id'],
      title: json['title'],
      synopsis: json['synopsis'],
      coverUrl: json['cover_url'],
      genreId: json['genre_id'],
      previewUrl: json['preview_url'],
      createdAt: DateTime.parse(json['created_at']),
      genre: json['genres'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'synopsis': synopsis,
      'cover_url': coverUrl,
      'genre_id': genreId,
      'preview_url': previewUrl,
      'created_at': createdAt.toIso8601String(),
      'genres': genre,
    };
  }

  String get genreName => genre?['name'] ?? 'Desconhecido';
}
