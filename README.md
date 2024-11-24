## Тестовое задание для "ПК"

#### Задача: 
Создать инструмент для получения данных из базы данных через API.
ТЗ: https://docs.google.com/forms/d/e/1FAIpQLScOW-VvxvHAY7XaanA_E0bGeNUhje4Ih-HzXVwzOnQ3uyVpQA/viewform

#### Зависимости и запуск скрипта:
```angular2html
# Зависимости
npm install

# Старт
npm run start
```

В env переменных: 
- LIMIT - Количество персон в батче при обработке;
- GOOGLE_SERVICE_ACCOUNT_KEY - JSON файл с ключом для доступа к таблице, инструкция - https://docs.edna.ru/kb/get-service-json/;
- SHEET_ID - идентификатор таблицы в URL гугл таблицы после `spreadsheets/d/`.
