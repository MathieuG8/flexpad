# Firmware Macropad — Arduino & ESP32

Code source pour les microcontrôleurs du macropad : **ESP32-S3** (Arduino/C++) et **ATmega328P** (C++).

> Voir le [README principal](../README.md) pour la vue d'ensemble du projet.

## 📁 Structure

```
firmware/
├── esp32/
│   ├── esp32_micropython/           # Projet Arduino principal
│   │   ├── esp32_micropython.ino     # Point d'entrée
│   │   ├── Config.h                  # Pins, constantes, codes HID
│   │   ├── KeyMatrix.h/cpp           # Scan matrice 5×4
│   │   ├── Encoder.h/cpp             # Encodeur rotatif (volume)
│   │   ├── HidOutput.h/cpp           # HID USB + BLE
│   │   └── ARCHITECTURE.md           # Architecture du code
│   └── USB_CONNECTION.md             # Notes connexion USB
├── atmega/
│   └── atmega_light/                 # Projet Microchip Studio
│       ├── main.cpp                   # Code principal
│       └── atmega_light.cppproj       # Projet
└── README.md
```

## 🚀 Guide de Démarrage Rapide

### 1. ESP32-S3

#### Prérequis
- Arduino IDE installé
- Support ESP32 ajouté (voir `docs/README_ESP32.md`)

#### Étapes

1. **Installer les librairies** :
   - Ouvrez Arduino IDE
   - Allez dans **Croquis > Inclure une bibliothèque > Gérer les bibliothèques**
   - Installez :
   - **ArduinoJson** (version 6.x) - **ESSENTIEL**
   - **Adafruit NeoPixel** - LED built-in
   - Adafruit GFX, SSD1306, Fingerprint (si écran/empreinte utilisés)

2. **Ouvrir le code** :
   - Ouvrez `esp32/esp32_micropython/esp32_micropython.ino` dans Arduino IDE

3. **Configurer la carte** :
   - **Outils > Type de carte** : "ESP32S3 Dev Module"
   - **Outils > Port** : Sélectionnez le port COM (généralement le port **UART/PROG** pour flasher)
   - **Outils > USB CDC On Boot** : "Enabled" pour Serial + HID sur le port USB natif ; "Disabled" si vous voulez le clavier seul sur le port USB et l’IDE sur UART (voir [USB_CONNECTION.md](esp32/USB_CONNECTION.md))
   - **Outils > USB Mode** : "Hardware CDC and JTAG"
   - **Outils > CPU Frequency** : "240MHz (WiFi/BT)"
   - **Outils > Flash Size** : "4MB (32Mb)"
   - **Outils > Partition Scheme** : "Default 4MB with spiffs" ou "Minimal SPIFFS (1.9MB APP with OTA)" pour OTA

4. **Compiler et téléverser** :
   - Cliquez sur **Vérifier** (✓) pour compiler
   - Si aucune erreur, cliquez sur **Téléverser** (→)
   - Attendez la fin du téléversement

5. **Vérifier** :
   - Ouvrez le **Moniteur série** (115200 bauds)
   - Vous devriez voir "=== ESP32-S3 Macropad Initialization ==="
   - L'écran OLED devrait afficher "Macropad Ready"

### 2. ATmega328P/168A

#### Prérequis
- Microchip Studio installé
- PICKit 4 connecté

#### Étapes

1. **Ouvrir le projet** :
   - Ouvrez `atmega/atmega_light/atmega_light.atsln` dans Microchip Studio
   - Ou créez un projet et ajoutez `atmega/atmega_light/main.cpp`

2. **Compiler** :
   - **Build > Build Solution** (F7)
   - Vérifiez qu'il n'y a pas d'erreurs

3. **Programmer** :
   - Connectez le PICKit 4 à l'ATmega
   - **Tools > Device Programming**
   - Sélectionnez "PICKit 4" et "ATmega328P"
   - Cliquez sur "Apply"
   - **Memories > Flash** : Sélectionnez le fichier `.hex` généré
   - Cliquez sur "Program"

