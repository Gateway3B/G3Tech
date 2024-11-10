---
layout: "../../layouts/BlogPost.astro"
title: "Voyager Split Keyboard"
description: "The ZSA Voyager is my favorite split keyboard."
pubDate: "November 8 2024"
draft: false
---
After I build my previous keyboard, the ferris sweep, I wasn't really looking for another keyboard. But about a year ago, ZSA, the creators of the moonlander, released the Voyager. It was almost exactly what I would of wanted. Only a few more keys than my sweep, qmk capable, rgb keys, low profile choc key caps and switches, sturdy, and highly portable. I got it a week after it came out and I've been loving it ever since.

# Downsides
Before I go into why I like it so much and my keymap for it, there are a few downsides. The first one is there are still only 2 thumb keys per side. That was my main issue with my ferris sweep, so only having 2 on the voyager was a bummer. Another downside I didn't realize until I got it was the pinky key staggering. It was much more aggressive on my sweep, and on the voyager I have to reach a bit for my pinkys to hit the top letter row.

# Things I Like
Now for what I love about it. Of course, just like my sweep, it is a split columnar staggered keyboard. I don't think I could ever get another keyboard that wasn't all of those things. It has nice choc 50g linear red key switches which feel and sound satisfying, without being too noisy in the office. The keycaps feel nice, and have small transparent dots for the rgb to come through. The key positioning is really nice, except for the aforementioned pinky staggering issue. It is low profile and comes with a nice soft case that easily fits in my backpack. You can magnetically connect attachments to the bottom for mounting, tenting and tilting. I actually designed a super steep 45 degree tent which made me realize that the tenting on my sweep was actually hurting my thumbs. After that, I went with no tent, and if I go back to my sweep for any period of time, I will probably remove the tent I designed for it.

# Keymap
Now for the keymap. It is similar to the one I had on the sweep but I've made several upgrades:

