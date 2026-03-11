# Connexion USB ESP32-S3 — Guide

## ⚠️ Deux ports USB sur l’ESP32-S3 (carte type DevKitC-1)

Beaucoup de cartes ESP32-S3 ont **deux connecteurs USB** différents :

| Port | Étiquette sur la carte | Rôle | Ce que vous voyez |
|------|------------------------|------|-------------------|
| **USB (natif)** | « USB », « U0RXD », ou connecteur principal | **HID (clavier) + optionnellement Serial (CDC)** | Le **numpad apparaît comme clavier** sur ce port uniquement. |
| **UART (programmation)** | « UART », « PROG », « USB-UART » | Programmation + Moniteur série (chip USB-série type CH340/CP2102) | Un **port COM** pour flasher et le Serial. **Le HID (clavier) n’existe pas sur ce port.** |

- **Le numpad (clavier HID) n’est visible qu’en branchant le câble sur le port « USB » (natif).**  
  Si vous branchez uniquement le port « UART » / « PROG », vous aurez un port COM pour programmer et le moniteur série, mais **pas** de clavier.
- **Quand l’Arduino IDE a le moniteur série ouvert**, il occupe le port COM. Si vous utilisez le **même** port USB natif pour Serial et HID, le clavier reste normalement utilisable (HID et CDC sont deux interfaces du même câble). Pour éviter tout conflit et garder l’IDE ouverte tout en utilisant le clavier, voir la section **« Clavier + IDE ouverte »** ci‑dessous.

---

## Clavier + IDE ouverte (recommandé : deux câbles ou CDC désactivé)

Pour que le **numpad soit reconnu en USB** et que **l’Arduino IDE puisse rester ouverte** (moniteur série, téléversement) :

### Option A — Deux câbles (idéal)

1. **Port UART (PROG)** : un câble pour la programmation et le moniteur série (Arduino IDE).
2. **Port USB (natif)** : un second câble pour le **clavier HID**.

Ainsi, l’IDE utilise toujours le port UART ; le clavier est sur le port USB et reste disponible même quand le moniteur série est ouvert.

### Option B — Un seul câble : USB CDC On Boot = Disabled

Si vous n’avez qu’**un** câble et voulez que le numpad soit reconnu comme clavier **sans** conflit avec l’IDE :

1. Dans **Outils** :
   - **USB CDC On Boot** : **Disabled**
   - **USB Mode** : **Hardware CDC and JTAG**
2. **Téléversement** : branchez le câble sur le port **UART (PROG)** pour flasher (le port COM apparaît sur ce connecteur).
3. **Utilisation du clavier** : après le téléversement, **débranchez et branchez le câble sur le port « USB » (natif)**.  
   Le périphérique n’expose plus de port COM sur ce connecteur, uniquement le **clavier HID** — il sera reconnu comme numpad.

Avec **USB CDC On Boot = Disabled**, le Serial (`Serial.println`) ne sera pas visible sur le port USB natif ; utilisez le port **UART** pour le moniteur série (ou l’interface web en USB sur UART).

---

## Garder le port série connecté (USB CDC On Boot = Enabled)

### 1. Paramètres Arduino IDE

Dans **Outils** (Tools) :

- **USB CDC On Boot** : **Enabled** (obligatoire pour voir le Serial sur le port **USB natif**)
- **USB Mode** : **Hardware CDC and JTAG** (pour ESP32-S3 DevKit avec USB-JTAG)
- **Carte** : **ESP32S3 Dev Module**

Pour que le **clavier** fonctionne, branchez le câble sur le port **USB (natif)**. Le même câble fournit alors le port COM (Serial) et le HID (clavier).

### 2. Utiliser le moniteur série intégré (Web UI)

Le Web UI inclut un **moniteur série** dans l’onglet **Paramètres**. Une fois connecté en USB :

1. Connectez-vous via **Connecter (USB)**
2. Ouvrez l’onglet **Paramètres**
3. La sortie `Serial.println()` de l’ESP32 s’affiche dans la zone « Moniteur série »

**Avantage** : pas besoin d’Arduino IDE ni de maintenir le bouton BOOT. Une seule application utilise le port.

### 3. Conflit avec Arduino IDE / moniteur série

Un port série ne peut être ouvert que par **une seule** application à la fois :

- Si le **Web UI** est connecté → fermez le moniteur série de l’Arduino IDE
- Si l’**Arduino IDE** utilise le port → déconnectez-vous du Web UI avant d’ouvrir le moniteur série

### 4. Si la connexion se coupe (« device lost »)

- Utilisez un **câble USB data** (certains câbles ne font que la charge)
- Branchez directement sur un **port USB du PC**, pas via un hub
- Vérifiez l’**alimentation** (5 V stable)
- Sur certaines cartes : un **jumper** désactive le reset automatique (DTR→EN) — voir la doc de la carte

### 5. Bouton BOOT

Le bouton **BOOT** est nécessaire **uniquement pour flasher** (mettre à jour le firmware). Pour la communication série normale, vous n’avez pas besoin de le maintenir.

---

## Dépannage : « Le numpad n’apparaît pas en USB » / « Pas disponible quand l’IDE est ouverte »

- **Le clavier (HID) n’existe que sur le port « USB » (natif).** Vérifiez que vous branchez bien ce connecteur et pas seulement le port « UART » / « PROG ».
- **Un seul câble** : après avoir flashé via UART, débranchez et rebranchez sur le port **USB (natif)** pour utiliser le numpad.
- **Arduino IDE ouverte** : pour garder l’IDE (moniteur série) tout en utilisant le clavier, utilisez **deux câbles** (un sur UART pour l’IDE, un sur USB pour le clavier) ou **USB CDC On Boot = Disabled** et branchez le clavier sur le port USB natif (voir section « Clavier + IDE ouverte »).
