тестовое задание:
Система бронирования мест.

Реализовать API для бронирования места на мероприятие. Один пользователь не может забронировать дважды на одно событие.

POST /api/bookings/reserve

{
"event_id": 1,
"user_id": "user123"
}


Таблица events:

- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- total_seats (INT)

Таблица bookings:

- id (SERIAL PRIMARY KEY)
- event_id (INT, ссылка на events)
- user_id (VARCHAR)
- created_at (TIMESTAMP)

Ваша задача показать свои навыки.

