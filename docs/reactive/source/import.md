---
title: Reactive Runtime Imports
author:
  - name: Living Papers Team
output:
  html: true
---

This article imports and reuses a plot defined in a different article. A local variable is _injected_ as part of the plot import, changing the initial plot value and enabling reactive updates to the imported plot view.

``` js
viewof a = Inputs.range([0, 255], {step: 1, value: 200})
```

::: figure
``` js
import { plot } with { a } from './build/runtime.mjs'
---
plot
```
| A plot imported from another article runtime, with injected reactive variables!
:::