4. **Vérifier** :
   - L'ATmega devrait répondre sur I2C à l'adresse 0x08
   - Utilisez un scanner I2C pour vérifier

## 🔧 ESP32-S3

### Fonctionnalités

- Communication USB HID (clavier)
- Communication Bluetooth (BLE)
- Communication I2C avec ATmega328P
- Gestion de l'écran OLED
- Gestion du capteur d'empreinte digitale
- Gestion du rétro-éclairage
- Gestion de l'encodeur rotatif
- **Stockage des profils en mémoire flash** (transfert entre appareils)

### Installation

1. Ouvrez `esp32/esp32_micropython/esp32_micropython.ino` dans Arduino IDE
2. Installez les librairies : ArduinoJson 6.x, Adafruit NeoPixel (voir section Prérequis)
3. Configurez la carte ESP32-S3
4. Téléversez le code

### Version Minimale

La version minimale du macropad ESP32-S3 gère directement une matrice 2x2 :

#### Configuration Matrice de Touches

La matrice 2x2 est gérée directement par l'ESP32-S3 :
- **GPIO 4** = Colonne 0
- **GPIO 5** = Colonne 1
- **GPIO 6** = Ligne 0
- **GPIO 7** = Ligne 1

#### Mapping des touches :
- Touche 0 : Ligne 0, Colonne 0 (index 0)
- Touche 1 : Ligne 0, Colonne 1 (index 1)
- Touche 2 : Ligne 1, Colonne 0 (index 2)
- Touche 3 : Ligne 1, Colonne 1 (index 3)

#### Configuration Encodeur Rotatif

L'encodeur rotatif pour le volume utilise :
- **GPIO 18** = CLK (Clock)
- **GPIO 19** = DT (Data)
- **GPIO 20** = SW (Switch/Bouton pour mute)

#### Fonctionnalités Version Minimale

1. ✅ Scan direct de la matrice 2x2
2. ✅ Gestion de l'encodeur rotatif (volume up/down)
3. ✅ Bouton de l'encodeur (mute)
4. ✅ Configuration des touches via Serial JSON
5. ✅ Sauvegarde des profils en mémoire flash
6. ✅ Support USB HID Keyboard
7. ✅ **USB Passthrough** — PROFILE+0 maintenu 3s bascule entre clavier et fingerprint (port USB A)

#### Non inclus (pour version complète) :
- Écran OLED
- Capteur d'empreinte
- Communication I2C avec ATmega
- Rétro-éclairage
- Consumer Control pour volume (actuellement envoie messages série)

### Stockage des Profils

Les profils sont stockés dans la **mémoire flash** de l'ESP32-S3 via l'API `Preferences`. Cela permet de :

- ✅ Conserver les profils même après redémarrage
- ✅ Transférer les profils entre différents appareils
- ✅ Sauvegarder automatiquement les modifications
- ✅ Ne pas dépendre de l'interface web pour la configuration

#### API Preferences

L'ESP32-S3 utilise l'API `Preferences` qui stocke les données dans la mémoire flash de manière persistante. Les données sont organisées en **namespace** et **clés**.

#### Structure de stockage

```
Namespace: "macropad"
├── profileCount (int)          : Nombre de profils
├── activeProfile (int)          : Index du profil actif
├── profile0 (string)           : Profil 0 (JSON)
├── profile1 (string)           : Profil 1 (JSON)
├── ...
├── profile9 (string)           : Profil 9 (JSON)
├── backlightOn (bool)          : Rétro-éclairage activé
├── backlightBr (int)           : Luminosité rétro-éclairage
├── autoBright (bool)           : Luminosité automatique
├── fingerOn (bool)             : Capteur d'empreinte activé
├── outputMode (string)         : Mode de sortie (usb/bluetooth/wifi)
├── displayBr (int)             : Luminosité écran
└── displayMode (string)        : Mode écran (data/image/gif)
```

#### Format JSON des profils

Chaque profil est stocké comme une chaîne JSON :

