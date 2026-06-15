import 'package:flutter/material.dart';
// dotenv is loaded inside SupabaseService.initialize
import 'services/supabase_service.dart';
import 'package:provider/provider.dart';
// removed unused google_fonts import
import 'core/themes/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/favorites_provider.dart';
import 'providers/player_provider.dart';
import 'providers/content_provider.dart';
import 'routes/app_router.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase through the wrapper which validates .env
  await SupabaseService.initialize();

  runApp(const FlashbackStreamApp());
}

class FlashbackStreamApp extends StatelessWidget {
  const FlashbackStreamApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => FavoritesProvider()),
        ChangeNotifierProvider(create: (_) => PlayerProvider()),
        ChangeNotifierProvider(create: (_) => ContentProvider()),
      ],
      child: MaterialApp.router(
        title: 'Flashback Stream',
        theme: AppTheme.retroTheme,
        routerConfig: AppRouter.router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
