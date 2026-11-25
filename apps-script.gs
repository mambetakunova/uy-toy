// Google Apps Script для таблицы ответов гостей.
// Вставьте этот код в: Таблица → Расширения → Apps Script, затем
// Развернуть → Новое развертывание → Веб-приложение,
// «Выполнять как: Я», «Доступ: Все». Скопируйте URL в CONFIG.sheetUrl в index.html.

const HEADERS = ['Убакыт', 'Аты', 'Жооп', 'Каалоо'];

function sheet_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

// Приём ответа с формы «Келесизби?»
function doPost(e) {
  const p = e.parameter || {};
  const clean = (v, n) => String(v || '').replace(/^[=+\-@]/, "'$&").slice(0, n);
  sheet_().appendRow([new Date(), clean(p.name, 80), clean(p.answer, 60), clean(p.wish, 600)]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Список пожеланий для блока «Коноктордун каалоолору» (последние 50)
function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const wishes = rows
    .filter(r => String(r[3]).trim())
    .map(r => ({ name: String(r[1]), wish: String(r[3]).replace(/^'/, '') }))
    .reverse()
    .slice(0, 50);
  return ContentService.createTextOutput(JSON.stringify(wishes))
    .setMimeType(ContentService.MimeType.JSON);
}