```json
{
  "name": "Profil 1",
  "keys": {
    "0-1": {
      "type": "key",
      "value": "ENTER"
    },
    "1-0": {
      "type": "key",
      "value": "c",
      "modifiers": ["CTRL"]
    },
    "2-1": {
      "type": "macro",
      "value": "",
      "macro": ["CTRL+C", "CTRL+V", "ENTER"],
      "delay": 50
    }
  }
}
```

#### Limites et contraintes

- **Limite par clé** : ~4000 bytes (Preferences API)
- **Nombre de profils** : 10 maximum
- **Touches par profil** : 20 maximum
- **Espace flash total** : Dépend de la partition (généralement plusieurs MB)

#### Synchronisation avec l'interface web

L'interface web envoie un message JSON complet. L'ESP32 :
1. Parse le JSON
2. Met à jour la configuration en mémoire
3. Sauvegarde dans la flash
4. Envoie une confirmation

## 🔧 ATmega328P/168A

### Fonctionnalités

- Scan de la matrice de touches 4×5
- Communication I2C en mode esclave
- Anti-rebond matériel/logiciel
- Scan périodique via timer

### Installation

1. Ouvrez `atmega/atmega_light/atmega_light.atsln` dans Microchip Studio
2. Compilez (F7)
3. Programmez avec PICKit 4 (Tools > Device Programming)

### Communication I2C

- **Adresse** : 0x08
- **Fréquence** : 100 kHz
- **Format** : 2 bytes (LSB, MSB) représentant l'état des 16 touches

## 🌐 Compatibilité Multi-Plateforme

Le macropad ESP32-S3 est conçu pour être compatible avec **Windows, macOS, Linux, iOS et Android**.

### Modes de Connexion

#### USB HID (Windows, macOS, Linux)
- **Connexion** : Câble USB-C
- **Reconnaissance** : Automatique, aucun pilote nécessaire
- **Fonctionnalités** : Toutes les touches et macros fonctionnent
- **Volume** : FN+F1/F2/F3 (fonctionne sur Windows et macOS)

#### Bluetooth HID (iOS, Android)
- **Connexion** : Bluetooth Low Energy (BLE)
- **Reconnaissance** : Appareil visible comme "Macropad"
- **Fonctionnalités** : Toutes les touches et macros fonctionnent
- **Volume** : FN+F1/F2/F3 (fonctionne sur iOS et Android)

### Compatibilité par Plateforme

#### ✅ Windows
- **Mode** : USB HID
- **Pilotes** : Aucun nécessaire (HID standard)
- **Test** : Ouvrez le Bloc-notes et appuyez sur les touches
- **Volume** : FN+F3 (Volume Up), FN+F2 (Volume Down), FN+F1 (Mute)

#### ✅ macOS
- **Mode** : USB HID
- **Pilotes** : Aucun nécessaire (HID standard)
- **Test** : Ouvrez TextEdit et appuyez sur les touches
- **Volume** : FN+F3 (Volume Up), FN+F2 (Volume Down), FN+F1 (Mute)
- **Note** : KEY_LEFT_GUI devient automatiquement Cmd sur macOS

#### ✅ Linux
- **Mode** : USB HID
- **Pilotes** : Aucun nécessaire (HID standard)
- **Test** : Ouvrez un éditeur de texte et appuyez sur les touches
- **Volume** : Peut nécessiter une configuration système pour FN+F1/F2/F3

#### ✅ iOS (iPhone/iPad)
- **Mode** : Bluetooth HID (BLE)
- **Activation** : Décommentez `#define USE_BLE_KEYBOARD` dans le code
- **Connexion** :
  1. Activez Bluetooth sur votre iPhone/iPad
  2. Allez dans Réglages > Bluetooth
  3. Recherchez "Macropad"
  4. Appuyez sur "Macropad" pour vous connecter
- **Test** : Ouvrez Notes et appuyez sur les touches
- **Volume** : FN+F3/F2/F1 fonctionne sur iOS

#### ✅ Android

Le macropad ESP32-S3 fonctionne directement en USB HID sur Android via USB-C (USB OTG).

**Compatibilité Android** :
- **Pixel 10** : ✅ Compatible
- **Autres appareils Android** : Compatible si USB OTG est supporté