```C
[COLEMAK] = LAYOUT_voyager(
        KC_ESCAPE,         QWERTY_ON, KC_AUDIO_VOL_UP, KC_MEDIA_PLAY_PAUSE, KC_MEDIA_NEXT_TRACK, QWERTY_OFF,          MAGIC_SWAP_LCTL_LGUI,  KC_MS_BTN4,    KC_PSCREEN, KC_MS_BTN5, MAGIC_UNSWAP_LCTL_LGUI,   MAC_SPOTLIGHT,
        KC_LGUI ,            KC_Q,    KC_W,            KC_F,                KC_P,                KC_G,                KC_J,                  KC_L,          KC_U,       KC_Y,       KC_BSPACE, KC_LALT,
        TAB_LEFT,            KC_A,    KC_R,            KC_S,                KC_T,                KC_D,                KC_H,                  KC_N,          KC_E,       KC_I,       KC_O,      TAB_RIGHT,
        APP_CYCLE,           KC_Z,    KC_X,            KC_C,                KC_V,                KC_B,                KC_K,                  KC_M,          KC_COMMA,   KC_DOT,     KC_QUOTE,  APP_CYCLE_CONTROL,
                                                                            KC_LCTRL,            KC_LSHIFT,           LT(NUMBERS, KC_SPACE), MO(NAVIGATION)
    ),
    [QWERTY] = LAYOUT_voyager(
        KC_TRANSPARENT, KC_1,           KC_2,           KC_3,           KC_4,           KC_TRANSPARENT,               KC_5,           KC_6,           KC_7,           KC_8,           KC_9,           KC_0,
        APP_CYCLE,      KC_Q,           KC_W,           KC_E,           KC_R,           KC_T,                         KC_Y,           KC_U,           KC_I,           KC_O,           KC_P,           KC_TRANSPARENT,
        KC_TAB,         KC_A,           KC_S,           KC_D,           KC_F,           KC_G,                         KC_H,           KC_J,           KC_K,           KC_L,           KC_BSPACE,      KC_ENTER,
        KC_LSHIFT,      KC_Z,           KC_X,           KC_C,           KC_V,           KC_B,                         KC_N,           KC_M,           KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT,
                                                                        KC_SPACE, KC_LCTRL,                           KC_TRANSPARENT, KC_TRANSPARENT
    ),
    [NAVIGATION] = LAYOUT_voyager(
        KC_F1,          KC_F2,     KC_F3,   KC_F4,   KC_F5,          KC_F6,                                           KC_F7,          KC_F8,         KC_F9,   KC_F10,         KC_F11,    KC_F12,
        KC_TRANSPARENT, KC_ESCAPE, KC_DLR,  KC_HASH, KC_ASTR,        KC_AMPR,                                         KC_HOME,        LCTL(KC_LEFT), KC_UP,   LCTL(KC_RIGHT), KC_BSPACE, KC_TRANSPARENT,
        KC_TRANSPARENT, KC_TAB,    KC_LABK, KC_LPRN, KC_LCBR,        KC_LBRACKET,                                     KC_END,         KC_LEFT,       KC_DOWN, KC_RIGHT,       KC_ENTER,  KC_TRANSPARENT,
        KC_TRANSPARENT, KC_LALT,   KC_F10,  KC_F11,  KC_F12,         KC_GRAVE,                                        KC_PLUS,        KC_MINUS,      KC_UNDS, KC_EQUAL,       KC_SLASH,  KC_TRANSPARENT,
                                                     KC_TRANSPARENT, KC_TRANSPARENT,                                  KC_TRANSPARENT, KC_TRANSPARENT
    ),
    [NUMBERS] = LAYOUT_voyager(
        KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT,               KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, RESET,
        KC_TRANSPARENT, KC_ESCAPE,      KC_PERC,        KC_AT,          KC_CIRC,        KC_PIPE,                      KC_MINUS,       KC_7,           KC_8,           KC_9,           KC_BSPACE,      KC_TRANSPARENT,
        KC_TRANSPARENT, KC_TAB,         KC_DOT,         KC_COMMA,       KC_SLASH,       KC_ASTR,                      KC_PLUS,        KC_4,           KC_5,           KC_6,           KC_ENTER,       KC_TRANSPARENT,
        KC_TRANSPARENT, KC_LALT,        KC_F5,          KC_F1,          KC_F2,          KC_SPACE,                     KC_EQUAL,       KC_1,           KC_2,           KC_3,           KC_0,           KC_TRANSPARENT,
                                                                        KC_TRANSPARENT, KC_TRANSPARENT,               KC_TRANSPARENT, KC_TRANSPARENT
    ),
    [MOUSE] = LAYOUT_voyager(
        KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT, KC_TRANSPARENT,      KC_TRANSPARENT,          KC_TRANSPARENT, KC_TRANSPARENT,       KC_TRANSPARENT, KC_TRANSPARENT,       KC_TRANSPARENT, KC_TRANSPARENT,
        KC_TRANSPARENT, KC_ESCAPE,      KC_MS_WH_LEFT,  KC_MS_WH_UP,    KC_MS_WH_RIGHT,      KC_PAUSE,                KC_MS_BTN5,     LGUI(LCTL(KC_LEFT)),  KC_MS_UP,       LGUI(LCTL(KC_RIGHT)), KC_BSPACE,      KC_TRANSPARENT,
        KC_TRANSPARENT, KC_MS_ACCEL2,   KC_MS_ACCEL1,   KC_MS_WH_DOWN,  KC_MS_ACCEL0,        KC_SCROLLLOCK,           KC_MS_BTN4,     KC_MS_LEFT,           KC_MS_DOWN,     KC_MS_RIGHT,          KC_ENTER,       KC_TRANSPARENT,
        KC_TRANSPARENT, KC_LCTRL,       KC_LGUI,        KC_LALT,        MAC_MISSION_CONTROL, KC_SYSTEM_SLEEP,         MAC_LOCK,       MAGIC_TOGGLE_CTL_GUI, KC_RALT,        KC_RGUI,              KC_RCTRL,       KC_TRANSPARENT,
                                                                        COLEMAK_CONTROL,     KC_TRANSPARENT,          KC_MS_BTN1,     KC_MS_BTN2
    ),
```

Everything is in relativly the same place, but I changed how moving between layers works. Before, I had to roll off the shift key on the left thumb to one of the 2 right thumb keys to change to the number and mouse layers. Now, holding space activates the number layer, and tapping space and layer key with the right thumb activate the mouse layer.