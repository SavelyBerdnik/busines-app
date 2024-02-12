select test_password('
{
  "login": "",
  "password": ""
}
');
select test_password('
{
  "login": "",
  "password": "1"
}
');
select test_password('
{
  "login": "1",
  "password": "1"
}
');
select test_password('
{
  "login": "Vlad",
  "password": "1"
}
');
select test_password('
{
  "login": "Vlad",
  "password": "12345"
}
');
select test_password('
{
  "login": "Vlad",
  "password": "V12345"
}
');
select test_password('
{
  "login": "Vlad",
  "password": "Vlad12345"
}
');
select test_password('
{
  "login": "Sokolov",
  "password": "Vlad12345"
}
');
select test_password('
{
  "login": "Sokolov",
  "password": "Vlad12345678902345678"
}
');
select test_password('
{
  "login": "Sokolov",
  "password": "VladSok098765"
}
');

-- previous results:
--
-- lab3.public> select test_password('
--              {
--                "login": "",
--                "password": ""
--              }
--              ')
-- поле "Логин" пустое
-- поле "Пароль" пустое
-- длина пароля должна быть от 5 до 20 символов
-- пароль не должен содержать логин
-- пароль должен содержать заглавные буквы
-- пароль должен содержать строчные буквы
-- [2024-01-15 23:48:10] 1 row retrieved starting from 1 in 36 ms (execution: 7 ms, fetching: 29 ms)
-- lab3.public> select test_password('
--              {
--                "login": "",
--                "password": "1"
--              }
--              ')
-- поле "Логин" пустое
-- длина пароля должна быть от 5 до 20 символов
-- пароль не должен содержать логин
-- пароль должен содержать заглавные буквы
-- пароль должен содержать строчные буквы
-- [2024-01-15 23:48:10] 1 row retrieved starting from 1 in 39 ms (execution: 7 ms, fetching: 32 ms)
-- lab3.public> select test_password('
--              {
--                "login": "1",
--                "password": "1"
--              }
--              ')
-- длина пароля должна быть от 5 до 20 символов
-- пароль не должен содержать логин
-- пароль должен содержать заглавные буквы
-- пароль должен содержать строчные буквы
-- [2024-01-15 23:48:10] 1 row retrieved starting from 1 in 44 ms (execution: 6 ms, fetching: 38 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Vlad",
--                "password": "1"
--              }
--              ')
-- длина пароля должна быть от 5 до 20 символов
-- пароль должен содержать заглавные буквы
-- пароль должен содержать строчные буквы
-- [2024-01-15 23:48:10] 1 row retrieved starting from 1 in 37 ms (execution: 6 ms, fetching: 31 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Vlad",
--                "password": "12345"
--              }
--              ')
-- пароль должен содержать заглавные буквы
-- пароль должен содержать строчные буквы
-- [2024-01-15 23:48:10] 1 row retrieved starting from 1 in 42 ms (execution: 6 ms, fetching: 36 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Vlad",
--                "password": "V12345"
--              }
--              ')
-- пароль должен содержать строчные буквы
-- [2024-01-15 23:48:10] 1 row retrieved starting from 1 in 34 ms (execution: 6 ms, fetching: 28 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Vlad",
--                "password": "Vlad12345"
--              }
--              ')
-- пароль не должен содержать логин
-- [2024-01-15 23:48:11] 1 row retrieved starting from 1 in 35 ms (execution: 5 ms, fetching: 30 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Sokolov",
--                "password": "Vlad12345"
--              }
--              ')
-- success
-- [2024-01-15 23:48:11] 1 row retrieved starting from 1 in 37 ms (execution: 5 ms, fetching: 32 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Sokolov",
--                "password": "Vlad12345678902345678"
--              }
--              ')
-- длина пароля должна быть от 5 до 20 символов
-- [2024-01-15 23:48:11] 1 row retrieved starting from 1 in 38 ms (execution: 5 ms, fetching: 33 ms)
-- lab3.public> select test_password('
--              {
--                "login": "Sokolov",
--                "password": "VladSok098765"
--              }
--              ')
-- success
-- [2024-01-15 23:48:11] 1 row retrieved starting from 1 in 45 ms (execution: 6 ms, fetching: 39 ms)