**Connexion USB** :
1. **Branchez le macropad** à votre appareil Android avec un câble USB-C vers USB-C
2. **Android détecte automatiquement** le périphérique comme clavier HID
3. **Aucune configuration nécessaire** - fonctionne immédiatement

**Configuration Arduino IDE pour Android** :
- **USB CDC On Boot** : **Disabled** ⚠️ IMPORTANT
  - Si activé, cela crée un conflit avec USB HID
  - Android ne reconnaîtra pas le périphérique correctement
- **USB Mode** : **Hardware CDC and JTAG** ou **Native USB**
- **USB DFU On Boot** : **Disabled**
- **USB Firmware MSC On Boot** : **Disabled**

**Activation USB OTG sur Android** :
Sur certains appareils Android, vous devez activer le mode USB OTG :
1. Allez dans **Paramètres**
2. Recherchez **USB** ou **Connexions**
3. Activez **USB OTG** ou **Mode hôte USB**

**Note** : Sur Pixel 10 et les appareils récents, USB OTG est généralement activé par défaut.

**Connexion Bluetooth** :
1. Activez Bluetooth sur votre appareil Android
2. Allez dans Paramètres > Bluetooth
3. Recherchez "Macropad"
4. Appuyez sur "Macropad" pour vous connecter

**Test** : Ouvrez une application de notes et appuyez sur les touches
**Volume** : FN+F3/F2/F1 fonctionne sur Android

### Configuration

#### Activer le Mode Bluetooth

Pour activer le support Bluetooth HID (nécessaire pour iOS/Android) :

1. Ouvrez `esp32_micropython.ino`
2. Trouvez la ligne :
   ```cpp
   // #define USE_BLE_KEYBOARD
   ```
3. Décommentez-la :
   ```cpp
   #define USE_BLE_KEYBOARD
   ```
4. Installez la bibliothèque **BleKeyboard** :
   - Arduino IDE > Croquis > Inclure une bibliothèque > Gérer les bibliothèques
   - Recherchez "BleKeyboard" par T-vK
   - Installez la bibliothèque
5. Recompilez et téléversez

#### Basculer entre USB et Bluetooth

Le macropad détecte automatiquement :
- **USB** : Si connecté via USB, utilise USB HID
- **Bluetooth** : Si Bluetooth est activé et connecté, utilise Bluetooth HID

Vous pouvez aussi forcer un mode dans le code en modifiant :
```cpp
String outputMode = "usb";  // ou "bluetooth"
```

#### USB Hub (clavier + fingerprint simultanés)

Avec le hub USB2514, le clavier et le fingerprint fonctionnent en même temps — pas de bascule manuelle.

#### BLE Switch appareil (PROFILE + 1)

Pour basculer entre plusieurs appareils Bluetooth (PC, téléphone, tablette) :

1. **Maintenez** PROFILE + 1 pendant **2 secondes**
2. Le Macropad se déconnecte et redémarre l'advertising
3. Connectez-vous depuis l'autre appareil (Paramètres Bluetooth)

### Codes de Touches Compatibles

Tous les codes de touches HID standard sont compatibles :
- Lettres : a-z, A-Z
- Chiffres : 0-9
- Modificateurs : CTRL, SHIFT, ALT, GUI (Windows/Cmd)
- Touches spéciales : ENTER, SPACE, TAB, ESC, BACKSPACE, DELETE
- Flèches : UP, DOWN, LEFT, RIGHT
- Fonctions : F1-F12

### Contrôle du Volume

Le contrôle du volume utilise des combinaisons de touches compatibles avec tous les systèmes :

- **Volume Up** : FN + F3 (KEY_LEFT_GUI + KEY_F3)
- **Volume Down** : FN + F2 (KEY_LEFT_GUI + KEY_F2)
- **Mute** : FN + F1 (KEY_LEFT_GUI + KEY_F1)

**Note** : Sur macOS, KEY_LEFT_GUI devient automatiquement Cmd, donc :
- Volume Up = Cmd + F3
- Volume Down = Cmd + F2
- Mute = Cmd + F1

