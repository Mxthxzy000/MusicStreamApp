import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/content_provider.dart';
// removed unused provider imports
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/content_card.dart';
import '../../widgets/shimmer_placeholder.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final _searchController = TextEditingController();
  int? _selectedGenreId;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final contentProvider = Provider.of<ContentProvider>(
      context,
      listen: false,
    );
    await contentProvider.loadGenres();
    await contentProvider.loadContents();
  }

  void _onSearchChanged(String value) {
    setState(() {
      _searchQuery = value;
    });
    final contentProvider = Provider.of<ContentProvider>(
      context,
      listen: false,
    );
    contentProvider.setSearchQuery(value);
  }

  void _onGenreFilter(int? genreId) {
    setState(() {
      _selectedGenreId = genreId;
    });
    final contentProvider = Provider.of<ContentProvider>(
      context,
      listen: false,
    );
    contentProvider.setGenreFilter(genreId);
  }

  void _clearFilters() {
    setState(() {
      _selectedGenreId = null;
      _searchQuery = '';
      _searchController.clear();
    });
    final contentProvider = Provider.of<ContentProvider>(
      context,
      listen: false,
    );
    contentProvider.clearFilters();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catálogo'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(80),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Buscar músicas...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              _onSearchChanged('');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.1),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: _onSearchChanged,
                ),
              ],
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Genre Filter Chips
          Consumer<ContentProvider>(
            builder: (context, provider, child) {
              if (provider.genres.isEmpty) return const SizedBox.shrink();

              return SizedBox(
                height: 50,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: provider.genres.length + 1,
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: const Text('Todos'),
                          selected: _selectedGenreId == null,
                          onSelected: (_) => _onGenreFilter(null),
                          selectedColor: Theme.of(context).colorScheme.primary,
                        ),
                      );
                    }

                    final genre = provider.genres[index - 1];
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(genre.name),
                        selected: _selectedGenreId == genre.id,
                        onSelected: (_) => _onGenreFilter(genre.id),
                        selectedColor: Theme.of(context).colorScheme.primary,
                      ),
                    );
                  },
                ),
              );
            },
          ),

          // Results Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Consumer<ContentProvider>(
                  builder: (context, provider, child) {
                    return Text(
                      '${provider.contents.length} resultados encontrados',
                      style: Theme.of(context).textTheme.bodySmall,
                    );
                  },
                ),
                if (_selectedGenreId != null || _searchQuery.isNotEmpty)
                  TextButton(
                    onPressed: _clearFilters,
                    child: const Text('Limpar Filtros'),
                  ),
              ],
            ),
          ),

          // Contents Grid
          Expanded(
            child: Consumer<ContentProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && provider.contents.isEmpty) {
                  return GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.75,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: 6,
                    itemBuilder: (context, index) {
                      return const ShimmerPlaceholder();
                    },
                  );
                }

                if (provider.contents.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.music_off, size: 64, color: Colors.white54),
                        const SizedBox(height: 16),
                        Text(
                          'Nenhum resultado encontrado',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Tente ajustar sua busca ou filtros',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  );
                }

                return GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  itemCount: provider.contents.length,
                  itemBuilder: (context, index) {
                    final content = provider.contents[index];
                    return ContentCard(content: content);
                  },
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 1),
    );
  }
}
