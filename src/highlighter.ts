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
          <a>${org}</a>
          <a>
            <span>${owner} | ${mfeName}</span>
            ${version}
          </a>
        </div>
      </div>
    </div>
  `;

  return infoBar;
}

function applyHighlight(options: HighlightOptions, element: HTMLElement, processedElements: Set<HTMLElement>) {
  if (processedElements.has(element)) return;
  processedElements.add(element);

  const name = element.getAttribute('data-mfe-name');
  const owner = element.getAttribute('data-mfe-owner');
  const version = element.getAttribute('data-mfe-version') ?? null;

  if (!name || !owner) return;

  const {
    primaryColor = '#ff6995',
    secondaryColor = '#3ecdff',
    fontColor = 'black',
    barColor = '#0958ee'
  } = options;

  element.style.setProperty('--mfe-highlighter-font-color', fontColor || '');
  element.style.setProperty('--mfe-highlighter-bar-color', barColor || '');
  element.style.setProperty('--mfe-highlighter-primary-color', primaryColor || '');
  element.style.setProperty('--mfe-highlighter-secondary-color', secondaryColor || '');

  element.addEventListener('mouseover', () => {
    const container = createInfoBar(options.org, owner, name, version);
    const { top, left, height, width } = element.getBoundingClientRect();
    const infoBar = container.querySelector('.mfe-highlighter-bar') as HTMLElement | null;
    const infoBarHeight = 40;

    const parent = element.offsetParent;
    const parentRect = parent ? parent.getBoundingClientRect() : { top: 0, left: 0 };
    const pageTop = top - parentRect.top;
    const pageLeft = left - parentRect.left;

    element.parentNode?.insertBefore(container, element.nextSibling);

    if (infoBar) {
      infoBar.style.top = top < infoBarHeight ? `${height - 5}px` : '-34px';
    }

    const firstChild = container.firstElementChild as HTMLElement | null;
    if (firstChild) {
      firstChild.style.width = `${width}px`;
      firstChild.style.height = `${height}px`;
    }

    container.style.top = `${pageTop}px`;
    container.style.left = `${pageLeft}px`;
  });

  element.addEventListener('mouseout', () => {
    document.querySelector('.mfe-highlighter-container')?.remove();
  });
}

export function init(options: HighlightOptions = { org: '@mfe-pro', fontColor: 'white', barColor: '#0958ee', primaryColor: '#4fedeb', secondaryColor: '#0958ee' }) {
  injectCSS();
  const { primaryColor = '#ff6995', secondaryColor = '#3ecdff', fontColor = 'black', barColor = '#0958ee' } = options;

  document.documentElement.style.setProperty('--mfe-highlighter-font-color', fontColor || '');
  document.documentElement.style.setProperty('--mfe-highlighter-bar-color', barColor || '');
  document.documentElement.style.setProperty('--mfe-highlighter-primary-color', primaryColor || '');
  document.documentElement.style.setProperty('--mfe-highlighter-secondary-color', secondaryColor || '');

  const processedElements = new Set<HTMLElement>();

  const observer = new MutationObserver(() => {
    const elements = document.querySelectorAll('[data-mfe-highlighter="true"]') as unknown as HTMLElement[];
    elements.forEach((element) => {
      if (!processedElements.has(element)) {
        applyHighlight(options, element, processedElements);
        processedElements.add(element);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  const elements = document.querySelectorAll('[data-mfe-highlighter="true"]') as unknown as HTMLElement[];
  elements.forEach((element) => applyHighlight(options, element, processedElements));
}