Sur iOS et Android, ces combinaisons fonctionnent via Bluetooth HID.

## 📝 Notes importantes

### Mise à jour OTA (sans fil)

L'interface web permet de flasher le firmware **sans fil** via BLE ou USB Serial. Le fichier `.bin` est envoyé par chunks, décodé (base64) et écrit dans la partition OTA de l'ESP32.

**Prérequis :**
- Schéma de partition avec OTA (ex: "Default 4MB with spiffs" ou "Minimal SPIFFS (1.9MB APP with OTA)")
- Exporter le binaire : Arduino IDE > Croquis > Exporter le binaire compilé

**Utilisation :**
1. Connectez-vous via BLE ou USB
2. Onglet Paramètres > Mise à jour OTA
3. Sélectionnez le fichier `.bin` compilé
4. Cliquez sur "Mettre à jour le firmware"
5. Ne déconnectez pas pendant le transfert

### Pour ESP32-S3

- Le code utilise une version simplifiée du parsing JSON
- Pour la production, utilisez la librairie **ArduinoJson** pour un parsing complet
- Les touches média nécessitent la librairie **ConsumerControl**
- Le code est optimisé pour la compatibilité avec l'interface web
- **ArduinoJson est OBLIGATOIRE** : Sans cette librairie, le parsing JSON ne fonctionnera pas
- Les profils sont sauvegardés automatiquement dans la flash
- Vous pouvez déconnecter et reconnecter, les profils seront conservés

### Pour ATmega328P/168A

- Le scan est fait via interruption timer (10ms)
- La communication I2C est gérée par interruption
- Les résistances de pull-down sont nécessaires sur les colonnes
- Les résistances de pull-up (4.7kΩ) sont nécessaires sur SDA/SCL
- L'adresse I2C est fixée à 0x08 dans le code

## 🔄 Synchronisation avec l'interface web

L'interface web envoie la configuration complète au format JSON. L'ESP32 :

1. Reçoit le message JSON
2. Parse la configuration
3. Sauvegarde dans la mémoire flash
4. Applique la configuration immédiatement

Lors du démarrage, l'ESP32 :

1. Charge la configuration depuis la mémoire flash
2. Envoie un message de statut à l'interface web
3. Prêt à recevoir de nouvelles configurations

## 🐛 Dépannage

### ESP32 ne sauvegarde pas les profils

- Vérifiez que `Preferences.begin()` est appelé
- Vérifiez l'espace disponible en mémoire flash
- Utilisez `preferences.clear()` pour réinitialiser si nécessaire
- Vérifiez que le JSON n'est pas trop grand (>4000 bytes)

### ATmega ne répond pas sur I2C

- Vérifiez les connexions SDA/SCL
- Vérifiez les résistances de pull-up
- Utilisez un scanner I2C pour vérifier l'adresse

### Les touches ne sont pas détectées

- Vérifiez les connexions de la matrice
- Vérifiez les résistances de pull-down
- Testez chaque ligne/colonne individuellement

### ESP32 ne compile pas

- Vérifiez que toutes les librairies sont installées
- Vérifiez que ArduinoJson est bien installé (version 6.x)
- Vérifiez que le support ESP32 est à jour

### Le macropad n'est pas reconnu sur Android

1. **Vérifiez le câble** :
   - Utilisez un câble USB-C vers USB-C de données (pas seulement charge)
   - Essayez un autre câble si possible

2. **Vérifiez USB OTG** :
   - Activez USB OTG dans les paramètres Android
   - Sur certains appareils, c'est dans Paramètres > Système > Options développeur

3. **Vérifiez la configuration Arduino IDE** :
   - USB CDC On Boot doit être **Disabled**
   - Recompilez et téléversez le code

4. **Redémarrez l'appareil Android** :
   - Parfois Android a besoin d'un redémarrage pour reconnaître un nouveau périphérique USB

5. **Vérifiez les notifications Android** :
   - Android peut afficher une notification "Périphérique USB connecté"
   - Appuyez dessus et sélectionnez "Clavier" ou "HID"

