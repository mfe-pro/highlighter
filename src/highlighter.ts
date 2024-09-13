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
  infoBar.className = 'mfe-highlighter-container';

  const version = mfeVersion ? `<span>@v${mfeVersion}</span>` : '';

  infoBar.innerHTML = `
    <div class="mfe-highlighter">
      <div class="mfe-highlighter-border"></div>
      <div class="mfe-highlighter-bar">
        <div class="mfe-highlighter-bar-content">
          <a>&#127970; ${org}</a>
          <a>
            <span>&#128101; ${owner}.${mfeName}</span>
            ${version}
          </a>
        </div>
      </div>
    </div>
  `;

  return infoBar;
}


export function init(options: HighlightOptions = { org: '@mfe-pro', primaryColor: '#4fedeb', secondaryColor: '#0958ee' }) {
  injectCSS();
  const { primaryColor = '#4fedeb', secondaryColor = '#0958ee' } = options;

  document.documentElement.style.setProperty('--mfe-highlighter-primary-color', primaryColor);
  document.documentElement.style.setProperty('--mfe-highlighter-secondary-color', secondaryColor);

  const elements = document.querySelectorAll('[data-mfe-highlighter="true"]') as unknown as HTMLElement[];

  elements.forEach((element) => {
    const name = element.getAttribute('data-mfe-name');
    const owner = element.getAttribute('data-mfe-owner');
    const version = element.getAttribute('data-mfe-version');

    if (!name || !owner) return;

    element.style.setProperty('--mfe-highlighter-primary-color', primaryColor);
    element.style.setProperty('--mfe-highlighter-secondary-color', secondaryColor);

    element.addEventListener('mouseover', () => {
      const container = createInfoBar(options.org, owner, name, version);
      const { top, left, right, bottom, height, width } = element.getBoundingClientRect();
      const infoBar = container.querySelector('.mfe-highlighter-bar') as HTMLElement | null;
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
      container.style.left = `${left}px`;
      container.style.right = `${right}px`;
      container.style.bottom = `${bottom}px`;
    });

    element.addEventListener('mouseout', () => {
      document.querySelector('.mfe-highlighter-container')?.remove();
    });
  });
}
