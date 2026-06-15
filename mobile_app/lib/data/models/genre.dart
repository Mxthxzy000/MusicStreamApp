class Genre {
  final int id;
  final String name;
  final String slug;
  final String imageUrl;
  final DateTime createdAt;

  Genre({
    required this.id,
    required this.name,
    required this.slug,
    required this.imageUrl,
    required this.createdAt,
  });

  factory Genre.fromJson(Map<String, dynamic> json) {
    return Genre(
      id: json['id'],
      name: json['name'],
      slug: json['slug'],
      imageUrl: json['image_url'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'image_url': imageUrl,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
