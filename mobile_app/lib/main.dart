import 'package:flutter/material.dart';

void main() {
  runApp(const FlashbackApp());
}

class FlashbackApp extends StatelessWidget {
  const FlashbackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flashback Stream',
      theme: ThemeData.dark(),
      home: const Scaffold(
        body: Center(
          child: Text('Flashback Stream'),
        ),
      ),
    );
  }
}