import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
const textarea = document.getElementById('mermaid-input');
const renderDiv = document.getElementById('mermaid-render');
const divider = document.getElementById('divider');
const panelInput = document.getElementById('panel-input');
const panelRender = document.getElementById('panel-render');

// Menu elements
const editorBtn = document.getElementById('editor-btn');
const editorDropdown = document.getElementById('editor-dropdown');
const showEditorBtn = document.getElementById('show-editor-btn');
const hideEditorBtn = document.getElementById('hide-editor-btn');
const renderBtn = document.getElementById('render-btn');
const saveSvgBtn = document.getElementById('save-svg-btn');

// Show/hide Editor dropdown
editorBtn.addEventListener('click', (e) => {
  editorDropdown.classList.toggle('show');
  e.stopPropagation();
});
// Hide dropdown when clicking outside
document.addEventListener('mousedown', (e) => {
  if (!editorDropdown.contains(e.target) && !editorBtn.contains(e.target)) {
    editorDropdown.classList.remove('show');
  }
});

// Show/Hide Editor logic
showEditorBtn.addEventListener('click', () => {
  panelInput.hidden = false;
  divider.hidden = false;
  panelInput.style.flexBasis = '50%';
  panelRender.style.flex = '1 1 0%';
  editorDropdown.classList.remove('show');
});
hideEditorBtn.addEventListener('click', () => {
  panelInput.hidden = true;
  divider.hidden = true;
  panelInput.style.flexBasis = '0px';
  panelRender.style.flex = '1 1 100%';
  editorDropdown.classList.remove('show');
});

// Render logic
renderBtn.addEventListener('click', async () => {
  await renderMermaid();
});

// Save SVG logic
saveSvgBtn.addEventListener('click', async () => {
  // Render SVG to get latest
  const { svg } = await mermaid.render('theGraph', textarea.value);
  // Create a Blob and trigger download
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'graph.svg';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
  editorDropdown.classList.remove('show');
});

// Enable Tab in textarea (insert 2 spaces)
textarea.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const spaces = '  '; // 2 spaces
    this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + spaces.length;
  }
});

// --- Resizable Split Logic ---
let isDragging = false;
divider.addEventListener('mousedown', function(e) {
  isDragging = true;
  document.body.style.cursor = 'col-resize';
  e.preventDefault();
});
window.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  const container = document.querySelector('.split-container');
  const rect = container.getBoundingClientRect();
  let x = e.clientX - rect.left;
  const min = 40; // px
  const max = rect.width - 40;
  if (x < min) x = min;
  if (x > max) x = max;
  panelInput.style.flexBasis = x + 'px';
});
window.addEventListener('mouseup', function() {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = '';
  }
});

// Initial render
async function renderMermaid() {
  try {
    const { svg } = await mermaid.render('theGraph', textarea.value);
    renderDiv.innerHTML = svg;
  } catch (e) {
    renderDiv.innerHTML = '<pre style="color:red;">' + e.message + '</pre>';
  }
}
renderMermaid();
