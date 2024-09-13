import { init } from '../src/highlighter';

function resetDOM() {
  document.body.innerHTML = '';
}

describe('MFE Highlighter', () => {
  beforeEach(() => {
    resetDOM();
  });

  test('should inject CSS into the DOM', () => {
    init();

    const styleTag = document.querySelector('style');
    expect(styleTag).not.toBeNull();
  });

  test('should initialize and highlight elements with data-mfe-highlighter="true"', () => {
    document.body.innerHTML = `
      <div data-mfe-highlighter="true" data-mfe-name="example-owner" data-mfe-owner="owner-1" data-mfe-version="1.0.0">Component 1</div>
      <div data-mfe-highlighter="true" data-mfe-name="another-owner" data-mfe-owner="owner-2" data-mfe-version="2.0.0">Component 2</div>
    `;

    init();

    const elements = document.querySelectorAll('[data-mfe-highlighter="true"]');
    expect(elements.length).toBe(2);

    const mouseoverEvent = new Event('mouseover');
    elements[0].dispatchEvent(mouseoverEvent);

    const infoBar = document.querySelector('.mfe-highlighter-bar');
    expect(infoBar).not.toBeNull();
    expect(infoBar?.textContent).toContain('example-owner');
  });

  test('should not display version if it is null or empty', () => {
    document.body.innerHTML = `
      <div data-mfe-highlighter="true" data-mfe-name="example-owner" data-mfe-owner="owner-1">Component without version</div>
    `;

    init();

    const element = document.querySelector('[data-mfe-highlighter="true"]') as HTMLElement;
    const mouseoverEvent = new Event('mouseover');
    element.dispatchEvent(mouseoverEvent);

    const infoBar = document.querySelector('.mfe-highlighter-bar');
    expect(infoBar).not.toBeNull();

    expect(infoBar?.textContent).not.toContain('@v');
  });

  test('should apply dynamic gradient to highlighted elements on hover', () => {
    document.body.innerHTML = `
      <div data-mfe-highlighter="true" data-mfe-name="example-owner" data-mfe-owner="owner-1" data-mfe-version="1.0.0">Component with Gradient</div>
    `;

    init({ org: 'teste', primaryColor: '#ff0000', secondaryColor: '#00ff00' });

    const element = document.querySelector('[data-mfe-highlighter="true"]') as HTMLElement;
    const mouseoverEvent = new Event('mouseover');
    element.dispatchEvent(mouseoverEvent);

    const computedStyle = getComputedStyle(element);
    expect(computedStyle.getPropertyValue('--mfe-highlighter-primary-color')).toBe('#ff0000');
    expect(computedStyle.getPropertyValue('--mfe-highlighter-secondary-color')).toBe('#00ff00');

    const mouseoutEvent = new Event('mouseout');
    element.dispatchEvent(mouseoutEvent);

    const infoBar = document.querySelector('.mfe-highlighter-bar');
    debugger
    expect(infoBar).toBeNull();
  });

  test('should return early if name or owner is missing', () => {
    document.body.innerHTML = `
    <div data-mfe-highlighter="true" data-mfe-owner="owner-without-name"></div>
    <div data-mfe-highlighter="true" data-mfe-name="name-without-owner"></div>
  `;

    init();

    const infoBars = document.querySelectorAll('.mfe-highlighter-bar');
    expect(infoBars.length).toBe(0);
  });
});
