import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

class PlayerProvider extends ChangeNotifier {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;
  String? _currentContentId;
  // removed unused _currentPreviewUrl
  bool _isLoading = false;

  bool get isPlaying => _isPlaying;
  Duration get duration => _duration;
  Duration get position => _position;
  String? get currentContentId => _currentContentId;
  bool get isLoading => _isLoading;
  double get progress =>
      _duration.inSeconds > 0 ? _position.inSeconds / _duration.inSeconds : 0.0;

  PlayerProvider() {
    _initAudioPlayer();
  }

  void _initAudioPlayer() {
    _audioPlayer.onDurationChanged.listen((newDuration) {
      _duration = newDuration;
      notifyListeners();
    });

    _audioPlayer.onPositionChanged.listen((newPosition) {
      _position = newPosition;
      notifyListeners();
    });

    _audioPlayer.onPlayerComplete.listen((event) {
      _isPlaying = false;
      _position = Duration.zero;
      notifyListeners();
    });
  }

  Future<void> playPreview(String contentId, String previewUrl) async {
    if (_currentContentId == contentId && _isPlaying) {
      await pause();
      return;
    }

    if (_currentContentId == contentId && !_isPlaying) {
      await resume();
      return;
    }

    _isLoading = true;
    _currentContentId = contentId;
    // previewUrl intentionally not stored to reduce retained state
    notifyListeners();

    try {
      await _audioPlayer.stop();
      await _audioPlayer.play(UrlSource(previewUrl));
      _isPlaying = true;
    } catch (e) {
      debugPrint('Error playing audio: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> pause() async {
    await _audioPlayer.pause();
    _isPlaying = false;
    notifyListeners();
  }

  Future<void> resume() async {
    await _audioPlayer.resume();
    _isPlaying = true;
    notifyListeners();
  }

  Future<void> stop() async {
    await _audioPlayer.stop();
    _isPlaying = false;
    _position = Duration.zero;
    _currentContentId = null;
    notifyListeners();
  }

  Future<void> seek(Duration position) async {
    await _audioPlayer.seek(position);
    _position = position;
    notifyListeners();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }
}