### Le macropad est reconnu mais les touches ne fonctionnent pas

1. **Vérifiez que vous êtes dans une zone de texte** :
   - Ouvrez une application avec un champ de texte (Notes, Messages, etc.)
   - Cliquez dans le champ de texte avant d'appuyer sur les touches

2. **Vérifiez la configuration des touches** :
   - Par défaut, les touches envoient "1", "2", "3", "4"
   - Configurez-les via l'interface web si nécessaire

3. **Testez avec un autre appareil** :
   - Testez sur un ordinateur Windows/macOS pour vérifier que le macropad fonctionne
   - Si ça fonctionne sur PC mais pas Android, c'est un problème Android spécifique

### Le numpad n’est pas visible en USB / pas disponible quand l’IDE est ouverte

Sur les cartes ESP32-S3 avec **deux ports USB** (USB natif et UART/PROG) :

- Le **clavier HID** n’apparaît que si vous branchez le câble sur le port **« USB » (natif)**. Le port **« UART » ou « PROG »** sert à la programmation et au moniteur série uniquement (pas de HID).
- Pour utiliser le clavier **tout en gardant l’Arduino IDE ouverte** : utilisez **deux câbles** (un sur UART pour l’IDE, un sur USB pour le clavier) ou réglez **USB CDC On Boot = Disabled** et branchez le clavier sur le port USB natif.

Détails et schéma : **[firmware/esp32/USB_CONNECTION.md](esp32/USB_CONNECTION.md)**.

### Erreur Code 43 sur Windows

**Erreur** : "Windows a arrêté ce périphérique, car il présente des problèmes. (Code 43)"

Cette erreur indique que Windows ne peut pas lire le descripteur USB HID correctement.

#### Solutions à essayer dans l'ordre

1. **Configuration Arduino IDE** :
   - **USB CDC On Boot** : **Disabled** ⚠️ IMPORTANT
     - Si activé, cela crée un conflit avec USB HID
     - Le périphérique essaie d'être à la fois Serial et HID, ce qui cause l'erreur
   - **USB Mode** : **Hardware CDC and JTAG** ou **Native USB**
   - **USB DFU On Boot** : **Disabled**
   - **USB Firmware MSC On Boot** : **Disabled**

