# btlz-wb-test

Сервис для получения тарифов Wildberries и выгрузки их в Google Таблицы.

## Что делает

- Каждый час получает тарифы для коробов с WB API
- Сохраняет данные в PostgreSQL (по одной записи на склад в день, обновляет при повторном запросе)
- Обновляет данные во всех Google Таблицах из БД (лист `stocks_coefs`), отсортированных по коэффициенту доставки

## Запуск

### 1. Клонировать репозиторий

git clone https://github.com/lucard17/btlz-wb-test.git

cd btlz-wb-test

### 2. Заполнить конфигурацию

cp .env.example .env

Открыть `.env` и заполнить все переменные.

### 3. Добавить Google Таблицы

В файле `src/postgres/seeds/spreadsheets.js` заменить `some_spreadsheet` на реальный ID таблицы.

ID таблицы берётся из URL:
https://docs.google.com/spreadsheets/d/ВОТ_ЭТО_ID/edit

Для каждой таблицы добавить отдельную строку в массив:
```js
[
  { spreadsheet_id: "id_первой_таблицы" },
  { spreadsheet_id: "id_второй_таблицы" },
]
```

Выдать доступ сервисному аккаунту (`GOOGLE_SERVICE_ACCOUNT_EMAIL`) к каждой таблице с правами редактора.

### 4. Запустить

docker compose up

Приложение само применит миграции, сиды и запустит scheduler.

## Переменные окружения

| Переменная | Описание |
|---|---|
| POSTGRES_DB | Название БД |
| POSTGRES_USER | Пользователь БД |
| POSTGRES_PASSWORD | Пароль БД |
| POSTGRES_PORT | Порт БД |
| POSTGRES_HOST | Хост БД |
| APP_PORT | Порт приложения |
| WB_API_TOKEN | Токен WB API |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | Email сервисного аккаунта Google |
| GOOGLE_PRIVATE_KEY | Приватный ключ сервисного аккаунта |

## Проверка работы

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

В Google Таблице на листе `stocks_coefs` должны появятся данные отсортированные по коэффициенту доставки.

