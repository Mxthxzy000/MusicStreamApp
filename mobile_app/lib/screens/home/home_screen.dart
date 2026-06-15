import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/content_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/content_card.dart';
import '../../widgets/genre_card.dart';
import '../../widgets/shimmer_placeholder.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final contentProvider = Provider.of<ContentProvider>(
      context,
      listen: false,
    );
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final favoritesProvider = Provider.of<FavoritesProvider>(
      context,
      listen: false,
    );

    await contentProvider.loadGenres();
    await contentProvider.loadFeaturedContents();

    if (authProvider.isAuthenticated) {
      await favoritesProvider.loadFavorites(authProvider.user!.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Flashback Stream'),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Theme.of(context).colorScheme.primary,
                          Theme.of(context).colorScheme.tertiary,
                        ],
                      ),
                    ),
                  ),
                  Center(
                    child: Icon(
                      Icons.music_note,
                      size: 100,
                      color: Colors.white.withOpacity(0.2),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Featured Section
                  Text(
                    'Em Destaque',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  Consumer<ContentProvider>(
                    builder: (context, provider, child) {
                      if (provider.isLoading &&
                          provider.featuredContents.isEmpty) {
                        return SizedBox(
                          height: 280,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: 3,
                            itemBuilder: (context, index) {
                              return const SizedBox(
                                width: 200,
                                child: Padding(
                                  padding: EdgeInsets.only(right: 16),
                                  child: ShimmerPlaceholder(),
                                ),
                              );
                            },
                          ),
                        );
                      }

                      if (provider.featuredContents.isEmpty) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: Text('Nenhum conteúdo em destaque'),
                          ),
                        );
                      }

                      return SizedBox(
                        height: 280,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: provider.featuredContents.length,
                          itemBuilder: (context, index) {
                            final content = provider.featuredContents[index];
                            return SizedBox(
                              width: 200,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 16),
                                child: ContentCard(content: content),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 32),

                  // Genres Section
                  Text(
                    'Gêneros Musicais',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  Consumer<ContentProvider>(
                    builder: (context, provider, child) {
                      if (provider.isLoading && provider.genres.isEmpty) {
                        return GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 1.5,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                              ),
                          itemCount: 4,
                          itemBuilder: (context, index) {
                            return const ShimmerPlaceholder();
                          },
                        );
                      }

                      if (provider.genres.isEmpty) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: Text('Nenhum gênero encontrado'),
                          ),
                        );
                      }

                      return GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 1.5,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                            ),
                        itemCount: provider.genres.length,
                        itemBuilder: (context, index) {
                          final genre = provider.genres[index];
                          return GenreCard(
                            genre: genre,
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                '/genre/${genre.slug}',
                              );
                            },
                          );
                        },
                      );
                    },
                  ),

                  const SizedBox(height: 80), // Space for bottom nav bar
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 0),
    );
  }
}
