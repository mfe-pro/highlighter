// @ts-ignore
import css from '../dist/mfe-highlighter.css';
import { HighlightOptions } from './types';

let observer: MutationObserver | null = null;
let processedElements = new Set<HTMLElement>();
let eventListeners = new Map<HTMLElement, { mouseover: EventListener; mouseout: EventListener }>();

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

function updatePosition(element: HTMLElement, container: HTMLElement, infoBar: HTMLElement | null) {
  const { top, left, width, height } = element.getBoundingClientRect();
  const adjustedTop = top + window.scrollY;
  const adjustedLeft = left + window.scrollX;

  if (infoBar) {
    infoBar.style.top = top < 40 ? `${height - 5}px` : '-34px';
  }

  const firstChild = container.firstElementChild as HTMLElement | null;
  if (firstChild) {
    firstChild.style.width = `${width}px`;
    firstChild.style.height = `${height}px`;
  }

  container.style.position = 'absolute';
  container.style.top = `${adjustedTop}px`;
  container.style.left = `${adjustedLeft}px`;
}

function applyHighlight(options: HighlightOptions, element: HTMLElement) {
  if (processedElements.has(element)) return;
  processedElements.add(element);

  const name = element.getAttribute('data-mfe-name') || element.getAttribute('data-component-name');
  const owner = element.getAttribute('data-mfe-owner');
  const version = element.getAttribute('data-mfe-version') ?? null;

  if (!name || !owner) return;

  const container = createInfoBar(options.org, owner, name, version);
  const infoBar = container.querySelector('.mfe-highlighter-bar') as HTMLElement | null;

  const mouseoverListener = () => {
    document.body.appendChild(container);
    updatePosition(element, container, infoBar);
  };

  const mouseoutListener = () => {
    container.remove();
  };

  element.addEventListener('mouseover', mouseoverListener);
  element.addEventListener('mouseout', mouseoutListener);

  eventListeners.set(element, { mouseover: mouseoverListener, mouseout: mouseoutListener });
}

function createFloatingButton() {
  let isActive = false;

  const config: HighlightOptions | any = window.MFEHighlighterConfig || {
    buttonActiveColor: '#3ecdff',
    buttonInactiveColor: '#ff6995',
    iconActiveColor: '#ffffff',
    iconInactiveColor: '#000000',
  };

  const getActiveIcon = (color: string) => `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 50%; height: 50%; display: block; margin: auto;">
      <g id="SVGRepo_iconCarrier">
        <path d="M4 4L20 20" stroke="${color}" stroke-width="2" stroke-linecap="round"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.32711 6.74132L3.47001 9.152C3.17763 9.33474 3.00001 9.65521 3.00001 10C3.00001 10.3448 3.17763 10.6653 3.47001 10.848L11.47 15.848C11.7943 16.0507 12.2057 16.0507 12.53 15.848L14.9323 14.3465L13.481 12.8952L12 13.8208L5.88681 10L8.77849 8.1927L7.32711 6.74132ZM15.2215 11.8073L18.1132 10L12 6.17925L10.5191 7.10484L9.06768 5.65346L11.47 4.152C11.7943 3.94933 12.2057 3.94933 12.53 4.152L20.53 9.152C20.8224 9.33474 21 9.65521 21 10C21 10.3448 20.8224 10.6653 20.53 10.848L16.6729 13.2587L15.2215 11.8073ZM15.9425 15.3567L12 17.8208L4.53001 13.152C4.06167 12.8593 3.44472 13.0017 3.15201 13.47C2.8593 13.9383 3.00168 14.5553 3.47001 14.848L11.47 19.848C11.7943 20.0507 12.2057 20.0507 12.53 19.848L17.3939 16.8081L15.9425 15.3567ZM19.1344 15.7202L17.6831 14.2688L19.47 13.152C19.9383 12.8593 20.5553 13.0017 20.848 13.47C21.1407 13.9383 20.9983 14.5553 20.53 14.848L19.1344 15.7202Z" fill="${color}"></path>
      </g>
    </svg>
  `;

  const getInactiveIcon = (color: string) => `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 50%; height: 50%; display: block; margin: auto;">
      <g id="SVGRepo_iconCarrier">
        <path id="Vector" d="M21 14L12 20L3 14M21 10L12 16L3 10L12 4L21 10Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </g>
    </svg>
  `;

  const button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.border = 'none';
  button.style.borderRadius = '50%';
  button.style.padding = '0';
  button.style.cursor = 'pointer';
  button.style.zIndex = '1000';
  button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  button.style.backgroundColor = config.buttonInactiveColor;
  button.innerHTML = getInactiveIcon(config.iconInactiveColor);

  button.addEventListener('click', () => {
    isActive = !isActive;

    button.style.backgroundColor = isActive ? config.buttonActiveColor : config.buttonInactiveColor;
    button.innerHTML = isActive ? getActiveIcon(config.iconActiveColor) : getInactiveIcon(config.iconInactiveColor);

    if (isActive) {
      window.MFEHighlighter.init(config);
    } else {
      window.MFEHighlighter.destroy();
    }
  });

  document.body.appendChild(button);
}

export function init(options: HighlightOptions = { org: '@mfe-pro', fontColor: 'white', barColor: '#0958ee', primaryColor: '#4fedeb', secondaryColor: '#0958ee' }) {
  injectCSS();

  document.documentElement.style.setProperty('--mfe-highlighter-font-color', options.fontColor || '');
  document.documentElement.style.setProperty('--mfe-highlighter-bar-color', options.barColor || '');
  document.documentElement.style.setProperty('--mfe-highlighter-primary-color', options.primaryColor || '');
  document.documentElement.style.setProperty('--mfe-highlighter-secondary-color', options.secondaryColor || '');

  observer = new MutationObserver(() => {
    const elements = document.querySelectorAll('[data-mfe-highlighter="true"]') as unknown as HTMLElement[];
    elements.forEach((element) => {
      if (!processedElements.has(element)) {
        applyHighlight(options, element);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const elements = document.querySelectorAll('[data-mfe-highlighter="true"]') as unknown as HTMLElement[];
  elements.forEach((element) => applyHighlight(options, element));
}

export function destroy() {
  document.documentElement.style.removeProperty('--mfe-highlighter-font-color');
  document.documentElement.style.removeProperty('--mfe-highlighter-bar-color');
  document.documentElement.style.removeProperty('--mfe-highlighter-primary-color');
  document.documentElement.style.removeProperty('--mfe-highlighter-secondary-color');

  processedElements.forEach((element) => {
    const container = element.querySelector('.mfe-highlighter-container');
    if (container) container.remove();

    const listeners = eventListeners.get(element);
    if (listeners) {
      element.removeEventListener('mouseover', listeners.mouseover);
      element.removeEventListener('mouseout', listeners.mouseout);
      eventListeners.delete(element);
    }
  });

  processedElements.clear();

  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

document.addEventListener('DOMContentLoaded', createFloatingButton);