2. **Réinitialiser le périphérique USB dans Windows** :
   - Ouvrez le **Gestionnaire de périphériques** (Win+X > Gestionnaire de périphériques)
   - Trouvez le périphérique ESP32-S3 (peut apparaître comme "Unknown Device" ou avec un point d'exclamation)
   - **Clic droit > Désinstaller le périphérique**
   - Cochez "Supprimer le pilote" si l'option est disponible
   - Débranchez et rebranchez l'ESP32-S3
   - Windows devrait réinstaller le pilote automatiquement

3. **Installer les pilotes USB ESP32** :
   - Téléchargez les pilotes depuis : https://github.com/espressif/usb-pid
   - Ou utilisez le gestionnaire de pilotes Windows Update
   - Redémarrez l'ordinateur après l'installation

4. **Vérifier les pins utilisés** :
   - **IMPORTANT** : Ne pas utiliser GPIO 19 et 20 pour d'autres périphériques !
   - GPIO 19 = USB_D- (négatif USB)
   - GPIO 20 = USB_D+ (positif USB)
   - Ces pins sont réservés pour la communication USB native.

5. **Tester avec un code minimal** :
   ```cpp
   #include <USB.h>
   #include <USBHIDKeyboard.h>
   
   USBHIDKeyboard Keyboard;
   
   void setup() {
       USB.begin();
       delay(1000);
       Keyboard.begin();
       delay(1000);
   }
   
   void loop() {
       delay(1000);
       Keyboard.print("Test");
   }
   ```
   Si ce code fonctionne, le problème vient de votre code principal.

6. **Vérifier le câble USB** :
   - Utilisez un **câble USB-C de données** (pas seulement charge)
   - Essayez un autre câble
   - Essayez un autre port USB (de préférence USB 2.0)

7. **Désactiver temporairement Serial** :
   - Si vous utilisez Serial en même temps que USB HID, cela peut causer un conflit.
   - Dans le code, commentez temporairement :
     ```cpp
     // Serial.begin(115200);
     // Serial.println("...");
     ```
   - Et testez si l'erreur disparaît.

8. **Réinitialiser l'ESP32-S3** :
   - Appuyez sur le bouton **BOOT** (ou **RST**) pendant le téléversement
   - Relâchez après le début du téléversement
   - Attendez la fin du téléversement
   - Appuyez sur **RST** pour redémarrer

9. **Vérifier la version d'Arduino ESP32** :
   - **Outils > Type de carte > Gestionnaire de cartes**
   - Recherchez "esp32"
   - Mettez à jour vers la dernière version si nécessaire

10. **Test sur un autre ordinateur** :
    - Si possible, testez sur un autre ordinateur pour déterminer si c'est un problème Windows ou matériel.

#### Configuration recommandée Arduino IDE

```
Type de carte : ESP32S3 Dev Module
USB CDC On Boot : Disabled ⚠️
USB Mode : Hardware CDC and JTAG
USB DFU On Boot : Disabled
USB Firmware MSC On Boot : Disabled
CPU Frequency : 240MHz (WiFi/BT)
Flash Size : 4MB (32Mb)
Partition Scheme : Default 4MB with spiffs
PSRAM : OPI PSRAM (si disponible)
```

#### Vérification du périphérique

Après le téléversement, dans le Gestionnaire de périphériques, vous devriez voir :
- **Périphériques d'entrée > Clavier HID** (ou similaire)
- Pas de point d'exclamation jaune
- Pas d'erreur Code 43

#### Notes importantes

- L'ordre d'initialisation dans `setup()` est critique
- USB.begin() doit être appelé AVANT Keyboard.begin()
- Attendre suffisamment longtemps entre les initialisations (1000ms minimum)
- Ne pas utiliser Serial.begin() en même temps que USB HID si possible

### Le macropad ne fonctionne pas sur iOS/Android

- Vérifiez que `USE_BLE_KEYBOARD` est activé
- Vérifiez que la bibliothèque BleKeyboard est installée
- Vérifiez que Bluetooth est activé sur l'appareil
- Vérifiez que l'appareil est appairé

### Le volume ne fonctionne pas

- Sur Windows/macOS : Vérifiez que les raccourcis système sont configurés
- Sur iOS/Android : Vérifiez que Bluetooth HID est activé et connecté
- Testez avec un éditeur de texte pour voir si les touches F1/F2/F3 fonctionnent

### Le macropad fonctionne en USB mais pas en Bluetooth

- Vérifiez que `USE_BLE_KEYBOARD` est activé
- Vérifiez que la bibliothèque BleKeyboard est installée
- Vérifiez que l'ESP32-S3 a le Bluetooth activé (CPU Frequency doit inclure BT)

## 📚 Ressources

- [Documentation ESP32 Preferences](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/storage/nvs_flash.html)
- [ArduinoJson Library](https://arduinojson.org/)
- [Documentation ATmega328P I2C](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf)
- [Documentation ESP32-S3](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/)
- [Arduino ESP32](https://github.com/espressif/arduino-esp32)
- [ESP32 BLE Keyboard](https://github.com/T-vK/ESP32-BLE-Keyboard)
- [Adafruit SSD1306](https://github.com/adafruit/Adafruit_SSD1306)
- [ESP32 Preferences API](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/preferences.html)
- [ESP32 Flash Memory](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html)

## ✅ Checklist de vérification

- [ ] ESP32-S3 compilé et téléversé
- [ ] ATmega328P/168A compilé et programmé
- [ ] Interface web accessible
- [ ] Connexion USB établie
- [ ] Premier profil créé et sauvegardé
- [ ] Touches testées et fonctionnelles
- [ ] Écran OLED affiche les informations
- [ ] Rétro-éclairage fonctionne

Une fois tous les éléments cochés, votre macropad est prêt à l'emploi ! 🎉