// @ts-ignore
import css from '../dist/mfe-highlighter.css';
import { HighlightOptions } from './types';

function injectCSS() {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}

function createInfoBar(org: string, owner: string, mfeName: string, mfeVersion: string | null): HTMLDivElement {
  const infoBar = document.createElement('div');
  infoBar.className = 'mfe-highlight-container';

  const version = mfeVersion ? `<span>&#128187; @v${mfeVersion}</span>` : '';

  infoBar.innerHTML = `
    <div class="mfe-highlight">
      <div class="mfe-border"></div>
      <div class="mfe-bar">
        <div class="mfe-bar-content">
          <a>&#127970; ${org}</a>
          <a>
            <span>&#128100; ${owner}.${mfeName}</span>
            ${version}
          </a>
        </div>
      </div>
    </div>
  `;

  return infoBar;
}


export function initMFEHighlighter(options: HighlightOptions = { org: '@mfe-pro', primaryColor: '#4fedeb', secondaryColor: '#0958ee' }) {
  injectCSS();
  const { primaryColor = '#4fedeb', secondaryColor = '#0958ee' } = options;

  document.documentElement.style.setProperty('--mfe-highlight-primary-color', primaryColor);
  document.documentElement.style.setProperty('--mfe-highlight-secondary-color', secondaryColor);

  const elements = document.querySelectorAll('[data-mfe-highlight="true"]') as unknown as HTMLElement[];

  elements.forEach((element) => {
    const name = element.getAttribute('data-mfe-name');
    const owner = element.getAttribute('data-mfe-owner');
    const version = element.getAttribute('data-mfe-version');

    if (!name || !owner) return;

    element.style.setProperty('--primary-color', primaryColor);
    element.style.setProperty('--secondary-color', secondaryColor);

    element.addEventListener('mouseover', () => {
      const container = createInfoBar(options.org, owner, name, version);
      const { top, height, width } = element.getBoundingClientRect();
      const infoBar = container.querySelector('.mfe-bar') as HTMLElement | null;
      const infoBarHeight = 40;

      element.parentNode?.insertBefore(container, element.nextSibling);

      if(infoBar) {
        infoBar.style.top = top < infoBarHeight ? `${height - 5}px` : '-34px';
      }

      const firstChild = container.firstElementChild as HTMLElement | null;
      if (firstChild) {
        firstChild.style.width = `${width}px`;
        firstChild.style.height = `${height}px`;
      }

      container.style.top = `${top}px`;
    });

    element.addEventListener('mouseout', () => {
      document.querySelector('.mfe-highlight-container')?.remove();
    });
  });
}
