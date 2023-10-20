import { DependentElement } from '@living-papers/components';

export class TexMath extends DependentElement {
  static get dependencies() {
    return [
      {
        name: 'katex',
        version: '0.15.3',
        module: 'dist/katex.mjs',
        main: 'dist/katex.min.js',
        css: 'dist/katex.min.css'
      }
    ]
  }

  static get properties() {
    return {
      mode: { type: String },
      code: { type: String },
      maug: { type: String },
      leqno: { type: Boolean },
      fleqn: { type: Boolean, converter: v => v !== 'false' },
      minRuleThickness: { type: Number }
    };
  }

  constructor() {
    super();
    this.mode = 'display';
    this.leqno = false;
    this.fleqn = false;
  }

  initialChildNodes(nodes) {
    // attempt to extract code from first child
    if (!this.hasAttribute('code') && nodes.length) {
      this.code = nodes[0].textContent;
    }
  }

  addAugmentations() {
    let code = this.maug || this.code;
    for (let i = 0; i < this.definitions.length; i++) {
      const { replace, symbol } = this.definitions[i];
      code = code.replaceAll(replace, `\\htmlClass{maug maug-${i}}{${symbol}}`);
    }
    return code;
  }

  prepareMath() {
    if (!this.definitions) {
      this.definitions = this.articleData()?.definitions || [];
    }
    return this.addAugmentations();
  }

  render() {
    const katex = this.getDependency('katex');
    if (!katex || !this.code) return;

    // See https://katex.org/docs/options.html
    const displayMode = this.mode === 'display';
    const options = {
      throwOnError: false,
      displayMode,
      leqno: this.leqno,
      fleqn: this.fleqn,
      minRuleThickness: this.minRuleThickness,
      trust: ({ command }) => command === '\\htmlClass',
      strict: (errorCode) => errorCode === "htmlExtension" ? "ignore" : "warn",
    };

    const root = document.createElement(displayMode ? 'div' : 'span');
    const math = this.prepareMath();
    katex.render(math, root, options);

    // first, colorize math augmentations
    const maugs = root.querySelectorAll('.enclosing');
    for (const el of maugs) {
      const id = [...el.classList].find(c => c.startsWith('maug-')).slice('maug-'.length);
      const { color } = this.definitions[+id];
      el.style.color = color;
    }

    // after loading, initialize term definition tooltips
    setTimeout(() => {
      for (const el of maugs) {
        this.renderMaug(katex, el);
      }
    }, 200);

    return root;
  }

  renderMaug(katex, el) {
    // annotate parent nodes to control pointer-events
    let parent = el.parentNode;
    while (parent && parent !== this) {
      parent.classList.add('.maug-parent');
      parent = parent.parentNode;
    }

    // retrieve term definition
    const id = [...el.classList].find(c => c.startsWith('maug-')).slice('maug-'.length);
    let { symbol, definition } = this.definitions[+id];
    symbol = symbol.replaceAll('@', '');
    definition = definition.replaceAll('@', '');

    // create term definition (maug) tooltip
    const maug = document.createElement('span');
    maug.className = 'maug-tooltip';
    katex.render(`${symbol}:\\text{${definition}}`, maug, {
      throwOnError: false,
      displayMode: false,
      leqno: this.leqno,
      fleqn: this.fleqn,
      minRuleThickness: this.minRuleThickness
    });
    el.appendChild(maug);
    el.setAttribute('tabindex', 0);

    // add listeners to trigger maug visibility
    el.addEventListener('focusout', () => {
      maug.style.display = 'none';
    });
    el.addEventListener('keydown', (e) => {
      if (e.key == 'Enter') {
        maug.style.display = 'inline-block';
        e.stopImmediatePropagation();
      } else if (e.key == 'Escape') {
        maug.style.display = 'none';
      }
    });
    el.addEventListener('click', (e) => {
      maug.style.display = 'inline-block';
      e.stopImmediatePropagation();
    });

    // position maug
    const ebox = el.getBoundingClientRect();
    const mbox = maug.getBoundingClientRect();
    const dx = -ebox.width / 2 - mbox.width / 2 - 12;
    maug.style.transform = `translate(${dx}px, -40px)`;

    // add guide line from term to maug
    maug.appendChild(renderGuideLine(ebox, maug.getBoundingClientRect()));

    // hide maug by default
    maug.style.display = 'none';
  }
}


function renderGuideLine(elrect, winRect) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

  // starting point is right-top of maug
  // set up an SVG that spans the horizontal end points of both elements
  const x0 = Math.min(elrect.left, winRect.left);
  const x1 = Math.max(elrect.right, winRect.right);
  const y0 = winRect.bottom;
  const y1 = elrect.top;
  const dx = x0 - winRect.right + 5; // adjust for 5px of padding
  const dy = winRect.height - 1; // adjust for 1px of padding
  svg.setAttribute('style', `
    min-width: ${x1 - x0}px;
    max-width: ${x1 - x0}px;
    height: ${y1 - y0 + 3}px;
    transform: translate(${dx}px, ${dy}px);
  `); // add 3px of height to accommodate marker

  // position guide lines and marker
  const cx = elrect.left + elrect.width / 2 - x0;
  const cy = y1 - y0 - 2;
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', 2);
  line.setAttribute('stroke', 'black');
  line.setAttribute('stroke-width', '1px');
  line.setAttribute('x1', cx);
  line.setAttribute('y1', cy);
  line.setAttribute('x2', winRect.x + winRect.width / 2 - x0);
  line.setAttribute('y2', 0);

  svg.appendChild(line);
  svg.appendChild(circle);
  return svg;
}
