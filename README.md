Выполнено тестовое задание для вакансии https://ufa.hh.ru/vacancy/126449923

Стек NestJs, PostgreSQL + drizzleORM, swagger

Подготовлен docker-compose.yaml для сборки контейнера 

Проект собирается по команде 
docker compose up -d --build 

Миграции к базе данных применяются командой 
npx drizzle-kit migrate

Документация API доступна по ссылке http://localhost:3000/api 

Для просмотра базы данных 
npx drizzle-kit studio 
