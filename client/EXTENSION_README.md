# Smart Resume AI - Chrome Extension

## Сборка расширения

Для сборки Chrome расширения выполните:

```bash
npm run build:extension
```

Или просто:

```bash
npm run build
```

## Установка в Chrome

1. Откройте Chrome и перейдите в `chrome://extensions/`
2. Включите "Режим разработчика" (Developer mode) в правом верхнем углу
3. Нажмите "Загрузить распакованное расширение" (Load unpacked)
4. Выберите папку `dist` из этого проекта
5. Расширение будет установлено и готово к использованию

## Использование

1. После установки вы увидите иконку Smart Resume AI в панели расширений Chrome
2. Нажмите на иконку, чтобы открыть side panel с приложением
3. При посещении страниц с вакансиями (LinkedIn, Indeed, Glassdoor и др.) расширение автоматически извлечет описание работы
4. Используйте извлеченное описание для создания резюме и сопроводительных писем

## Поддерживаемые сайты

- LinkedIn Jobs
- Indeed
- Glassdoor
- Monster
- ZipRecruiter
- CareerBuilder
- Dice
- AngelList
- Stack Overflow Jobs
- GitHub Jobs

## Структура файлов

- `manifest.json` - манифест расширения
- `background.js` - фоновый скрипт
- `content.js` - контентный скрипт для извлечения данных с сайтов
- `index.html` - главная страница side panel
- `icons/` - иконки расширения разных размеров
- `assets/` - собранные JS и CSS файлы

## Разработка

Для разработки используйте:

```bash
npm run dev
```

Это запустит Vite dev server для разработки React приложения.
