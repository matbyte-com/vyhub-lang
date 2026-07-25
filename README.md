# vyhub-lang
Translations for VyHub 

## Contribute

To contribute, create a Merge Request

## Maintenance tooling (`i18n_tools.cjs`)

`en.json` is the base language. `i18n_tools.cjs` is a dependency-free Node helper
for finding and filling keys that are missing from the other language files.
Run it from this directory (`src/lang`).

### `status`

List how many base keys are still missing in every non-English file:

```
node i18n_tools.cjs status
```

### `dump <lang>`

Print the missing keys for one language as a flat `{ "dotted.key": "English value" }`
object. Redirect it to a working file, then translate the values in place:

```
node i18n_tools.cjs dump es > patch.json
```

Keys use dotted paths (e.g. `_shop.labels.firstCycle`) that map onto the nested
JSON structure. Only translate the values — leave the keys and any `{placeholder}`
tokens unchanged.

### `merge <lang> <patchFile>`

Merge a flat patch file (same shape as `dump` output) back into a language file.
Existing content and key order are preserved, new keys are added in the correct
nested position, and the file is written with 4-space indentation. It prints how
many keys were applied and how many are still missing:

```
node i18n_tools.cjs merge es patch.json
# es: applied 1018, remaining missing 0
```

Typical workflow: `dump` a language to a patch file, translate the values, `merge`
it back, then run `status` to confirm 0 missing. Delete the temporary patch file
when done.

