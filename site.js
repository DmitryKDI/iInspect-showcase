const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
if (menuButton && navigation) {
  menuButton.hidden = false;
  navigation.classList.add('enhanced');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  };
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
}

const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
if (tabs.length && panels.length) {
  tabs[0].parentElement.setAttribute('role', 'tablist');
  tabs.forEach(tab => tab.setAttribute('role', 'tab'));
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.tabIndex = 0;
  });
  function selectTab(selected, moveFocus = false) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.removeAttribute('aria-pressed');
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.panel !== selected.dataset.tab;
    });
    if (moveFocus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next], true);
      }
    });
  });
  selectTab(tabs[0]);
}


const examples = {
  plan: {
    category: 'Архитектурные решения',
    title: 'Положение двери изменилось',
    finding: 'Проверьте основание переноса двери',
    explanation: 'В рабочем и исполнительном планах проём расположен иначе, чем в проектном. Инспектор проверяет, согласовано ли изменение.',
    values: ['Исходное положение', 'Дверь перенесена', 'Как в рабочем плане'],
    files: ['План этажа · лист 01', 'План этажа · лист 01', 'Исполнительная схема · лист 01'],
    alts: ['Проектный план с дверным проёмом слева', 'Рабочий план с дверным проёмом справа', 'Исполнительный план с перенесённым дверным проёмом']
  },
  material: {
    category: 'Отделка помещений',
    title: 'В ведомостях указан разный материал',
    finding: 'Проверьте основание замены покрытия',
    explanation: 'Для кабинета 102 в проектной ведомости указан керамогранит. В рабочей и исполнительной — виниловая плитка. Специалист проверяет согласование замены.',
    values: ['Керамогранит', 'Виниловая плитка', 'Виниловая плитка'],
    files: ['Ведомость отделки · лист 01', 'Ведомость отделки · лист 01', 'Ведомость материалов · лист 01'],
    alts: ['Проектная ведомость: керамогранит в кабинете 102', 'Рабочая ведомость: виниловая плитка в кабинете 102', 'Исполнительная ведомость: виниловая плитка в кабинете 102']
  },
  node: {
    category: 'Комплектность документов',
    title: 'Не приложено подтверждение узла',
    finding: 'Запросите подтверждающий документ',
    explanation: 'Узел крепления К-1 показан в ПД и РД. В представленном комплекте ИД подтверждающий документ отсутствует. Это повод уточнить комплект, а не автоматически признать нарушение.',
    values: ['Узел К-1 предусмотрен', 'Крепление детализировано', 'Подтверждение не приложено'],
    files: ['Узел крепления · лист 01', 'Узел крепления · лист 01', 'Реестр документов · лист 01'],
    alts: ['Проектный узел крепления К-1', 'Рабочий узел крепления К-1', 'Реестр ИД: подтверждение узла К-1 не приложено']
  }
};
const stages = ['pd', 'rd', 'id'];
const stageNames = ['ПД', 'РД', 'ИД'];
let activeExample = 'plan';
function exampleSource(key, stage) {
  return 'assets/examples/' + key + '-' + stages[stage] + '.svg';
}
document.querySelectorAll('[data-case]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.case;
    const example = examples[key];
    if (!example) return;
    activeExample = key;
    document.querySelectorAll('[data-case]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('case-category').textContent = example.category;
    document.getElementById('case-title').textContent = example.title;
    document.getElementById('case-finding').textContent = example.finding;
    document.getElementById('case-explanation').textContent = example.explanation;
    document.querySelectorAll('[data-open-document]').forEach((link, index) => {
      link.href = exampleSource(key, index);
      const picture = link.querySelector('img');
      picture.src = exampleSource(key, index);
      picture.alt = example.alts[index];
      link.querySelector('[data-case-value]').textContent = example.values[index];
      link.querySelector('[data-case-file]').textContent = example.files[index];
    });
  });
});

const documentViewer = document.getElementById('document-viewer');
if (documentViewer) {
  let viewerCase = 'plan';
  let opener;
  function setViewerStage(stage) {
    const example = examples[viewerCase];
    const picture = document.getElementById('document-viewer-image');
    picture.src = exampleSource(viewerCase, stage);
    picture.alt = example.alts[stage];
    document.getElementById('document-viewer-title').textContent = stageNames[stage] + ' · ' + example.title;
    document.getElementById('document-viewer-caption').textContent = example.values[stage] + ' — ' + example.files[stage] + '. Условный документ.';
    documentViewer.querySelectorAll('[data-viewer-stage]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.viewerStage) === stage));
    });
  }
  function openDocument(event, key, stage) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button || typeof documentViewer.showModal !== 'function') return;
    event.preventDefault();
    opener = event.currentTarget;
    viewerCase = key;
    setViewerStage(stage);
    documentViewer.showModal();
  }
  document.querySelectorAll('[data-open-document]').forEach(link => link.addEventListener('click', event => openDocument(event, activeExample, Number(link.dataset.openDocument))));
  document.querySelectorAll('[data-view-case]').forEach(link => link.addEventListener('click', event => openDocument(event, link.dataset.viewCase, Number(link.dataset.viewStage))));
  documentViewer.querySelectorAll('[data-viewer-stage]').forEach(button => button.addEventListener('click', () => setViewerStage(Number(button.dataset.viewerStage))));
  documentViewer.querySelector('[data-viewer-close]').addEventListener('click', () => documentViewer.close());
  documentViewer.addEventListener('close', () => opener?.focus({preventScroll: true}));
  documentViewer.addEventListener('click', event => {
    if (event.target !== documentViewer) return;
    const bounds = documentViewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) documentViewer.close();
  });
}
const compareRange = document.getElementById('compare-range');
const drawingSlider = document.getElementById('drawing-slider');
if (compareRange && drawingSlider) {
  let activePointer = null;
  function updateComparison(value) {
    const percent = Math.max(0, Math.min(100, Number(value)));
    if (!Number.isFinite(percent)) return;
    compareRange.value = String(percent);
    compareRange.setAttribute('aria-valuetext', 'ПД: ' + Math.round(percent) + '%, РД: ' + Math.round(100 - percent) + '%');
    drawingSlider.style.setProperty('--split', percent + '%');
  }
  function updateFromPointer(event) {
    const bounds = drawingSlider.getBoundingClientRect();
    if (bounds.width) updateComparison((event.clientX - bounds.left) / bounds.width * 100);
  }
  function stopDragging(event) {
    if (event.pointerId !== activePointer) return;
    activePointer = null;
    drawingSlider.classList.remove('is-dragging');
    if (drawingSlider.hasPointerCapture(event.pointerId)) drawingSlider.releasePointerCapture(event.pointerId);
  }
  compareRange.addEventListener('input', () => updateComparison(compareRange.value));
  drawingSlider.addEventListener('pointerdown', event => {
    if (!event.isPrimary || activePointer !== null || event.button !== 0) return;
    activePointer = event.pointerId;
    drawingSlider.setPointerCapture(event.pointerId);
    drawingSlider.classList.add('is-dragging');
    updateFromPointer(event);
  });
  drawingSlider.addEventListener('pointermove', event => {
    if (event.pointerId === activePointer) updateFromPointer(event);
  });
  drawingSlider.addEventListener('pointerup', event => {
    if (event.pointerId === activePointer) updateFromPointer(event);
    stopDragging(event);
  });
  drawingSlider.addEventListener('pointercancel', stopDragging);
  drawingSlider.addEventListener('lostpointercapture', stopDragging);
  drawingSlider.addEventListener('dragstart', event => event.preventDefault());
  updateComparison(compareRange.value);
}
