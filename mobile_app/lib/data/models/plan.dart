class Plan {
  final int id;
  final String name;
  final double price;
  final List<String> benefits;
  final bool isHighlight;
  final DateTime createdAt;

  Plan({
    required this.id,
    required this.name,
    required this.price,
    required this.benefits,
    required this.isHighlight,
    required this.createdAt,
  });

  factory Plan.fromJson(Map<String, dynamic> json) {
    return Plan(
      id: json['id'],
      name: json['name'],
      price: (json['price'] as num).toDouble(),
      benefits: List<String>.from(json['benefits']),
      isHighlight: json['highlight'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  String get formattedPrice {
    return 'R\$ ${price.toStringAsFixed(2).replaceAll('.', ',')}';
  }
}
