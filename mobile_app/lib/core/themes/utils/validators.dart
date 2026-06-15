class Validators {
  static bool isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  static bool isValidCPF(String cpf) {
    String cleaned = cpf.replaceAll(RegExp(r'[^\d]'), '');

    if (cleaned.length != 11) return false;
    if (RegExp(r'^(\d)\1{10}$').hasMatch(cleaned)) return false;

    int sum = 0;
    for (int i = 0; i < 9; i++) {
      sum += int.parse(cleaned[i]) * (10 - i);
    }
    int firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    if (int.parse(cleaned[9]) != firstDigit) return false;

    sum = 0;
    for (int i = 0; i < 10; i++) {
      sum += int.parse(cleaned[i]) * (11 - i);
    }
    int secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    return int.parse(cleaned[10]) == secondDigit;
  }

  static String formatCPF(String cpf) {
    String cleaned = cpf.replaceAll(RegExp(r'[^\d]'), '');
    if (cleaned.length <= 11) {
      if (cleaned.length > 9) {
        return '${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}';
      } else if (cleaned.length > 6) {
        return '${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6)}';
      } else if (cleaned.length > 3) {
        return '${cleaned.substring(0, 3)}.${cleaned.substring(3)}';
      }
    }
    return cleaned;
  }

  static bool isValidPassword(String password) {
    return password.length >= 6;
  }
}
